import { IFormatter, NumberFormat, Tolerance } from "../types";

//Compute the number of significant digits in x
function significant(x: number): number {
  let abs = Math.abs(x);
  let tail = abs - Math.floor(abs); // value in [0..1[
  let digits = 0;

  while (isFinite(tail) && tail >= 0.001 && tail < 0.999) {
    digits++;
    tail = tail * 10;
    tail = tail - Math.floor(tail);
  }

  return digits;
}

// Executes number formattig pipe with the appropriate configuration
function pipeline(
  scale: number,
  suffix: string,
  // Precision range: describes the exact position,
  // at which the number of significant digits will be rounded
  precision: Tolerance,
  // Thousand & decimal separators
  thousandSeparator: string,
  fractionSeparator: string
) {
  return function (value: number): string {
    const scaled = value / scale;
    const d = Math.max(
      precision.minPrecision,
      Math.min(significant(scaled), precision.precision)
    );

    let text = scaled.toFixed(d);
    if (fractionSeparator !== ".") text = text.replace(".", fractionSeparator);
    if (scaled >= 1000 || scaled < -1000)
      text = text.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    return [text, suffix].join("");
  };
}

export const numberFormatter = (nf: NumberFormat): IFormatter => {
  const tolerance = { precision: nf.precision, minPrecision: nf.minPrecision };

  const scaleOf = {
    default: 1,
    percent: 0.01,
  };

  const suffixOf = {
    default: "",
    percent: "%",
  };

  return pipeline(
    scaleOf[nf.format],
    suffixOf[nf.format],
    tolerance,
    nf.thousandSeparator,
    nf.fractionSeparator
  );
};

export const format = numberFormatter({
  format: "default",
  precision: 0,
  minPrecision: 0,
  fractionSeparator: ".",
  thousandSeparator: ",",
});

export const priceFormat = numberFormatter({
  format: "default",
  precision: 3,
  minPrecision: 3,
  fractionSeparator: ".",
  thousandSeparator: ",",
});

export const spreadFormat = numberFormatter({
  format: "default",
  precision: 1,
  minPrecision: 1,
  fractionSeparator: ".",
  thousandSeparator: ",",
});

export const delta = numberFormatter({
  format: "percent",
  precision: 2,
  minPrecision: 2,
  fractionSeparator: ".",
  thousandSeparator: ",",
});
