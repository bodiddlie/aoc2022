// read contents of day1-input.txt file
// loop over each line of the file
// parse each line into a number
// add the number to the total
// if a blank line is found, compare the total to the maximum
// if the total is greater than the maximum, set the maximum to the total


import {readFile} from 'node:fs/promises';

async function partOne(): Promise<number> {
  try {
    const contents = await readFile('day2/day1-input.txt', 'utf8');
    const lines = contents.split('\n');
    let total = 0;
    const totals = [];
    for (const line of lines) {
      if (line === '') {
        totals.push(total)
        total = 0;
      } else {
        total += parseInt(line);
      }
    }
    const sorted = totals.sort((a, b) => b - a);
    return sorted[0] + sorted[1] + sorted[2];
  } catch (error) {
    console.error(error);
    return 0;
  }
}

partOne().then(console.log)