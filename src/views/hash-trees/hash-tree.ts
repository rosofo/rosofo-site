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
