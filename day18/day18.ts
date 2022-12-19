import { getInput, range } from "../util";

const sampleInput = [
  "2,2,2",
  "1,2,2",
  "3,2,2",
  "2,1,2",
  "2,3,2",
  "2,2,1",
  "2,2,3",
  "2,2,4",
  "2,2,6",
  "1,2,5",
  "3,2,5",
  "2,1,5",
  "2,3,5",
];

class Cube {
  x: number;
  y: number;
  z: number;

  constructor(coords: string) {
    const [x, y, z] = coords.split(",").map(Number);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  isAdjacentTo(other: Cube) {
    return (
      Math.abs(this.x - other.x) +
        Math.abs(this.y - other.y) +
        Math.abs(this.z - other.z) ===
      1
    );
  }

  getNeighbors(): Cube[] {
    console.log("getting neighbors");
    return [
      new Cube(`${this.x + 1},${this.y},${this.z}`),
      new Cube(`${this.x - 1},${this.y},${this.z}`),
      new Cube(`${this.x},${this.y + 1},${this.z}`),
      new Cube(`${this.x},${this.y - 1},${this.z}`),
      new Cube(`${this.x},${this.y},${this.z + 1}`),
      new Cube(`${this.x},${this.y},${this.z - 1}`),
    ];
  }

  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
}

enum Classification {
  AIR,
  WATER,
  LAVA,
}

class Simulation {
  cubes: Cube[];
  minX: number;
  minY: number;
  minZ: number;
  volume: Classification[][][];

  externalSurfaceCount: number;

  constructor(cubes: Cube[]) {
    this.cubes = cubes;
    this.minX = Math.min(...cubes.map((c) => c.x));
    const maxX = Math.max(...cubes.map((c) => c.x));
    this.minY = Math.min(...cubes.map((c) => c.y));
    const maxY = Math.max(...cubes.map((c) => c.y));
    this.minZ = Math.min(...cubes.map((c) => c.z));
    const maxZ = Math.max(...cubes.map((c) => c.z));

    this.volume = new Array(maxX - this.minX + 3).fill(
      new Array(maxY - this.minY + 3).fill(
        new Array(maxZ - this.minZ + 3).fill(Classification.AIR)
      )
    );

    for (const cube of cubes) {
      this.volume[cube.x - this.minX + 1][cube.y - this.minY + 1][
        cube.z - this.minZ + 1
      ] = Classification.LAVA;
    }
    this.externalSurfaceCount = null;
  }

  getSurfaceArea(): number {
    let touching = 0;

    for (let i = 0; i < this.cubes.length; i++) {
      for (let j = i + 1; j < this.cubes.length; j++) {
        if (this.cubes[i].isAdjacentTo(this.cubes[j])) {
          touching++;
        }
      }
    }

    return this.cubes.length * 6 - touching * 2;
  }
}

function getArea(input: string[]): number {
  let drops = input.map((c) => c.split(",").map(Number));
  drops = drops.map((d) => [d[0] + 1, d[1] + 1, d[2] + 1]);
  const maxX = Math.max(...drops.map((c) => c[0])) + 1;
  const maxY = Math.max(...drops.map((c) => c[1])) + 1;
  const maxZ = Math.max(...drops.map((c) => c[2])) + 1;
  const map = range(maxX + 1).map(() =>
    range(maxY + 1).map(() => range(maxZ + 1).map(() => false))
  );

  drops.forEach(([x, y, z]) => {
    map[x][y][z] = true;
  });

  let sides = 0;
  const transforms = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ];
  const seen = map.map((slice) => slice.map((row) => row.map(() => false)));

  const toVisit = [[0, 0, 0]];
  while (toVisit.length > 0) {
    const [x, y, z] = toVisit.pop();
    if (seen[x][y][z]) {
      continue;
    }
    seen[x][y][z] = true;
    for (const [dx, dy, dz] of transforms) {
      const nx = x + dx;
      const ny = y + dy;
      const nz = z + dz;
      if (nx < 0 || ny < 0 || nz < 0 || nx > maxX || ny > maxY || nz > maxZ) {
        continue;
      }
      if (map[nx][ny][nz]) {
        sides++;
        continue;
      }

      toVisit.push([nx, ny, nz]);
    }
  }

  return sides;
}

function partOne(input: string[]) {
  const cubes: Cube[] = input.map((coords) => new Cube(coords));
  const simulation = new Simulation(cubes);

  console.log(simulation.getSurfaceArea());
}

function partTwo(input: string[]) {
  console.log(getArea(input));
}

// partOne(sampleInput);
// getInput(18).then(partOne);
// partTwo(sampleInput);
getInput(18).then(partTwo);
