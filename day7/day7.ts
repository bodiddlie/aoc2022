import { getInput } from "../util";

class Node {
  constructor(
    public parent: Node = null,
    public children: Node[] = [],
    public size: number = 0
  ) {}

  getSize() {
    return (
      this.size + this.children.reduce((acc, child) => acc + child.getSize(), 0)
    );
  }
}

function traverse(node: Node, minSize: number): number {
  let size = 0;
  if (node.getSize() < minSize) {
    size = node.getSize();
  }
  for (const child of node.children) {
    size += traverse(child, minSize);
  }
  return size;
}

function maxTraverse(node: Node, minSize: number): number {
  let size = 0;
  if (node.getSize() >= minSize) {
    size = node.getSize();

    for (const child of node.children) {
      const childSize = maxTraverse(child, minSize);
      if (childSize >= minSize && childSize < size) size = childSize;
    }
  }

  return size;
}

function buildDirTree(input: string[]): Node {
  let nodes: Node = null;
  let currentNode: Node = null;

  for (const line of input) {
    if (line.startsWith("$ cd")) {
      if (!nodes) {
        nodes = new Node();
        currentNode = nodes;
      } else {
        if (line.endsWith("..")) {
          currentNode = currentNode.parent;
        } else {
          const newNode = new Node();
          currentNode.children.push(newNode);
          newNode.parent = currentNode;
          currentNode = currentNode.children[currentNode.children.length - 1];
        }
      }
    } else if (line.startsWith("$ ls") || line.startsWith("dir")) {
      //noop
    } else {
      // file size
      const size = parseInt(line.split(" ")[0]);
      if (size) {
        currentNode.size += size;
      }
    }
  }

  return nodes;
}

async function partOne(): Promise<number> {
  const input = await getInput(7);

  const dirTree = buildDirTree(input);

  return traverse(dirTree, 100000);
}

async function partTwo(): Promise<number> {
  const input = await getInput(7);

  const dirTree = buildDirTree(input);

  const freeSpace = 70000000 - dirTree.getSize();
  const minToFree = 30000000 - freeSpace;
  return maxTraverse(dirTree, minToFree);
}

// partOne().then(console.log);
partTwo().then(console.log);
