import { getInput } from "../util";

const sampleInput = ["R 4", "U 4", "L 3", "D 1", "R 4", "D 1", "L 5", "R 2"];

const biggerInput = [
  "R 5",
  "U 8",
  "L 8",
  "D 3",
  "R 17",
  "D 10",
  "L 25",
  "U 20",
];

type Pos = {
  x: number;
  y: number;
};

type Tracker = {
  [key: string]: number;
};

function getDirectionAndMagitude(
  instruction: string
): [string, number, number] {
  const [direction, distanceNum] = instruction.split(" ");
  const distance = parseInt(distanceNum);

  let axis = "x";
  let delta = 1;

  switch (direction) {
    case "R":
      axis = "x";
      delta = 1;
      break;
    case "L":
      axis = "x";
      delta = -1;
      break;
    case "U":
      axis = "y";
      delta = 1;
      break;
    case "D":
      axis = "y";
      delta = -1;
      break;
  }

  return [axis, distance, delta];
}
function partOne(input): number {
  const tailPositions: Tracker = {};
  tailPositions["0,0"] = 1;
  const head: Pos = { x: 0, y: 0 };
  const tail: Pos = { x: 0, y: 0 };

  for (const instruction of input) {
    const [axis, distance, delta] = getDirectionAndMagitude(instruction);

    for (let i = 0; i < distance; i++) {
      head[axis] += delta;

      moveKnot(head, tail);

      tailPositions[`${tail.x},${tail.y}`] = 1;
    }
  }

  return Object.keys(tailPositions).length;
}

function partTwo(input): number {
  const tailPositions: Tracker = {};
  tailPositions["0,0"] = 1;
  const knots: Pos[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  const head: Pos = knots[0];
  const tail: Pos = knots[knots.length - 1];

  for (const instruction of input) {
    const [axis, distance, delta] = getDirectionAndMagitude(instruction);

    for (let i = 0; i < distance; i++) {
      head[axis] += delta;

      // move next knot
      for (let j = 1; j < knots.length; j++) {
        moveKnot(knots[j - 1], knots[j]);
      }

      tailPositions[`${tail.x},${tail.y}`] = 1;
    }
  }

  return Object.keys(tailPositions).length;
}

function moveKnot(head: Pos, tail: Pos) {
  const sameRow = head.y === tail.y;
  const sameCol = head.x === tail.x;
  const xDist = Math.abs(head.x - tail.x);
  const yDist = Math.abs(head.y - tail.y);
  const touching =
    (sameRow && xDist <= 1) ||
    (sameCol && yDist <= 1) ||
    (xDist === 1 && yDist === 1);
  if (!touching) {
    const xsign = Math.sign(head.x - tail.x);
    const ysign = Math.sign(head.y - tail.y);
    tail.x += xsign;
    tail.y += ysign;
  }
}

// console.log(partOne(sampleInput));
// console.log(partTwo(biggerInput));

getInput(9).then(partOne).then(console.log);
getInput(9).then(partTwo).then(console.log);
