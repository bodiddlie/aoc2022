import { getInput } from "../util";

const sampleInput = [
  "Sensor at x=2, y=18: closest beacon is at x=-2, y=15",
  "Sensor at x=9, y=16: closest beacon is at x=10, y=16",
  "Sensor at x=13, y=2: closest beacon is at x=15, y=3",
  "Sensor at x=12, y=14: closest beacon is at x=10, y=16",
  "Sensor at x=10, y=20: closest beacon is at x=10, y=16",
  "Sensor at x=14, y=17: closest beacon is at x=10, y=16",
  "Sensor at x=8, y=7: closest beacon is at x=2, y=10",
  "Sensor at x=2, y=0: closest beacon is at x=2, y=10",
  "Sensor at x=0, y=11: closest beacon is at x=2, y=10",
  "Sensor at x=20, y=14: closest beacon is at x=25, y=17",
  "Sensor at x=17, y=20: closest beacon is at x=21, y=22",
  "Sensor at x=16, y=7: closest beacon is at x=15, y=3",
  "Sensor at x=14, y=3: closest beacon is at x=15, y=3",
  "Sensor at x=20, y=1: closest beacon is at x=15, y=3",
];

type Point = {
  x: number;
  y: number;
};

type Pair = {
  sensor: Point;
  beacon: Point;
  distance: number;
};

function distanceBetween(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function parseLine(line: string): Pair {
  const [sensorSection, beaconSection] = line.split(":");
  const sensor = sensorSection.replace("Sensor at ", "");
  const beacon = beaconSection.replace("closest beacon is at ", "");
  const sensorPoint = parsePoint(sensor);
  const beaconPoint = parsePoint(beacon);
  const d = distanceBetween(sensorPoint, beaconPoint);
  return { sensor: sensorPoint, beacon: beaconPoint, distance: d };
}

function partOne(input: string[], y: number) {
  const beaconsOnY = new Set();
  const cannotContainBeacon = new Set();

  for (const line of input) {
    const { sensor, beacon, distance } = parseLine(line);
    if (beacon.y === y) {
      beaconsOnY.add(beacon.x);
    }

    const minDistance = distanceBetween(sensor, { x: sensor.x, y });
    if (minDistance < distance) {
      const distanceAroundSensorRow = distance - minDistance;
      for (
        let x = sensor.x - distanceAroundSensorRow;
        x <= sensor.x + distanceAroundSensorRow;
        x++
      ) {
        cannotContainBeacon.add(x);
      }
    }
  }

  console.log(cannotContainBeacon.size - beaconsOnY.size);
}

function parsePoint(input: string): Point {
  const [x, y] = input
    .replace("x=", "")
    .replace("y=", "")
    .replace(")", "")
    .split(", ")
    .map(Number);
  return { x, y };
}

function partTwo(input: string[], maxCoordinate: number) {
  const pairs: Pair[] = input.map(parseLine);

  for (let y = 0; y < maxCoordinate; y++) {
    const intervals = [];
    for (const { sensor, distance } of pairs) {
      const minDistance = distanceBetween(sensor, { x: sensor.x, y });
      if (minDistance <= distance) {
        const distanceAroundSensorRow = distance - minDistance;
        const from = sensor.x - distanceAroundSensorRow;
        const to = sensor.x + distanceAroundSensorRow;

        intervals.push([from, to]);
      }
    }

    intervals.sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i - 1][1] >= intervals[i][0]) {
        // merge them
        intervals[i - 1][1] = Math.max(intervals[i - 1][1], intervals[i][1]);
        intervals.splice(i, 1);
        i--;
      }
    }

    const res = [];
    for (const interval of intervals) {
      if (interval[0] > maxCoordinate || 0 > interval[1]) {
        continue;
      }
      res.push([
        Math.max(interval[0], 0),
        Math.min(interval[1], maxCoordinate),
      ]);
    }

    if (res.length > 1) {
      const x = res[0][1] + 1;
      console.log(x * 4e6 + y);
      return;
    }
  }
}

// partOne(sampleInput, 10);
// getInput(15).then((input) => partOne(input, 2000000));

// partTwo(sampleInput, 20);
getInput(15).then((input) => partTwo(input, 4000000));
