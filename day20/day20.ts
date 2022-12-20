import { getInput } from "../util";

const sampleInput = ["1", "2", "-3", "3", "-2", "0", "4"];

type Num = {
  num: number;
};

function mix(numbers: Num[], times = 1): number {
  const buffer = [...numbers];

  while (times--) {
    for (const n of numbers) {
      const idx = buffer.indexOf(n);
      buffer.splice(idx, 1);
      buffer.splice((idx + n.num) % buffer.length, 0, n);
    }
  }

  const zeroIndex = buffer.findIndex((n) => n.num === 0);
  const landmarks = [1000, 2000, 3000].map(
    (l) => buffer[(zeroIndex + l) % buffer.length].num
  );
  return landmarks.reduce((acc, cur) => acc + cur, 0);
}

function partOne(input: string[]) {
  const numbers = input.map((n) => ({ num: Number(n) }));
  return mix(numbers);
}

function partTwo(input: string[]) {
  const numbers = input.map((n) => ({ num: Number(n) * 811589153 }));
  return mix(numbers, 10);
}

// partOne(sampleInput);
// getInput(20).then(partOne).then(console.log);
// console.log(partTwo(sampleInput));
getInput(20).then(partTwo).then(console.log);
