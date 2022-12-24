import { getInput, modulo } from "../util";

const sampleInput = [
  "        ...#",
  "        .#..",
  "        #...",
  "        ....",
  "...#.......#",
  "........#...",
  "..#....#....",
  "..........#.",
  "        ...#....",
  "        .....#..",
  "        .#......",
  "        ......#.",
  "",
  "10R5L5R10L4R5L5",
];

function partOne(input: string[]) {
  const endOfMap = input.findIndex((l) => l === "");
  const longestLine = Math.max(...input.map((l) => l.length));
  const map = input
    .slice(0, endOfMap)
    .map((l) => l.padEnd(longestLine, " "))
    .map((l) => l.split(""));
  const instructions = input[endOfMap + 1].split(/([A-Z])/g);

  let ypos = 0;
  let xpos = map[0].findIndex((c) => c === ".");

  let facing = "right";

  for (const instruction of instructions) {
    if (!isNaN(Number(instruction))) {
      // move
      const steps = Number(instruction);
      for (let i = 0; i < steps; i++) {
        switch (facing) {
          case "right": {
            let newx = xpos + 1;
            if (newx >= map[ypos].length || map[ypos][newx] === " ") {
              newx = 0;
              while (map[ypos][newx] === " ") {
                newx++;
              }
              if (map[ypos][newx] === "#") {
                break;
              }
              xpos = newx;
            } else if (map[ypos][newx] === ".") {
              xpos = newx;
              break;
            }
            break;
          }
          case "left": {
            let newx = xpos - 1;
            if (newx < 0 || map[ypos][newx] === " ") {
              newx = map[ypos].length - 1;
              while (map[ypos][newx] === " ") {
                newx--;
              }
              if (map[ypos][newx] === "#") {
                break;
              }
              xpos = newx;
            } else if (map[ypos][newx] === ".") {
              xpos = newx;
              break;
            }
            break;
          }
          case "up": {
            let newy = ypos - 1;
            if (newy < 0 || map[newy][xpos] === " ") {
              newy = map.length - 1;
              while (map[newy][xpos] === " ") {
                newy--;
              }
              if (map[newy][xpos] === "#") {
                break;
              }
              ypos = newy;
            } else if (map[newy][xpos] === ".") {
              ypos = newy;
              break;
            }
            break;
          }
          case "down": {
            let newy = ypos + 1;
            if (newy >= map.length || map[newy][xpos] === " ") {
              newy = 0;
              while (map[newy][xpos] === " ") {
                newy++;
              }
              if (map[newy][xpos] === "#") {
                break;
              }
              ypos = newy;
            } else if (map[newy][xpos] === ".") {
              ypos = newy;
              break;
            }
            break;
          }
        }
      }
    } else {
      // turn
      switch (facing) {
        case "right": {
          facing = instruction === "R" ? "down" : "up";
          break;
        }
        case "left": {
          facing = instruction === "R" ? "up" : "down";
          break;
        }
        case "up": {
          facing = instruction === "R" ? "right" : "left";
          break;
        }
        case "down": {
          facing = instruction === "R" ? "left" : "right";
          break;
        }
      }
    }
  }

  // printMap(map, xpos, ypos);
  return 1000 * (ypos + 1) + 4 * (xpos + 1) + calculateFacingScore(facing);
}

function calculateFacingScore(facing) {
  switch (facing) {
    case "right": {
      return 0;
    }
    case "down": {
      return 1;
    }
    case "left": {
      return 2;
    }
    case "up": {
      return 3;
    }
  }
}

// cube faces:
//

function printMap(map: string[][], xpos: number, ypos: number) {
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
      if (x === xpos && y === ypos) {
        line += "X";
      } else {
        line += map[y][x];
      }
    }
    console.log(line);
  }
}

// console.log(partOne(sampleInput));
// getInput(22).then(partOne).then(console.log);

const directionsClockwise = ["east", "south", "west", "north"];
const cubeFacesClockwise = {
  u: ["r", "f", "l", "b"],
  r: ["u", "b", "d", "f"],
  f: ["u", "r", "d", "l"],
  d: [],
  l: [],
  b: [],
};
cubeFacesClockwise.d = [...cubeFacesClockwise.u].reverse();
cubeFacesClockwise.l = [...cubeFacesClockwise.r].reverse();
cubeFacesClockwise.b = [...cubeFacesClockwise.f].reverse();

// L.runTests(
//   (args) => run(args),
//   [
//     parseInput(`        ...#
//         .#..
//         #...
//         ....
// ...#.......#
// ........#...
// ..#....#....
// ..........#.
//         ...#....
//         .....#..
//         .#......
//         ......#.
//
// 10R5L5R10L4R5L5`),
//     5031,
//   ]
// );

function partTwo(input: string[]) {
  const map = parseInput(input);
  console.log(run(map));
}

