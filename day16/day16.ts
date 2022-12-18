import { getInput } from "../util";

const sampleInput = [
  "Valve AA has flow rate=0; tunnels lead to valves DD, II, BB",
  "Valve BB has flow rate=13; tunnels lead to valves CC, AA",
  "Valve CC has flow rate=2; tunnels lead to valves DD, BB",
  "Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE",
  "Valve EE has flow rate=3; tunnels lead to valves FF, DD",
  "Valve FF has flow rate=0; tunnels lead to valves EE, GG",
  "Valve GG has flow rate=0; tunnels lead to valves FF, HH",
  "Valve HH has flow rate=22; tunnel leads to valve GG",
  "Valve II has flow rate=0; tunnels lead to valves AA, JJ",
  "Valve JJ has flow rate=21; tunnel leads to valve II",
];

type Valve = {
  name: string;
  flowRate: number;
  tunnels: string[];
};

function parseLine(line: string): Valve {
  const [first, second] = line.split(";");
  const firstTokens = first.split(" ");
  const name = firstTokens[1];
  const flowRate = parseInt(firstTokens[4].split("=")[1]);
  const tunnels = second
    .replace("tunnel leads to valve", "")
    .replace("tunnels lead to valves", "")
    .split(", ")
    .map((t) => t.trim());
  return { name, flowRate, tunnels };
}

function partOne(input: string[]) {
  const valves = {};
  for (const line of input) {
    const valve = parseLine(line);
    valves[valve.name] = valve;
  }

  const distances = {};

  for (const start of Object.keys(valves)) {
    for (const end of Object.keys(valves)) {
      if (!distances[start]) {
        distances[start] = {};
      }
      distances[start][end] = breadthFirst(valves, start, end).length - 1;
    }
  }

  const nonZero = Object.keys(valves).filter((v) => valves[v].flowRate > 0);
  console.log(distances);
  const top = getRates(distances, "AA", 30, nonZero)
    .map((path) =>
      Object.entries(path).reduce(
        (acc, [key, value]) => acc + valves[key].flowRate * value,
        0
      )
    )
    .sort((a, b) => b - a)[0];
  console.log(top);
}

function breadthFirst(grid, start, end) {
  const queue = [];
  const visited = [start];

  if (start === end) {
    return [start];
  }
  queue.push([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    for (const neighbor of grid[node].tunnels) {
      if (visited.includes(neighbor)) continue;

      if (neighbor === end) {
        return path.concat([neighbor]);
      }
      visited.push(neighbor);
      queue.push(path.concat([neighbor]));
    }
  }

  return [];
}

type Rate = {
  [key: string]: number;
};

function getRates(distances, valve, minutes, remaining, opened = {}): Rate[] {
  const rates = [opened];

  for (const [idx, other] of remaining.entries()) {
    const newMinutes = minutes - distances[valve][other] - 1;
    if (newMinutes < 1) continue;

    const newOpened = JSON.parse(JSON.stringify(opened));
    newOpened[other] = newMinutes;

    const newLeft = [...remaining];
    newLeft.splice(idx, 1);

    rates.push(...getRates(distances, other, newMinutes, newLeft, newOpened));
  }

  return rates;
}

function partTwo(input: string[]) {
  const valves = {};
  for (const line of input) {
    const valve = parseLine(line);
    valves[valve.name] = valve;
  }

  const distances = {};

  for (const start of Object.keys(valves)) {
    for (const end of Object.keys(valves)) {
      if (!distances[start]) {
        distances[start] = {};
      }
      distances[start][end] = breadthFirst(valves, start, end).length - 1;
    }
  }

  const nonZero = Object.keys(valves).filter((v) => valves[v].flowRate > 0);
  const rates = getRates(distances, "AA", 26, nonZero);

  const maxScores = {};
  for (const rate of rates) {
    const key = Object.keys(rate).sort().join(",");
    const score = Object.entries(rate).reduce((acc, [key, value]) => {
      return acc + valves[key].flowRate * value;
    }, 0);

    if (maxScores[key] == null) maxScores[key] = -Infinity;
    maxScores[key] = Math.max(score, maxScores[key]);
  }

  let highest = -Infinity;
  Object.keys(maxScores).forEach((player) => {
    Object.keys(maxScores).forEach((elephant) => {
      const allValves = new Set();
      const playerList = player.split(",");
      playerList.forEach((valve) => allValves.add(valve));
      const elephantList = elephant.split(",");
      elephantList.forEach((valve) => allValves.add(valve));

      if (allValves.size == playerList.length + elephantList.length)
        highest = Math.max(maxScores[player] + maxScores[elephant], highest);
    });
  });

  console.log(highest);
}

// partOne(sampleInput);
// getInput(16).then(partOne);
// partTwo(sampleInput);
getInput(16).then(partTwo);
