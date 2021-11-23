export interface Config {
  // Websocket URL
  REACT_APP_WS: string;
  // Traded cryptocurrency pairs
  REACT_APP_PRODUCT_IDS: string[];
}

interface EnvVarConfig {
  // The ENV variable name as defined in the `.env`
  env: string;
  // Whether an error should be thrown if this variable was not provided on
  // build / run
  required?: boolean;
  // If there should be a default, provide it here. This will be evaluated
  // _before_ the `required`.
  default?: string;
  // If no ENV is provided, it will default to the value provided in the
  // specified ENV. Note: the key we're defaulting from must be provided
  // _before_ the ENV utilizing it.
  defaultFrom?: keyof Config;
  // Transformation function, a function which will accept the string
  // environment variable and output it however it wants it to be inserted into
  // the resulting `config` object
  transform?: (value: string) => any;

  validation?: (value: any) => boolean;
}

const envVars: EnvVarConfig[] = [
  {
    env: "REACT_APP_WS",
    default: "wss://www.cryptofacilities.com/ws/v1",
    required: true,
  },
  {
    env: "REACT_APP_PRODUCT_IDS",
    default: "PI_XBTUSD,PI_ETHUSD",
    required: false,
    transform: (v: string) => v.split(","),
  },
];

export const config: Config = envVars.reduce(
  (
    config: Partial<Config>,
    {
      env,
      required = true,
      default: def,
      transform = (v: string | undefined) => v,
      validation = () => true,
    }: EnvVarConfig
  ) => {
    let value: string | undefined = process.env[env];
    if (!value && def !== undefined) {
      value = def;
    }

    if (required && !value) {
      throw new Error(`required environment variable "${env}" not set.`);
    }

    value = transform(value!);

    if (!validation(value)) {
      throw new Error(`environment variable "${env}" is invalid.`);
    }

    // Write the the modules export
    config = { ...config, [env]: value };
    // Overwrite the `process.env` as well (just incase that's used too).
    process.env[env] = value;

    return config;
  },
  {}
) as Config;
