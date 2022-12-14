import { getInput } from "../util";

const sampleInput = [
  "[1,1,3,1,1]",
  "[1,1,5,1,1]",
  "",
  "[[1],[2,3,4]]",
  "[[1],4]",
  "",
  "[9]",
  "[[8,7,6]]",
  "",
  "[[4,4],4,4]",
  "[[4,4],4,4,4]",
  "",
  "[7,7,7,7]",
  "[7,7,7]",
  "",
  "[]",
  "[3]",
  "",
  "[[[]]]",
  "[[]]",
  "",
  "[1,[2,[3,[4,[5,6,7]]]],8,9]",
  "[1,[2,[3,[4,[5,6,0]]]],8,9]",
];

function partOne(input) {
  const pairs: string[][] = [];

  let pair: string[] = [];

  for (const line of input) {
    if (line === "") {
      pairs.push(pair);
      pair = [];
    } else {
      pair.push(line);
    }
  }
  pairs.push(pair);

  let sum = 0;
  for (const [idx, p] of pairs.entries()) {
    const result = comparePair(JSON.parse(p[0]), JSON.parse(p[1]));
    console.log(p, result);
    sum += result !== -1 ? idx + 1 : 0;
  }

  console.log(sum);
}

function partTwo(input) {
  const stripped = input.filter((l) => l !== "");
  const two = "[[2]]";
  const six = "[[6]]";
  stripped.push(two);
  stripped.push(six);

  for (let i = 0; i < stripped.length - 1; i++) {
    for (let j = 0; j < stripped.length - i - 1; j++) {
      const left = JSON.parse(stripped[j]);
      const right = JSON.parse(stripped[j + 1]);
      if (comparePair(left, right) === -1) {
        const temp = stripped[j];
        stripped[j] = stripped[j + 1];
        stripped[j + 1] = temp;
      }
    }
  }

  const twoIdx = stripped.indexOf(two) + 1;
  const sixIdx = stripped.indexOf(six) + 1;
  console.log(twoIdx * sixIdx);
}

function comparePair(left, right): number {
  if (!left && left !== 0) return 1;
  if (!right && right !== 0) return -1;

  if (Array.isArray(left) || Array.isArray(right)) {
    const leftArray = Array.isArray(left) ? left : [left];
    const rightArray = Array.isArray(right) ? right : [right];
    return compareArrays(leftArray, rightArray);
  }

  if (left === right) return 0;
  return left < right ? 1 : -1;
}

function compareArrays(left, right): number {
  const longest = Math.max(left.length, right.length);

  for (let i = 0; i < longest; i++) {
    const result = comparePair(left[i], right[i]);
    if (result !== 0) return result;
  }

  return 0;
}

// partOne(sampleInput);
// getInput(13).then(partOne);
// partTwo(sampleInput);
getInput(13).then(partTwo);
