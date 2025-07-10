import { HierarchyPointNode } from "d3-hierarchy";
export interface TreeNode {
  name: string;
  children: TreeNode[];
  id?: number;
  triangleChild?: boolean;
}

export interface StateType {
  tree: TreeNode;
  editingNodeId: number | null;
  past: TreeNode[];
  future: TreeNode[];
}

export enum actions {
  START_EDIT,
  NEW_CHILD,
  REMOVE_SUBTREE,
  BG_CLICK,
  FINISH_EDIT,
  CANCEL_EDIT,
  RESET_BLANK,
  RESET_BASIC,
  RESET_DP,
  UNDO,
  REDO,
  MAKE_TRIANGLE,
  DO_IMPORT
}

export type ActionType =
  | { type: actions.START_EDIT; nodeId: number }
  | { type: actions.FINISH_EDIT; nodeId: number; newText: string }
  | { type: actions.CANCEL_EDIT }
  | { type: actions.BG_CLICK }
  | { type: actions.RESET_BLANK }
  | { type: actions.RESET_BASIC }
  | { type: actions.RESET_DP }
  | { type: actions.UNDO }
  | { type: actions.REDO }
  | { type: actions.NEW_CHILD; node: HierarchyPointNode<TreeNode> }
  | { type: actions.REMOVE_SUBTREE; node: HierarchyPointNode<TreeNode> }
  | { type: actions.MAKE_TRIANGLE; node: HierarchyPointNode<TreeNode> }
  | { type: actions.DO_IMPORT; newTree: TreeNode }
