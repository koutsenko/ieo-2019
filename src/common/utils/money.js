/**
 * Расставляет нули по тройкам.
 * Добавляет суффикс цены если надо.
 *
 * На выходе строка.
 */
export const formatMoney = (value, suffix, suffixPos) => {
  if ([undefined, null].includes(value)) {
    return value;
  }

  if (!validMoney(value)) {
    return value;
  }

  const parts = String(value).split(".");
  const mainPart = parts[0];
  const floatPart = parts[1];
  const reversed = mainPart
    .split("")
    .reverse()
    .join("");
  const chunks = reversed.match(/.{1,3}/g);
  const spaced = chunks.join(" ");
  const restored = spaced
    .split("")
    .reverse()
    .join("");

  let result = restored;

  if (floatPart !== undefined) {
    result = `${result}.${floatPart}`;
  }
  if (suffix !== undefined) {
    result =
      suffixPos === "before" ? `${suffix}${result}` : `${result}${suffix}`;
  }

  return result;
};

/**
 * Обратная операция на случай если форматированное число - ввод в инпуте.
 * Пока без поддержки suffix, добавлю по мере надобности.
 *
 * На выходе строка.
 */
export const unformatMoney = value => {
  if ([undefined, null].includes(value)) {
    return value;
  }

  // trim all spaces
  const result = value.replace(/ /g, "");

  return result;
};

export const trimDigits = (raw_value, passed_count) => {
  const count = passed_count === undefined ? 2 : passed_count;
  if ([undefined, null].includes(raw_value)) {
    return raw_value;
  }

  const value = parseFloat(raw_value);
  const helper = parseInt(`1${"0".repeat(count)}`, 10);

  // https://stackoverflow.com/questions/4098685/rounding-numbers-to-2-digits-after-comma#comment76933113_20500616
  const result = (Math.round(value * helper) / helper).toFixed(count);
  const withoutLeadingZeroes = Number(result);

  return withoutLeadingZeroes;
};

export const validMoney = (value, allowZero) => {
  //https://stackoverflow.com/a/1830632
  const isNumber = !isNaN(parseFloat(value)) && isFinite(value);
  const isPositive = allowZero ? parseFloat(value) >= 0 : parseFloat(value) > 0;
  const notDotEnd = String(value).slice(-1) !== ".";
  const notDotStart = String(value).slice(0) !== ".";
  const result = isNumber && isPositive && notDotEnd && notDotStart;

  return result;
};

export const isFloat = value => {
  const n = parseFloat(value);

  // https://stackoverflow.com/a/3886106
  return Number(n) === n && n % 1 !== 0;
};

export const fmt = (value, dig) => formatMoney(trimDigits(value, dig));

export const fmtDividend = ins => {
  let dividend_value = "";

  if (ins.dividend !== undefined) {
    dividend_value = ins.dividend === "" ? "" : fmt(ins.dividend);
  } else if (ins["%,dividend"] !== undefined) {
    dividend_value =
      ins["%,dividend"] === "" ? "" : `${fmt(ins["%,dividend"])} %`;
  }

  return dividend_value;
};
