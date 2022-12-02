import {readFile} from 'node:fs/promises';

enum Choice {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C',
}

enum Response  {
  Loss = 'X',
  Draw = 'Y',
  Win = 'Z',
}

const scoreMap = {
  [Choice.Rock]: {
    [Response.Win]: 8,
    [Response.Draw]: 4,
    [Response.Loss]: 3,
  },
  [Choice.Paper]: {
    [Response.Win]: 9,
    [Response.Draw]: 5,
    [Response.Loss]: 1,
  },
  [Choice.Scissors]: {
    [Response.Win]: 7,
    [Response.Draw]: 6,
    [Response.Loss]: 2,
  }
}

try {
  const contents = await readFile('day2/day2-input.txt', 'utf8');
  const turns = contents.split('\n');

  let score = 0;

  for (const turn of turns) {

    score += getScoreForTurn(turn);
  }

  console.log(score);

} catch (error) {
  console.error(error);
}

function getScoreForTurn(turn) {
  const choices = turn.split(' ');

  return scoreMap[choices[0]][choices[1]];
}