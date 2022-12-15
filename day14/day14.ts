import { getInput } from "../util";

const sampleInput = [
  "498,4 -> 498,6 -> 496,6",
  "503,4 -> 502,4 -> 502,9 -> 494,9",
];

enum TileType {
  Air,
  Rock,
  Sand,
  Source,
}

type Tile = {
  type: TileType;
  x: number;
  y: number;
};

type TileMap = {
  [key: string]: Tile;
};

function partOne(input: string[]) {
  const [tileMap, minX, maxX, minY, maxY] = buildCave(input);
  let grains = 1;
  let furthestSand = simulateSand(tileMap, maxY);
  while (furthestSand < maxY) {
    furthestSand = simulateSand(tileMap, maxY);
    if (furthestSand <= maxY) {
      grains++;
    }
  }
  drawCave(tileMap, minX, maxX, minY, maxY);
  console.log(grains);
}

function partTwo(input: string[]) {
  const [tileMap, minX, maxX, minY, maxY] = buildCave(input);
  let grains = 1;
  let furthestSand = simulateSandToGround(tileMap, maxY);
  console.log(furthestSand);
  while (furthestSand[0] !== 500 || furthestSand[1] !== 0) {
    furthestSand = simulateSandToGround(tileMap, maxY);
    grains++;
  }
  drawCave(tileMap, minX, maxX, minY, maxY);
  console.log(grains);
}

function buildCave(input: string[]): [TileMap, number, number, number, number] {
  let minX = 500;
  let maxX = 500;
  let minY = 0;
  let maxY = 0;

  const tileMap: TileMap = {};

  tileMap["500,0"] = { type: TileType.Source, x: 500, y: 0 };

  for (const line of input) {
    const points = line.split(" -> ").map((p) => p.split(",").map(Number));
    for (let i = 0; i < points.length - 1; i++) {
      const lowestX = Math.min(points[i][0], points[i + 1][0]);
      const lowestY = Math.min(points[i][1], points[i + 1][1]);
      const highestX = Math.max(points[i][0], points[i + 1][0]);
      const highestY = Math.max(points[i][1], points[i + 1][1]);
      minX = Math.min(minX, lowestX);
      maxX = Math.max(maxX, highestX);
      minY = Math.min(minY, lowestY);
      maxY = Math.max(maxY, highestY);
      drawPath(points[i], points[i + 1], tileMap);
    }
  }

  return [tileMap, minX, maxX, minY, maxY];
}

function drawCave(
  map: TileMap,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) {
  for (let y = minY; y <= maxY; y++) {
    let row = "";
    for (let x = minX; x <= maxX; x++) {
      if (map[`${x},${y}`]?.type === TileType.Rock) {
        row += "#";
      } else if (map[`${x},${y}`]?.type === TileType.Source) {
        row += "+";
      } else if (map[`${x},${y}`]?.type === TileType.Sand) {
        row += "o";
      } else {
        row += ".";
      }
    }
    console.log(row);
  }
}

function drawPath(start: number[], end: number[], map: TileMap) {
  const [sx, sy] = start;
  const [ex, ey] = end;

  if (sx === ex) {
    // vertical line
    const y1 = Math.min(sy, ey);
    const y2 = Math.max(sy, ey);
    for (let y = y1; y <= y2; y++) {
      map[`${sx},${y}`] = { type: TileType.Rock, x: sx, y };
    }
  } else if (sy === ey) {
    // horizontal line
    const x1 = Math.min(sx, ex);
    const x2 = Math.max(sx, ex);
    for (let x = x1; x <= x2; x++) {
      map[`${x},${sy}`] = { type: TileType.Rock, x, y: sy };
    }
  }
}

function simulateSand(tileMap: TileMap, maxY: number): number {
  let atRest = false;
  let restPos = 0;

  let x = 500;
  let y = 0;
  while (!atRest) {
    const nextTile = tileMap[`${x},${y + 1}`];
    if (nextTile) {
      const leftTile = tileMap[`${x - 1},${y + 1}`];
      if (leftTile) {
        const rightTile = tileMap[`${x + 1},${y + 1}`];
        if (rightTile) {
          // we are at rest
          tileMap[`${x},${y}`] = { type: TileType.Sand, x, y };
          atRest = true;
          restPos = y;
        } else {
          // move down
          x++;
          y++;
        }
      } else {
        // move left
        x--;
        y++;
      }
    } else {
      // move down
      y++;
    }

    if (y > maxY) {
      atRest = true;
      restPos = y;
    }
  }

  return restPos;
}

function simulateSandToGround(
  tileMap: TileMap,
  maxY: number
): [number, number] {
  let atRest = false;

  let x = 500;
  let y = 0;
  while (!atRest) {
    const nextTile = tileMap[`${x},${y + 1}`];
    if (nextTile) {
      const leftTile = tileMap[`${x - 1},${y + 1}`];
      if (leftTile) {
        const rightTile = tileMap[`${x + 1},${y + 1}`];
        if (rightTile) {
          // we are at rest
          tileMap[`${x},${y}`] = { type: TileType.Sand, x, y };
          atRest = true;
          return [x, y];
        } else {
          // move down
          x++;
          y++;
        }
      } else {
        // move left
        x--;
        y++;
      }
    } else {
      // move down
      y++;
    }

    if (y >= maxY + 1) {
      atRest = true;
      tileMap[`${x},${y}`] = { type: TileType.Sand, x, y };
      return [x, y];
    }
  }
}
// partOne(sampleInput);
// getInput(14).then(partOne);
// partTwo(sampleInput);
getInput(14).then(partTwo);
