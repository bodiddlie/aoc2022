const sampleInput = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";

type Piece = {
  shape: string[][];
  height: number;
  width: number;
};

const pieces: Piece[] = [
  {
    shape: [["#", "#", "#", "#"]],
    height: 1,
    width: 4,
  },
  {
    shape: [
      [".", "#", "."],
      ["#", "#", "#"],
      [".", "#", "."],
    ],
    height: 3,
    width: 3,
  },
  {
    shape: [
      ["#", "#", "#"],
      [".", ".", "#"],
      [".", ".", "#"],
    ],
    height: 3,
    width: 3,
  },
  {
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

partOne(sampleInput);
