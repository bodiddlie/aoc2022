import { getInput } from "../util";

async function partOne(): Promise<number> {
  const lines = await getInput(6);

  let foundMarker = false;
  let index = 0;
  const line = lines[0];
  const window = [];

  while (!foundMarker) {
    const char = line[index];
    window.push(char);
    if (window.length > 4) {
      window.shift();
    }

    const set = [...new Set(window)];
    if (set.length === 4) {
      foundMarker = true;
    } else {
      index++;
    }
  }
  return index + 1;
}

async function partTwo(): Promise<number> {
  const lines = await getInput(6);

  let foundMarker = false;
  let index = 0;
  const line = lines[0];
  const window = [];

  while (!foundMarker) {
    const char = line[index];
    window.push(char);
    if (window.length > 14) {
      window.shift();
    }

    const set = [...new Set(window)];
    if (set.length === 14) {
      foundMarker = true;
    } else {
      index++;
    }
  }
  return index + 1;
}

partOne().then(console.log);
partTwo().then(console.log);
