import { TreeNode } from "../Types/TreeTypes";

export function Node(name: string, ...children: TreeNode[]) {
  return { name, children } as TreeNode;
}
