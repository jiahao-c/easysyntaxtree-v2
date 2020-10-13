import { TreeNode } from "../Types/TreeTypes";

export function genID(tree: TreeNode) {
  let id = 0;
  function traverse(node: TreeNode) {
    node["id"] = id++;
    node.children?.map((subtree) => traverse(subtree));
  }
  traverse(tree);
}

export function renameNode(
  tree: TreeNode,
  idToModify: number,
  newName: string
) {
  function traverse(node: TreeNode) {
    if (node.id === idToModify) {
      node.name = newName;
      return;
    }
    for (let child of node.children) {
      traverse(child);
    }
  }
  traverse(tree);
}
