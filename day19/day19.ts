//Advent of code 2022
//Day 19: Not Enough Minerals

import { getInput } from "../util";

const part1 = (rawInput) => {
  const blueprints = parseInput(rawInput);

  let qualityLevel = 0;
  for (const blueprint of blueprints) {
    qualityLevel += blueprint.number * testBlueprint(blueprint, 24);
  }
  return qualityLevel;
};

const part2 = (rawInput) => {
  const blueprints = parseInput(rawInput);

  let result = 1;
  for (let i = 0; i < 3; i++) {
    result *= testBlueprint(blueprints[i], 32);
  }
  return result;
};

const testBlueprint = (blueprint, time) => {
  const maxRobots = {
    ore: Math.max(
      blueprint.oreCost,
      blueprint.clayCost,
      blueprint.obsidianCost[0],
      blueprint.geodeCost[0]
    ),
    clay: blueprint.obsidianCost[1],
  };

  let maxGeode = 0;
  const search = (
    time,
    oreRobots,
    clayRobots,
    obsidianRobots,
    ore,
    clay,
    obsidian,
    geodes
  ) => {
    if (time < 1) return;

    if (geodes + (time * (time + 1)) / 2 < maxGeode) {
      return;
    }
    if (geodes > maxGeode) {
      maxGeode = geodes;
    }

    //Build geode robot
    if (obsidianRobots > 0) {
      const canBuildGeodeNow =
        blueprint.geodeCost[0] <= ore && blueprint.geodeCost[1] <= obsidian;
      const timeSkip =
        1 +
        (canBuildGeodeNow
          ? 0
          : Math.max(
              Math.ceil((blueprint.geodeCost[0] - ore) / oreRobots),
              Math.ceil((blueprint.geodeCost[1] - obsidian) / obsidianRobots)
            ));

      search(
        time - timeSkip,
        oreRobots,
        clayRobots,
        obsidianRobots,
        ore + timeSkip * oreRobots - blueprint.geodeCost[0],
        clay + timeSkip * clayRobots,
        obsidian + timeSkip * obsidianRobots - blueprint.geodeCost[1],
        geodes + time - timeSkip
      );

      if (canBuildGeodeNow) return;
    }

    //Build obsidian robot
    if (clayRobots > 0) {
      const canBuildObsidianNow =
        blueprint.obsidianCost[0] <= ore && blueprint.obsidianCost[1] <= clay;
      const timeSkip =
        1 +
        (canBuildObsidianNow
          ? 0
          : Math.max(
              Math.ceil((blueprint.obsidianCost[0] - ore) / oreRobots),
              Math.ceil((blueprint.obsidianCost[1] - clay) / clayRobots)
            ));

      if (time - timeSkip > 2) {
        search(
          time - timeSkip,
          oreRobots,
          clayRobots,
          obsidianRobots + 1,
          ore + timeSkip * oreRobots - blueprint.obsidianCost[0],
          clay + timeSkip * clayRobots - blueprint.obsidianCost[1],
          obsidian + timeSkip * obsidianRobots,
          geodes
        );
      }
    }

    //Build clay robot
    if (clayRobots < maxRobots.clay) {
      const canBuildClayNow = blueprint.clayCost <= ore;
      const timeSkip =
        1 +
        (canBuildClayNow
          ? 0
          : Math.ceil((blueprint.clayCost - ore) / oreRobots)); //Todo maybe add one here

      if (time - timeSkip > 3) {
        search(
          time - timeSkip,
          oreRobots,
          clayRobots + 1,
          obsidianRobots,
          ore + timeSkip * oreRobots - blueprint.clayCost,
          clay + timeSkip * clayRobots,
          obsidian + timeSkip * obsidianRobots,
          geodes
        );
      }
    }

    //Build ore robot
    if (oreRobots < maxRobots.ore) {
      const canBuildOreNow = blueprint.oreCost <= ore;
      const timeSkip =
        1 +
        (canBuildOreNow ? 0 : Math.ceil((blueprint.oreCost - ore) / oreRobots)); //Todo maybe add one here

      if (time - timeSkip > 4) {
        search(
          time - timeSkip,
          oreRobots + 1,
          clayRobots,
          obsidianRobots,
          ore + timeSkip * oreRobots - blueprint.oreCost,
          clay + timeSkip * clayRobots,
          obsidian + timeSkip * obsidianRobots,
          geodes
        );
      }
    }
  };

  search(time, 1, 0, 0, 0, 0, 0, 0);
  console.log("Blueprint max: " + maxGeode);
  return maxGeode;
};

function parseInput(input: string[]) {
  return input.map((blueprint) => {
    const bp = blueprint.match(/\d+/g);
    return new Blueprint(bp[0], bp[1], bp[2], [bp[3], bp[4]], [bp[5], bp[6]]);
  });
}

class Blueprint {
  constructor(
    public number,
    public oreCost,
    public clayCost,
    public obsidianCost,
    public geodeCost
  ) {}
}

// getInput(19).then(part1).then(console.log);
getInput(19).then(part2).then(console.log);
