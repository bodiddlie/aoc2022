import { getInput } from "../util";

const sampleInput = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";

type Piece = {
  id: number;
  shape: string[][];
  height: number;
  width: number;
};

const pieces: Piece[] = [
  {
    id: 0,
    shape: [["#", "#", "#", "#"]],
    height: 1,
    width: 4,
  },
  {
    id: 1,
    shape: [
      [".", "#", "."],
      ["#", "#", "#"],
      [".", "#", "."],
    ],
    height: 3,
    width: 3,
  },
  {
    id: 2,
    shape: [
      ["#", "#", "#"],
      [".", ".", "#"],
      [".", ".", "#"],
    ],
    height: 3,
    width: 3,
  },
  {
    id: 3,
    shape: [["#"], ["#"], ["#"], ["#"]],
    height: 4,
    width: 1,
  },
  {
    id: 4,
    shape: [
      ["#", "#"],
      ["#", "#"],
    ],
    height: 2,
    width: 2,
  },
];

type Position = [number, number];

function checkPosition(
  pos: Position,
  piece: Piece,
  map: Map<string, boolean>
): boolean {
  if (pos[1] < 0) return false;
  if (pos[0] < 0 || pos[0] + piece.width > 7) return false;
  for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[0].length; j++) {
      if (piece.shape[i][j] === "#") {
        if (map.has([pos[0] + j, pos[1] + i].toString())) return false;
      }
    }
  }
  return true;
}

function partOne(input) {
  const jets = input.split("").map((c) => (c === ">" ? 1 : -1));
  const map = new Map<string, boolean>();

  let top = 0;
  let droppedRocks = 0;
  let rockIdx = 0;
  let windIdx = 0;
  while (droppedRocks < 2022) {
    const currRock = pieces[rockIdx % pieces.length];
    rockIdx++;
    const currPos: Position = [2, top + 3];
    let stopped = false;
    while (!stopped) {
      const move = jets[windIdx % jets.length];
      windIdx++;
      if (checkPosition([currPos[0] + move, currPos[1]], currRock, map)) {
        currPos[0] += move;
      }
      if (checkPosition([currPos[0], currPos[1] - 1], currRock, map)) {
        currPos[1] -= 1;
      } else {
        stopped = true;
        top = Math.max(top, currRock.height + currPos[1]);
        for (let i = 0; i < currRock.shape.length; i++) {
          for (let j = 0; j < currRock.shape[0].length; j++) {
            if (currRock.shape[i][j] === "#")
              map.set([currPos[0] + j, currPos[1] + i].toString(), true);
          }
        }
      }
    }
    droppedRocks++;
  }

  console.log(top);
}

type SimulationAnswer = {
  moves: Move[];
  height: number;
};

type Move = {
  id: number;
  xPos: number;
};

const simulateDrops = (
  jets: number[],
  howManyRocksToDrop: number
): SimulationAnswer => {
  const map = new Map<string, boolean>();
  const moves: Move[] = [];

  let top = 0;
  let droppedRocks = 0;
  let rockIdx = 0;
  let windIdx = 0;
  while (droppedRocks < howManyRocksToDrop) {
    const currRock = pieces[rockIdx % pieces.length];
    rockIdx++;
    const currPos: Position = [2, top + 3];
    let stopped = false;
    while (!stopped) {
      const move = jets[windIdx % jets.length];
      windIdx++;
      if (checkPosition([currPos[0] + move, currPos[1]], currRock, map)) {
        currPos[0] += move;
      }
      if (checkPosition([currPos[0], currPos[1] - 1], currRock, map)) {
        // can go down
        currPos[1] -= 1;
      } else {
        // touched down
        stopped = true;
        top = Math.max(top, currRock.height + currPos[1]);
        for (let i = 0; i < currRock.shape.length; i++) {
          for (let j = 0; j < currRock.shape[0].length; j++) {
            if (currRock.shape[i][j] === "#")
              map.set([currPos[0] + j, currPos[1] + i].toString(), true);
          }
        }
      }
    }
    droppedRocks++;
    moves.push({
      id: currRock.id,
      xPos: currPos[0],
    });
  }

  return {
    moves: moves,
    height: top,
  };
};

function partTwo(input) {
  const jets = input.split("").map((c) => (c === ">" ? 1 : -1));
  const rocksToDropToFindLoop = 10000;
  const firstRun = simulateDrops(jets, rocksToDropToFindLoop);

  let maxlen = -1;
  let loopStart = 0;
  let loopLenght = 0;
  for (
    let firstStart = 0;
    firstStart < rocksToDropToFindLoop - 1;
    firstStart++
  ) {
    for (
      let nextStart = firstStart + 1;
      nextStart < rocksToDropToFindLoop;
      nextStart++
    ) {
      let first = firstStart;
      let next = nextStart;
      while (next < rocksToDropToFindLoop) {
        if (
          firstRun.moves[first].id != firstRun.moves[next].id ||
          firstRun.moves[first].xPos != firstRun.moves[next].xPos
        )
          break;
        first++;
        next++;
      }
      if (first - firstStart > maxlen) {
        maxlen = first - firstStart;
        loopStart = firstStart;
        loopLenght = nextStart - firstStart;
      }
    }
  }

  const linesInStart = simulateDrops(jets, loopStart).height;
  const linesInLoop =
    simulateDrops(jets, loopStart + loopLenght).height - linesInStart;
  const howManyLoops = Math.floor((1000000000000 - loopStart) / loopLenght);
  const rocksInLoops = howManyLoops * loopLenght;
  const rocksAfterLoops = 1000000000000 - loopStart - rocksInLoops;
  const linesAfterLoop =
    simulateDrops(jets, loopStart + loopLenght + rocksAfterLoops).height -
    linesInLoop -
    linesInStart;

  const answer = linesInStart + linesInLoop * howManyLoops + linesAfterLoop;

  console.log(answer);
}

// partOne(sampleInput);
// getInput(17)
//   .then((lines) => lines[0])
//   .then(partOne);
// partTwo(sampleInput);
getInput(17)
  .then((lines) => lines[0])
  .then(partTwo);
