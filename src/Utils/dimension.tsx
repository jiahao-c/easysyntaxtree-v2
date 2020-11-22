import { HierarchyNode } from "d3-hierarchy";
import { TreeNode } from "./Types/TreeTypes";
export function calcWidth(treeHeight: number) {
  //values are manually tuned from experiment
  switch (treeHeight) {
    case 1:
      return 180;
    case 2:
      return 230;
    case 3:
      return 280;
    case 4:
      return 300;
    case 5:
      return 370;
    case 6:
      return 400;
    case 7:
      return 420;
    case 8:
      return 460;
    default:
      return 500;
  }
}

export function calcHeight(treeHeight: number): number {
  return 45 * treeHeight + 150;
}

export function calcHalfTextWidth(node: HierarchyNode<TreeNode>): number {
  return 20;
  // let textElement: SVGGraphicsElement = document.getElementById(
  //   id.toString()
  // ) as any;
  // return textElement.getBBox().width / 2;
}
