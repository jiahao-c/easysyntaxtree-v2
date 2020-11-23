import React,{ useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { LinkVerticalLine, Polygon } from "@visx/shape";
import { TreeNode } from "./Types/TreeTypes";
import { actions } from "./Types/TreeTypes";
import { calcHalfTextWidth } from "./Utils/dimension";

const margin = { top: 20, left: 30, right: 30, bottom: 70 };

interface TreeProps {
  width: number;
  height: number;
  tree: TreeNode;
  dispatch: any;
  angle: number;
  lineOffset: number;
}

export default function SyntaxTree({
  width,
  height,
  tree,
  dispatch,
  angle,
  lineOffset
}: TreeProps) {
  const data = useMemo(() => hierarchy(tree), [tree]);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  return width < 100 ? null : (
    <svg
      id={"treeSVG"}
      width={width}
      height={height}
      onClick={() => dispatch({ type: actions.BG_CLICK })}
      style={{ backgroundColor: "white" }}
    >
      <Tree<TreeNode> root={data} size={[xMax, yMax]}>
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {/* render the nodes */}
            {tree.descendants().map((node, key) => {
              let top: number;
              let left: number;
              top = node.y;
              left = node.x;

              return (
                <Group top={top} left={left} key={key}>
                  <text
                    //control the y-axis of node text
                    id={node.data.id!.toString()}
                    style={{ userSelect: "none" }}
                    dy="0em"
                    fontSize={15}
                    fontFamily="Arial"
                    textAnchor="middle"
                    fill={
                      node.depth === 0
                        ? "black"
                        : node.children
                        ? "black"
                        : "black"
                    }
                    onClick={(e) => {
                      if (e.shiftKey) {
                        dispatch({ type: actions.MAKE_TRIANGLE, node: node });
                      }
                    }}
                    onDoubleClick={(e) => {
                      dispatch({ type: actions.START_EDIT, node: node });
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (e.ctrlKey) {
                        dispatch({ type: actions.REMOVE_SUBTREE, node: node });
                        //show an alert "DELETE MODE: hold shift and click on a node to remove the subtree"
                      } else {
                        dispatch({ type: actions.NEW_CHILD, node: node });
                      }
                    }}
                  >
                    {node.data.name}
                  </text>
                </Group>
              );
            })}
            {/* render the edges */}
            {tree.links().map((link, i) => {
              //if the edge is a triangle
              if (link.source.data.triangleChild) {
                let halfTextWidth = calcHalfTextWidth(link.target.data.name);
                return (
                  <Polygon
                    key={i}
                    sides={3}
                    size={20}
                    points={`
                  ${link.source.x},
                  ${link.source.y + 8} 
                  ${link.target.x - halfTextWidth - 5},${link.target.y - 15} 
                  ${link.target.x + halfTextWidth + 5},${link.target.y - 15}`}
                    fill={"white"}
                    stroke={"black"}
                    strokeWidth={1}
                  />
                );
              } else {
                //if the edge is a line
                return (
                  <LinkVerticalLine
                    key={i}
                    data={link}
                    stroke="black"
                    strokeWidth="1"
                    fill="none"
                    // control the y-axis of edge line
                    y={(node: any) => node.y + lineOffset}
                    // control the open angle of edge
                    // by controlling the y-axis of end point of edge
                    target={({ target }) => ({
                      ...target,
                      y: target.y - angle
                    })}
                  />
                );
              }
            })}
          </Group>
        )}
      </Tree>
    </svg>
  );
}
