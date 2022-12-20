import { getInput } from "../util";

const sampleInput = ["1", "2", "-3", "3", "-2", "0", "4"];

function partOne(input: string[], times: number = 1) {
  const numbers = input.map((n) => parseInt(n, 10));

  let count = 0;
  const buffer = [...numbers];

  while (count < times) {
    count++;
    for (const [idx, num] of numbers.entries()) {
      buffer.splice(idx, 1);
      buffer.splice((idx + num) % buffer.length, 0, num);
    }
  }

  const zeroIndex = buffer.findIndex((n) => n === 0);
  const landmarks = [1000, 2000, 3000].map(
    (l) => buffer[(zeroIndex + l) % buffer.length]
  );
  return landmarks.reduce((acc, cur) => acc + cur, 0);
}

// console.log(partOne(sampleInput));
getInput(20).then(partOne).then(console.log);
