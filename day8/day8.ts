import { getInput } from "../util";

type Tree = {
  height: number;
  visible: boolean;
  left: number;
  right: number;
  up: number;
  down: number;
};

function getVisibleTrees(input: string[]): Tree[][] {
  const grid: Tree[][] = [];

  for (const line of input) {
    const row = line.split("").map((t) => ({
      height: parseInt(t),
      visible: false,
      left: 0,
      right: 0,
      up: 0,
      down: 0,
    }));
    grid.push(row);
  }

  // check each row from left to right
  for (let y = 0; y < grid.length; y++) {
    let maxHeight = grid[y][0].height;
    for (let x = 0; x < grid[y].length; x++) {
      if (
        x === 0 ||
        x === grid[y].length - 1 ||
        y === 0 ||
        y === grid.length - 1
      ) {
        grid[y][x].visible = true;
      } else {
        if (grid[y][x].height > maxHeight) {
          maxHeight = grid[y][x].height;
          grid[y][x].visible = true;
        }
      }
    }
    maxHeight = grid[y][grid[y].length - 1].height;
    for (let x = grid[y].length - 1; x >= 0; x--) {
      if (grid[y][x].height > maxHeight) {
        maxHeight = grid[y][x].height;
        grid[y][x].visible = true;
      }
    }
  }

  for (let x = 1; x < grid[0].length - 1; x++) {
    let maxHeight = grid[0][x].height;
    for (let y = 1; y < grid.length - 2; y++) {
      if (grid[y][x].height > maxHeight) {
        maxHeight = grid[y][x].height;
        grid[y][x].visible = true;
      }
    }
    maxHeight = grid[grid.length - 1][x].height;
    for (let y = grid.length - 2; y >= 1; y--) {
      if (grid[y][x].height > maxHeight) {
        maxHeight = grid[y][x].height;
        grid[y][x].visible = true;
      }
    }
  }

  return grid;
}

async function partOne(): Promise<number> {
  const input = await getInput(8);

  const grid = getVisibleTrees(input);

  return grid.reduce((acc, row) => {
    return acc + row.filter((t) => t.visible).length;
  }, 0);
}

function getView(grid: Tree[][]) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const height = grid[y][x].height;
      for (let xCheck = x - 1; xCheck >= 0; xCheck--) {
        grid[y][x].left++;
        if (grid[y][xCheck].height >= height) {
          break;
        }
      }
      for (let xCheck = x + 1; xCheck < grid[y].length; xCheck++) {
        grid[y][x].right++;
        if (grid[y][xCheck].height >= height) {
          break;
        }
      }
      for (let yCheck = y - 1; yCheck >= 0; yCheck--) {
        grid[y][x].up++;
        if (grid[yCheck][x].height >= height) {
          break;
        }
      }
      for (let yCheck = y + 1; yCheck < grid.length; yCheck++) {
        grid[y][x].down++;
        if (grid[yCheck][x].height >= height) {
          break;
        }
      }
    }
  }
}

function getScore(grid: Tree[][]): number {
  let max = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const tree = grid[y][x];
      const score = tree.left * tree.right * tree.up * tree.down;
      if (score > max) {
        max = score;
      }
    }
  }

  return max;
}
async function partTwo(): Promise<number> {
  const input = await getInput(8);

  const grid = getVisibleTrees(input);

  getView(grid);

  return getScore(grid);
}

partOne().then(console.log);
partTwo().then(console.log);

const testInput = ["30373", "25512", "65332", "33549", "35390"];

const testGrid = getVisibleTrees(testInput);
getView(testGrid);
// console.log(getScore(testGrid));
