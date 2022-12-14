import { getInput } from "../util";

const s = ["[[1],[2,3,4]]", "[[1],2,3,4]"];

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
    const result = comparePair(p[0], p[1]);
    console.log(p, result);
    sum += result ? idx + 1 : 0;
  }

  console.log(sum);
}

function comparePair(a: string, b: string): boolean {
  const left = JSON.parse(a);
  const right = JSON.parse(b);

  console.log(left, right);
  let correctOrder = true;
  // loop over left and right
  for (let i = 0; i < left.length; i++) {
    const leftItem = left[i];
    const rightItem = right[i];

    if (leftItem && !rightItem) {
      correctOrder = false;
      break;
    } else if (typeof leftItem === "number" && typeof rightItem === "number") {
      if (leftItem > rightItem) {
        correctOrder = false;
        break;
      } else if (leftItem < rightItem) {
        break;
      }
    } else if (Array.isArray(leftItem) && Array.isArray(rightItem)) {
      if (!comparePair(JSON.stringify(leftItem), JSON.stringify(rightItem))) {
        correctOrder = false;
        break;
      }
    } else if (typeof leftItem === "number" && Array.isArray(rightItem)) {
      if (!comparePair(JSON.stringify([leftItem]), JSON.stringify(rightItem))) {
        correctOrder = false;
        break;
      }
    } else if (Array.isArray(leftItem) && typeof rightItem === "number") {
      if (!comparePair(JSON.stringify(leftItem), JSON.stringify([rightItem]))) {
        correctOrder = false;
        break;
      }
    }
  }

  return correctOrder;
}

partOne(s);
// partOne(sampleInput);
// getInput(13).then(partOne);
