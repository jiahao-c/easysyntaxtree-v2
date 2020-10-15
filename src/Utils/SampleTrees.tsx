import { Node } from "./Node";
import { TreeNode } from "../Types/TreeTypes";
import { genID } from "./traverse";
import produce from "immer";
export const sampleTree: TreeNode = Node(
  "TP",
  Node("NP", Node("Det", Node("a")), Node("N'", Node("N", Node("linguist")))),
  Node(
    "T'",
    Node("T", Node("+pst")),
    Node(
      "VP",
      Node(
        "V'",
        Node("V", Node("ate")),
        Node(
          "NP",
          Node("Det", Node("an")),
          Node("N'", Node("N", Node("apple")))
        )
      )
    )
  )
);

export const sampleTree2: TreeNode = Node(
  "TP",
  Node("DP", Node("D'", Node("D"), Node("NP", Node("N", Node("We"))))),
  Node("T'")
);

export const sampleTreeWithID = produce(sampleTree, (draft) => {
  genID(draft);
});

export const sampleTree2WithID = produce(sampleTree2, (draft) => {
  genID(draft);
});

export const blankTree: TreeNode = Node("TP");

export const blankTreeWithID = produce(blankTree, (draft) => {
  genID(draft);
});
