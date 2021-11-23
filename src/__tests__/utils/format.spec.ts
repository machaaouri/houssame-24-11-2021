import * as F from "../../utils/format";

const config = (props: any) => ({
  format: "default",
  precision: 2,
  minPrecision: 0,
  suffix: "",
  fractionSeparator: ".",
  thousandSeparator: ",",
  ...props,
});

describe("Numbers Formatting ", () => {
  test("{format: default} 10", () => {
    expect(F.numberFormatter(config({ format: "default" }))(10)).toEqual("10");
  });

  test("{format: default, precision 4} 0.005", () => {
    expect(
      F.numberFormatter(config({ format: "default", precision: 4 }))(0.005)
    ).toEqual("0.005");
  });

  test("{format: default, minPrecision 4} 0.0005", () => {
    expect(
      F.numberFormatter(config({ format: "default", minPrecision: 4 }))(0.0005)
    ).toEqual("0.0005");
  });

  test("{format: default} 15000.90", () => {
    expect(
      F.numberFormatter(
        config({ format: "default", minPrecision: 2, precision: 2 })
      )(15000.9)
    ).toEqual("15,000.90");
  });

  test("{format: percent} 0.3475", () => {
    expect(F.numberFormatter(config({ format: "percent" }))(0.3475)).toEqual(
      "34.75%"
    );
  });
});
