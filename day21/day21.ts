import { getInput } from "../util";

const sampleInput = [
  "root: pppw + sjmn",
  "dbpl: 5",
  "cczh: sllz + lgvd",
  "zczc: 2",
  "ptdq: humn - dvpt",
  "dvpt: 3",
  "lfqf: 4",
  "humn: 5",
  "ljgn: 2",
  "sjmn: drzm * dbpl",
  "sllz: 4",
  "pppw: cczh / lfqf",
  "lgvd: ljgn * ptdq",
  "drzm: hmdt - zczc",
  "hmdt: 32",
];

type Expression = {
  left: string;
  operator: string;
  right: string;
};

type Shout = {
  value: number | Expression;
};

type NodeMap = {
  [key: string]: Shout;
};

function buildMap(input: string[]): NodeMap {
  const map: NodeMap = {};

  for (const line of input) {
    const [name, value] = line.split(": ");
    if (!isNaN(Number(value))) {
      map[name] = { value: Number(value) };
    } else {
      const [left, operator, right] = value.split(" ");
      const expression: Expression = { left, operator, right };
      map[name] = { value: expression };
    }
  }

  return map;
}

function partOne(input: string[]) {
  const map = buildMap(input);

  const keys = Object.keys(map);
  while (keys.map((k) => map[k].value).some((v) => typeof v === "object")) {
    for (const key of keys) {
      const shout = map[key];
      if (typeof shout.value === "object") {
        const { left, operator, right } = shout.value;
        const leftValue = map[left].value;
        const rightValue = map[right].value;
        if (typeof leftValue === "number" && typeof rightValue === "number") {
          const value = eval(`${leftValue}
          ${operator}
          ${rightValue}`);
          shout.value = value;
        }
      }
    }
  }

  console.log(map["root"]);
}

function partTwo(input: string[]) {
  let map = buildMap(input);
  let root: Expression = map["root"].value as Expression;
  const left = root.left;
  const right = root.right;
  delete map["root"];
  let bottom = 0;
  let top = 75147370123646;
  let guess = Math.floor(top / 2);
  map["humn"].value = guess;
  evaluateMap(map);

  console.log(guess, map[left].value, map[right].value);
  while (map[left].value !== map[right].value) {
    if (map[left].value < map[right].value) {
      top = guess - 1;
      guess = Math.floor((top + bottom) / 2);
    } else {
      bottom = guess + 1;
      guess = Math.floor((top + bottom) / 2);
    }
    map = buildMap(input);
    delete map["root"];
    map["humn"].value = guess;
    evaluateMap(map);
    console.log(guess, map[left].value, map[right].value);
  }

  console.log(guess);
}

function evaluateMap(map: NodeMap) {
  const keys = Object.keys(map);
  while (
    keys
      .filter((k) => k !== "root" && k !== "humn")
      .map((k) => map[k].value)
      .some((v) => typeof v === "object")
  ) {
    for (const key of keys) {
      const shout = map[key];
      if (typeof shout.value === "object") {
        const { left, operator, right } = shout.value;
        const leftValue = map[left].value;
        const rightValue = map[right].value;
        if (typeof leftValue === "number" && typeof rightValue === "number") {
          const value = eval(`${leftValue}
          ${operator}
          ${rightValue}`);
          shout.value = value;
        }
      }
    }
  }
}

// partOne(sampleInput);
// getInput(21).then(partOne);
// partTwo(sampleInput);
getInput(21).then(partTwo);
