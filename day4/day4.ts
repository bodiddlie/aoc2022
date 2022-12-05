import { getInput } from "../util";

async function partOne(): Promise<number> {
  const lines = await getInput(4);

  let totalOverlap = 0;
  for (const line of lines) {
    const assignments = line.split(",");
    const min1 = parseInt(assignments[0].split("-")[0]);
    const max1 = parseInt(assignments[0].split("-")[1]);
    const min2 = parseInt(assignments[1].split("-")[0]);
    const max2 = parseInt(assignments[1].split("-")[1]);

    const firstContainsSecond = min1 <= min2 && max1 >= max2;
    const secondContainsFirst = min2 <= min1 && max2 >= max1;

    if (firstContainsSecond || secondContainsFirst) {
      totalOverlap++;
    }
  }

  return totalOverlap;
}

async function partTwo(): Promise<number> {
  const lines = await getInput(4);

  let totalOverlap = 0;
  for (const line of lines) {
    const assignments = line.split(",");
    const min1 = parseInt(assignments[0].split("-")[0]);
    const max1 = parseInt(assignments[0].split("-")[1]);
    const min2 = parseInt(assignments[1].split("-")[0]);
    const max2 = parseInt(assignments[1].split("-")[1]);

    if ((min1 >= min2 && min1 <= max2) || (max1 >= min2 && max1 <= max2)) {
      totalOverlap++;
    } else if (
      (min2 >= min1 && min2 <= max1) ||
      (max2 >= min1 && max2 <= max1)
    ) {
      totalOverlap++;
    }
  }

  return totalOverlap;
}

// partOne().then(console.log);
partTwo().then(console.log);
