import { readFile } from "node:fs/promises";

export function intersection<T>(first: T[], second: T[]): T[] {
  return [...new Set(first.filter((c) => second.includes(c)))];
}

export async function getInput(day): Promise<string[]> {
  const contents = await readFile(`day${day}/day${day}-input.txt`, "utf8");
  return contents.split("\n");
}
