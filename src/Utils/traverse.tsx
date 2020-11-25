import { TreeNode } from "../Types/TreeTypes";
import { hierarchy } from "@visx/hierarchy";
import produce from "immer";

export function genID_Mutable(tree: TreeNode) {
  let id = 0;
  function traverse(node: TreeNode) {
    node["id"] = id++;
    node.children?.map((subtree) => traverse(subtree));
  }
  traverse(tree);
}

export function genID(tree: TreeNode) {
  return produce(tree, (draft) => genID_Mutable(draft));
}

function removeID_Mutable(tree: TreeNode) {
  delete tree.id;
  function traverse(node: TreeNode) {
    delete node.id;
    node.children?.map((subtree) => traverse(subtree));
  }
  traverse(tree);
}

export function removeID(tree: TreeNode) {
  return produce(tree, (draft) => removeID_Mutable(draft));
}

function renameNode_Mutable(
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

export function renameNode(
  tree: TreeNode,
  idToModify: number,
  newName: string
) {
  return produce(tree, (draft) =>
    renameNode_Mutable(draft, idToModify, newName)
  );
}

function addNewChild_Mutable(tree: TreeNode, idToModify: number) {
  function traverse(node: TreeNode) {
    if (node.id === idToModify) {
      //use Number.MAX_SAFE_INTEGER for temporary id, avoid id conflit
      node.children.push({
        name: "X",
        children: [],
        id: Number.MAX_SAFE_INTEGER
      });
      //re-generate id to ensure uniqueness
      genID_Mutable(tree);
      return;
    }
    for (let child of node.children) {
      traverse(child);
    }
  }
  traverse(tree);
}

export function addNewChild(tree: TreeNode, idToModify: number) {
  return produce(tree, (draft) => addNewChild_Mutable(draft, idToModify));
}

function removeSubtree_Mutable(tree: TreeNode, idToModify: number) {
  function traverse(node: TreeNode) {
    let filteredChildren = node.children.filter(
      (child) => idToModify !== child.id
    );
    if (filteredChildren.length < node.children.length) {
      node.children = filteredChildren;
      return;
    }
    for (let child of node.children) {
      traverse(child);
    }
  }
  traverse(tree);
}

export function removeSubtree(tree: TreeNode, idToModify: number) {
  return produce(tree, (draft) => removeSubtree_Mutable(draft, idToModify));
}

export function getHeight(tree: TreeNode) {
  return hierarchy(tree).height;
}

function makeTriangleChild_Mutable(tree: TreeNode, idToModify: number) {
  function traverse(node: TreeNode) {
    if (node.id === idToModify) {
      node.triangleChild = true;
      return;
    }
    for (let child of node.children) {
      traverse(child);
    }
  }
  traverse(tree);
}

export function makeTriangleChild(tree: TreeNode, idToModify: number) {
  return produce(tree, (draft) => makeTriangleChild_Mutable(draft, idToModify));
}
