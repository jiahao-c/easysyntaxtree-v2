import { HierarchyPointNode } from "d3-hierarchy";

// Base tree node structure
export interface TreeNode {
  name: string;
  children: TreeNode[];
  id?: number; // Made optional to allow deletion
  triangleChild?: boolean;
}

export interface StateType {
  tree: TreeNode;
  editingNodeId: number | null;
  past: TreeNode[];
  future: TreeNode[];
}

// Define action types as string literal types for better type safety
export const actions = {
  START_EDIT: 'START_EDIT',
  NEW_CHILD: 'NEW_CHILD',
  REMOVE_SUBTREE: 'REMOVE_SUBTREE',
  BG_CLICK: 'BG_CLICK',
  FINISH_EDIT: 'FINISH_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT',
  RESET_BLANK: 'RESET_BLANK',
  RESET_BASIC: 'RESET_BASIC',
  RESET_DP: 'RESET_DP',
  UNDO: 'UNDO',
  REDO: 'REDO',
  MAKE_TRIANGLE: 'MAKE_TRIANGLE',
  DO_IMPORT: 'DO_IMPORT',
  MOVE_SUBTREE: 'MOVE_SUBTREE'
} as const; // Make object immutable

// Define action types using typeof for better type inference
export type ActionType =
  | { type: typeof actions.START_EDIT; nodeId: number }
  | { type: typeof actions.FINISH_EDIT; nodeId: number; newText: string }
  | { type: typeof actions.CANCEL_EDIT }
  | { type: typeof actions.BG_CLICK }
  | { type: typeof actions.RESET_BLANK }
  | { type: typeof actions.RESET_BASIC }
  | { type: typeof actions.RESET_DP }
  | { type: typeof actions.UNDO }
  | { type: typeof actions.REDO }
  | { type: typeof actions.NEW_CHILD; node: HierarchyPointNode<TreeNode> }
  | { type: typeof actions.REMOVE_SUBTREE; node: HierarchyPointNode<TreeNode> }
  | { type: typeof actions.MAKE_TRIANGLE; node: HierarchyPointNode<TreeNode> }
  | { type: typeof actions.DO_IMPORT; newTree: TreeNode }
  | { type: typeof actions.MOVE_SUBTREE; sourceId: number; targetId: number };
