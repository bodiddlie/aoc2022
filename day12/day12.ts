import { getInput } from "../util";

const sampleInput = [
  "Sabqponm",
  "abcryxxl",
  "accszExk",
  "acctuvwj",
  "abdefghi",
];

const heights = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  S: 1,
  E: 26,
};

type Point = {
  key: string;
  char: string;
  height: number;
  visited: boolean;
  shortestPath: number;
};

function partOne(input) {
  const [grid, endX, endY, startX, startY] = buildGraph(input);

  calculatePaths(grid, endX, endY);

  console.log(grid[startY][startX].shortestPath);
}

function partTwo(input) {
  const [grid, endX, endY] = buildGraph(input);

  calculatePaths(grid, endX, endY);

  let min = Infinity;
  for (const row of grid) {
    for (const point of row) {
      if (point.char === "a") {
        min = Math.min(min, point.shortestPath);
      }
    }
  }

  console.log(min);
}

function buildGraph(input) {
  const grid: Point[][] = [];
  let startX,
    startY,
    endX,
    endY = 0;

  for (let y = 0; y < input.length; y++) {
    const row: Point[] = [];
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "S") {
        startX = x;
        startY = y;
      }
      if (input[y][x] === "E") {
        endX = x;
        endY = y;
      }
      const point: Point = {
        key: `${x},${y}`,
        char: input[y][x],
        height: heights[input[y][x]],
        visited: false,
        shortestPath: Infinity,
      };
      row.push(point);
    }
    grid.push(row);
  }
  return [grid, endX, endY, startX, startY];
}

function getNeighbors(point: Point, grid: Point[][]) {
  const neighbors = [];
  const [x, y] = point.key.split(",").map((n) => parseInt(n));
  if (x > 0) {
    neighbors.push(grid[y][x - 1]);
  }
  if (x < grid[y].length - 1) {
    neighbors.push(grid[y][x + 1]);
  }
  if (y > 0) {
    neighbors.push(grid[y - 1][x]);
  }
  if (y < grid.length - 1) {
    neighbors.push(grid[y + 1][x]);
  }
  return neighbors;
}

function calculatePaths(grid, endX, endY) {
  grid[endY][endX].shortestPath = 0;
  const queue = [grid[endY][endX]];

  while (queue.length > 0) {
    const point = queue.shift();
    point.visited = true;

    const neighbors = getNeighbors(point, grid);

    for (const neighbor of neighbors) {
      if (point.height >= neighbor.height - 1) {
        const shortestDist = neighbor.shortestPath + 1;
        const currentShortest = point.shortestPath;
        point.shortestPath = Math.min(currentShortest, shortestDist);
      }
      if (!neighbor.visited && point.height <= neighbor.height + 1) {
        queue.push(neighbor);
        neighbor.visited = true;
      }
    }
  }
}

// partOne(sampleInput);
// getInput(12).then(partOne);

// partTwo(sampleInput);
getInput(12).then(partTwo);