function run(input) {
  const { faces, faceMap, size, instructions } = input;

  calculateFaceConnectivity(faces, faceMap);

  let f = 0;
  let x = 0;
  let y = 0;
  let dir = "east";

  for (const inst of instructions) {
    if (inst === "L") {
      dir = directionsClockwise[(directionsClockwise.indexOf(dir) + 3) % 4];
    } else if (inst === "R") {
      dir = directionsClockwise[(directionsClockwise.indexOf(dir) + 1) % 4];
    } else {
      for (let i = 0; i < inst; ++i) {
        const [dx, dy] = {
          east: [1, 0],
          south: [0, 1],
          west: [-1, 0],
          north: [0, -1],
        }[dir];

        let newX = x + dx;
        let newY = y + dy;
        let newF = f;
        let newDir = dir;

        if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
          newX = modulo(newX, size);
          newY = modulo(newY, size);
          newF = faces.findIndex(({ face }) => face === faces[f][dir]);

          const dirIdx = directionsClockwise.indexOf(dir);

          let newDirIdx = dirIdx;
          while (
            faces[newF][directionsClockwise[(newDirIdx + 2) % 4]] !==
            faces[f].face
          ) {
            [newX, newY] = [size - 1 - newY, newX];
            newDirIdx = (newDirIdx + 1) % 4;
          }
          newDir = directionsClockwise[newDirIdx];
        }

        if (faces[newF].map[newY][newX] === "#") {
          break;
        }

        x = newX;
        y = newY;
        f = newF;
        dir = newDir;
      }
    }
  }

  const i = faces[f].i * size + y + 1;
  const j = faces[f].j * size + x + 1;
  return 1000 * i + 4 * j + { east: 0, south: 1, west: 2, north: 3 }[dir];
}

function calculateFaceConnectivity(faces, faceMap) {
  faces[0].face = "u";
  populateNeighbors(faces[0], "east", "r");

  const closed = new Set();
  (function walk(n) {
    closed.add(n);

    const { i, j } = faces[n];
    const neighbors = {
      east: faceMap[i][j + 1],
      south: faceMap[i + 1] && faceMap[i + 1][j],
      west: faceMap[i][j - 1],
      north: faceMap[i - 1] && faceMap[i - 1][j],
    };

    if (neighbors.east && !closed.has(neighbors.east)) {
      faces[neighbors.east].face = faces[n].east;
      populateNeighbors(faces[neighbors.east], "west", faces[n].face);
      walk(neighbors.east);
    }
    if (neighbors.south && !closed.has(neighbors.south)) {
      faces[neighbors.south].face = faces[n].south;
      populateNeighbors(faces[neighbors.south], "north", faces[n].face);
      walk(neighbors.south);
    }
    if (neighbors.west && !closed.has(neighbors.west)) {
      faces[neighbors.west].face = faces[n].west;
      populateNeighbors(faces[neighbors.west], "east", faces[n].face);
      walk(neighbors.west);
    }
    if (neighbors.north && !closed.has(neighbors.north)) {
      faces[neighbors.north].face = faces[n].north;
      populateNeighbors(faces[neighbors.north], "south", faces[n].face);
      walk(neighbors.north);
    }
  })(0);
}

function populateNeighbors(face, direction, neighbor) {
  const directionIdx = directionsClockwise.indexOf(direction);
  const faceIdx = cubeFacesClockwise[face.face].indexOf(neighbor);

  for (let i = 0; i < 4; ++i) {
    const d = directionsClockwise[(directionIdx + i) % 4];
    const s = cubeFacesClockwise[face.face][(faceIdx + i) % 4];
    face[d] = s;
  }
}

function parseInput(input) {
  const endOfMap = input.findIndex((l) => l === "");
  const map = input.slice(0, endOfMap);
  let instructions = input[endOfMap + 1]; //.split(/([A-Z])/g);

  const size = Math.sqrt(
    map
      .join("")
      .split("")
      .filter((c) => c != " ").length / 6
  );

  const faces = [];
  const faceMap = [];
  let n = 0;
  for (let i = 0; i < map.length / size; ++i) {
    faceMap[i] = [];
    for (
      let j = 0;
      j < Math.max(...map.map((line) => line.length)) / size;
      ++j
    ) {
      const c = map[i * size][j * size];
      if (c != null && c !== " ") {
        faceMap[i][j] = n;
        faces[n] = {
          i,
          j,
          map: map
            .slice(i * size, (i + 1) * size)
            .map((line) => line.slice(j * size, (j + 1) * size).split("")),
        };
        ++n;
      } else {
        faceMap[i][j] = null;
      }
    }
  }

  instructions = instructions
    .match(/(\d+)|([A-Z]+)/gi)
    .map((inst) => (/\d+/.test(inst) ? parseInt(inst, 10) : inst));

  return { faces, faceMap, size, instructions };
}

// partTwo(sampleInput);
getInput(22).then(partTwo);
