import { getInput, intersection } from "../util";

async function partOne(): Promise<number> {
  try {
    const lines = await getInput(3);

    let dupSum = 0;

    for (const line of lines) {
      const first = line.substring(0, line.length / 2).split("");
      const second = line.substring(line.length / 2).split("");

      const item = intersection(first, second)[0];

      if (item.charCodeAt(0) >= 65 && item.charCodeAt(0) <= 90) {
        dupSum += item.charCodeAt(0) - 38;
      } else {
        dupSum += item.charCodeAt(0) - 96;
      }
    }
    return dupSum;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function partTwo(): Promise<number> {
  try {
    const lines = await getInput(3);

    let badgeSum = 0;
    const numberOfGroups = lines.length / 3;

    for (let i = 0; i < numberOfGroups; i++) {
      const first = lines[i * 3].split("");
      const second = lines[i * 3 + 1].split("");
      const third = lines[i * 3 + 2].split("");

      const common = [
        ...new Set(
          first.filter((c) => second.includes(c) && third.includes(c))
        ),
      ];

      const item = common[0];

      if (item.charCodeAt(0) >= 65 && item.charCodeAt(0) <= 90) {
        badgeSum += item.charCodeAt(0) - 38;
      } else {
        badgeSum += item.charCodeAt(0) - 96;
      }
    }
    return badgeSum;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

partOne().then(console.log);
partTwo().then(console.log);
