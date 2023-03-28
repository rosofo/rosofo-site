import * as murmurhash from "murmurhash";

export type HashTree<M = undefined> =
  | {
      hash: string;
      metadata: M;
      data?: string;
      children: HashTree<M>[];
    }
  | {
      hash: string;
      metadata: M;
      data: string;
      children?: HashTree<M>[];
    };

export const buildHashTree = (
  text: string,
  chunkSize: number = 4
): HashTree => {
  const chars = text.split("");
  const chunks = [];
  while (chars.length > 0) {
    chunks.push(chars.splice(0, chunkSize).join(""));
  }

  let trees: HashTree[] = chunks.map((chunk) => ({
    hash: murmurhash.v3(chunk).toString(),
    data: chunk,
    metadata: undefined,
  }));

  while (trees.length > 1) {
    const newTrees = [];
    while (trees.length > 0) {
      newTrees.push(combine(trees.splice(0, 2)));
    }
    trees = newTrees;
  }

  return trees[0];
};

const combine = (trees: HashTree[]): HashTree => {
  const hash = murmurhash
    .v3(trees.map((tree) => tree.hash).join(""))
    .toString();
  return {
    hash,
    children: trees,
    metadata: undefined,
  };
};
