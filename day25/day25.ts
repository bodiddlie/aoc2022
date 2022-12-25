import { getInput } from "../util";

const sampleInput = [
  "1=-0-2",
  "12111",
  "2=0=",
  "21",
  "2=01",
  "111",
  "20012",
  "112",
  "1=-1=",
  "1-12",
  "12",
  "1=",
  "122",
];

function convertSnafuToDecimal(snafu: string): number {
  let decimal = 0;
  for (let i = snafu.length - 1; i >= 0; i--) {
    const index = snafu.length - i - 1;
    const digit = snafu[index];
    if (!isNaN(Number(digit))) {
      decimal += Number(digit) * Math.pow(5, i);
    } else if (digit === "-") {
      decimal -= Math.pow(5, i);
    } else if (digit === "=") {
      decimal -= 2 * Math.pow(5, i);
    }
  }
  return decimal;
}

function partOne(input: string[]): string {
  const sum = input.map(convertSnafuToDecimal).reduce((a, b) => a + b);
  return convertDecimalToSnafu(sum);
}

function convertDecimalToSnafu(decimal: number): string {
  const digits: number[] = [];

  while (decimal > 0) {
    digits.push((decimal + 2) % 5);
    decimal = Math.floor((decimal + 2) / 5);
  }

  return digits
    .reverse()
    .map((digit) => {
      switch (digit) {
        case 0:
          return "=";
        case 1:
          return "-";
        case 2:
          return "0";
        case 3:
          return "1";
        case 4:
          return "2";
      }
    })
    .join("");
}

// console.log(partOne(sampleInput));
getInput(25).then(partOne).then(console.log);
