import { getInput } from "../util";

const sampleInput = [
  "Monkey 0:",
  "Starting items: 79, 98",
  "Operation: new = old * 19",
  "Test: divisible by 23",
  "If true: throw to monkey 2",
  "If false: throw to monkey 3",
  "",
  "Monkey 1:",
  "Starting items: 54, 65, 75, 74",
  "Operation: new = old + 6",
  "Test: divisible by 19",
  "If true: throw to monkey 2",
  "If false: throw to monkey 0",
  "",
  "Monkey 2:",
  "Starting items: 79, 60, 97",
  "Operation: new = old * old",
  "Test: divisible by 13",
  "If true: throw to monkey 1",
  "If false: throw to monkey 3",
  "",
  "Monkey 3:",
  "Starting items: 74",
  "Operation: new = old + 3",
  "Test: divisible by 17",
  "If true: throw to monkey 0",
  "If false: throw to monkey 1",
];

type Monkey = {
  startingItems: number[];
  lcm: number;
  divisor: number;
  success: number;
  failure: number;
  inspections: number;
  operation: (x: number) => number;
};

function isDigit(x: string) {
  return !isNaN(parseInt(x));
}

function buildMonkeys(input: string[], isPartOne = true): Monkey[] {
  const monkeys: Monkey[] = [];
  const divideLines = input
    .filter((x) => x.includes("divisible by"))
    .map((x) => x.trim().split(" ")[3]);
  const lcm = divideLines
    .map((x) => parseInt(x))
    .reduce((prev, cur) => {
      return prev * cur;
    }, 1);

  let monkeyIndex = 0;
  for (const i of input) {
    const line = i.trim();
    if (line.startsWith("Monkey")) {
      monkeyIndex = parseInt(line.split(" ")[1]);
      monkeys[monkeyIndex] = {
        startingItems: [],
        divisor: 0,
        success: 0,
        failure: 0,
        inspections: 0,
        lcm: 0,
        operation: (x: number) => x,
      };
    } else if (line.startsWith("Starting items")) {
      monkeys[monkeyIndex].startingItems = line
        .split(": ")[1]
        .split(", ")
        .map((x) => parseInt(x));
    } else if (line.startsWith("Operation")) {
      const statement = line.split("=")[1].trim();
      const operands = statement.split(" ");
      monkeys[monkeyIndex].operation = (x: number) => {
        const y = isDigit(operands[2]) ? parseInt(operands[2]) : x;
        return operands[1] === "*"
          ? x * y
          : operands[1] === "+"
          ? x + y
          : x - y;
      };
    } else if (line.startsWith("Test")) {
      monkeys[monkeyIndex].divisor = parseInt(line.split(" ")[3]);
      monkeys[monkeyIndex].lcm = lcm;
    } else if (line.startsWith("If true")) {
      monkeys[monkeyIndex].success = parseInt(line.split(" ")[5]);
    } else if (line.startsWith("If false")) {
      monkeys[monkeyIndex].failure = parseInt(line.split(" ")[5]);
    }
  }

  return monkeys;
}

function takeRound(monkeys: Monkey[], reducer = 3) {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];
    while (monkey.startingItems.length > 0) {
      monkey.inspections++;
      const item = monkey.startingItems.shift();
      const increasedWorry = monkey.operation(item);
      let worryLevel = increasedWorry;
      if (reducer === 3) {
        worryLevel = Math.floor(worryLevel / 3);
      } else {
        worryLevel = worryLevel % monkey.lcm;
      }
      const newMonkey =
        worryLevel % monkey.divisor === 0 ? monkey.success : monkey.failure;
      console.log(
        `Monkey ${i} threw ${item} to monkey ${newMonkey} with new value of ${worryLevel} after reducing from ${increasedWorry}`
      );
      monkeys[newMonkey].startingItems.push(worryLevel);
    }
  }
}

function partOne(input: string[]): number {
  const monkeys = buildMonkeys(input);

  for (let i = 0; i < 20; i++) {
    takeRound(monkeys, 3);
  }

  monkeys.sort((a, b) => b.inspections - a.inspections);
  return monkeys[0].inspections * monkeys[1].inspections;
}

function partTwo(input: string[]): number {
  const monkeys = buildMonkeys(input);

  for (let i = 0; i < 10000; i++) {
    takeRound(monkeys, 1);
  }

  console.log(monkeys);
  monkeys.sort((a, b) => b.inspections - a.inspections);
  return monkeys[0].inspections * monkeys[1].inspections;
}

// console.log(partOne(sampleInput));
console.log(partTwo(sampleInput));

// getInput(11).then(partOne).then(console.log);
// getInput(11).then(partTwo).then(console.log);
