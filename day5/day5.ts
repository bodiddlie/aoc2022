import { getInput } from "../util";

type Stack = {
  index: number;
  id: string;
  stack: string[];
};

async function partOne(): Promise<string> {
  const stacks: Stack[] = [];

  const lines = await getInput(5);

  const blankIndex = lines.findIndex((line) => line.trim() === "");

  const crates = lines[blankIndex - 1].trim().split(/\s+/);
  const stackList = lines[blankIndex - 1];

  for (const crate of crates) {
    const index = stackList.indexOf(crate);
    stacks.push({ index, id: crate, stack: [] });
  }

  buildStacks(lines.slice(0, blankIndex - 1), stacks);

  moveCrates(lines.slice(blankIndex + 1), stacks);

  let result = "";
  for (const stack of stacks) {
    result += stack.stack[0];
  }
  return result;
}

async function partTwo(): Promise<string> {
  const stacks: Stack[] = [];

  const lines = await getInput(5);

  const blankIndex = lines.findIndex((line) => line.trim() === "");

  const crates = lines[blankIndex - 1].trim().split(/\s+/);
  const stackList = lines[blankIndex - 1];

  for (const crate of crates) {
    const index = stackList.indexOf(crate);
    stacks.push({ index, id: crate, stack: [] });
  }

  buildStacks(lines.slice(0, blankIndex - 1), stacks);

  moveCratesTwo(lines.slice(blankIndex + 1), stacks);

  let result = "";
  for (const stack of stacks) {
    result += stack.stack[0];
  }
  return result;
}

// partOne().then(console.log);
partTwo().then(console.log);

function buildStacks(lines: string[], stacks) {
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      if (line[i].charCodeAt(0) >= 65 && line[i].charCodeAt(0) <= 90) {
        const dest = stacks.find((stack) => stack.index === i);
        if (dest) {
          dest.stack.push(line[i]);
        }
      }
    }
  }
}

function moveCrates(instructions: string[], stacks) {
  for (const instruction of instructions) {
    const tokens = instruction.split(" ");
    const count = parseInt(tokens[1]);
    const from = parseInt(tokens[3]);
    const to = parseInt(tokens[5]);

    const dest = stacks[to - 1];
    const source = stacks[from - 1];
    for (let i = 0; i < count; i++) {
      if (dest && source) {
        dest.stack.unshift(source.stack.shift());
      }
    }
  }
}

function moveCratesTwo(instructions: string[], stacks) {
  for (const instruction of instructions) {
    const tokens = instruction.split(" ");
    const count = parseInt(tokens[1]);
    const from = parseInt(tokens[3]);
    const to = parseInt(tokens[5]);

    const dest = stacks[to - 1];
    const source = stacks[from - 1];
    const tmp = [];
    for (let i = 0; i < count; i++) {
      if (source) {
        tmp.push(source.stack.shift());
      }
    }

    if (dest) {
      dest.stack.unshift(...tmp);
    }
  }
}
