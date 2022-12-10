import { getInput } from "../util";

const sampleInput = [
  "addx 15",
  "addx -11",
  "addx 6",
  "addx -3",
  "addx 5",
  "addx -1",
  "addx -8",
  "addx 13",
  "addx 4",
  "noop",
  "addx -1",
  "addx 5",
  "addx -1",
  "addx 5",
  "addx -1",
  "addx 5",
  "addx -1",
  "addx 5",
  "addx -1",
  "addx -35",
  "addx 1",
  "addx 24",
  "addx -19",
  "addx 1",
  "addx 16",
  "addx -11",
  "noop",
  "noop",
  "addx 21",
  "addx -15",
  "noop",
  "noop",
  "addx -3",
  "addx 9",
  "addx 1",
  "addx -3",
  "addx 8",
  "addx 1",
  "addx 5",
  "noop",
  "noop",
  "noop",
  "noop",
  "noop",
  "addx -36",
  "noop",
  "addx 1",
  "addx 7",
  "noop",
  "noop",
  "noop",
  "addx 2",
  "addx 6",
  "noop",
  "noop",
  "noop",
  "noop",
  "noop",
  "addx 1",
  "noop",
  "noop",
  "addx 7",
  "addx 1",
  "noop",
  "addx -13",
  "addx 13",
  "addx 7",
  "noop",
  "addx 1",
  "addx -33",
  "noop",
  "noop",
  "noop",
  "addx 2",
  "noop",
  "noop",
  "noop",
  "addx 8",
  "noop",
  "addx -1",
  "addx 2",
  "addx 1",
  "noop",
  "addx 17",
  "addx -9",
  "addx 1",
  "addx 1",
  "addx -3",
  "addx 11",
  "noop",
  "noop",
  "addx 1",
  "noop",
  "addx 1",
  "noop",
  "noop",
  "addx -13",
  "addx -19",
  "addx 1",
  "addx 3",
  "addx 26",
  "addx -30",
  "addx 12",
  "addx -1",
  "addx 3",
  "addx 1",
  "noop",
  "noop",
  "noop",
  "addx -9",
  "addx 18",
  "addx 1",
  "addx 2",
  "noop",
  "noop",
  "addx 9",
  "noop",
  "noop",
  "noop",
  "addx -1",
  "addx 2",
  "addx -37",
  "addx 1",
  "addx 3",
  "noop",
  "addx 15",
  "addx -21",
  "addx 22",
  "addx -6",
  "addx 1",
  "noop",
  "addx 2",
  "addx 1",
  "noop",
  "addx -10",
  "noop",
  "noop",
  "addx 20",
  "addx 1",
  "addx 2",
  "addx 2",
  "addx -6",
  "addx -11",
  "noop",
  "noop",
  "noop",
];

function partOne(input): number {
  let cycle = 1;
  let register = 1;
  let total = 0;
  for (const instruction of input) {
    const [op, num] = instruction.split(" ");
    switch (op) {
      case "addx":
        cycle += 1;
        if ((cycle - 20) % 40 === 0) {
          total += cycle * register;
        }
        cycle += 1;
        register += parseInt(num);
        if ((cycle - 20) % 40 === 0) {
          total += cycle * register;
        }
        break;
      case "noop":
        cycle += 1;
        if ((cycle - 20) % 40 === 0) {
          total += cycle * register;
          console.log(cycle, register);
        }
        break;
    }
  }

  return total;
}

// console.log(partOne(sampleInput));
// getInput(10).then(partOne).then(console.log);

function partTwo(input) {
  let cycle = 0;
  let register = 1;
  const screen: string[] = [];
  for (let i = 0; i < 6 * 40; i++) {
    screen.push(".");
  }

  for (const instruction of input) {
    const [op, num] = instruction.split(" ");
    console.log(cycle, register);
    switch (op) {
      case "addx":
        cycle += 1;
        if (Math.abs((cycle % 40) - register) <= 1) {
          screen[cycle] = "#";
        }
        cycle += 1;
        register += parseInt(num);
        if (Math.abs((cycle % 40) - register) <= 1) {
          screen[cycle] = "#";
        }
        break;
      case "noop":
        cycle += 1;
        if (Math.abs((cycle % 40) - register) <= 1) {
          screen[cycle] = "#";
        }
        break;
    }
  }

  let line = "";
  for (let i = 0; i < screen.length; i++) {
    line += screen[i];
    if (i % 40 === 39) {
      console.log(line);
      line = "";
    }
  }
}

// partTwo(sampleInput);

getInput(10).then(partTwo);
