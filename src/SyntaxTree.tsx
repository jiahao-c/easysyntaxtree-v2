/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useMemo, MouseEvent } from "react";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { LinkVerticalLine } from "@visx/shape";
import { TreeNode } from "./Types/TreeTypes";
import { HierarchyPointNode } from "d3-hierarchy";
import { ActionType, actions } from "./Types/TreeTypes";

const margin = { top: 50, left: 30, right: 30, bottom: 70 };

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
  console.log(data.height);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  return width < 100 ? null : (
    <svg
      id={"treeSVG"}
      width={width}
      height={height}
      onClick={() => dispatch({ type: actions.BG_CLICK })}
    >
      <Tree<TreeNode> root={data} size={[xMax, yMax]}>
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {/* render the edges */}
            {tree.links().map((link, i) => (
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
            ))}
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
                    onClick={(e: MouseEvent) => {
                      if (e.shiftKey) {
                        dispatch({ type: actions.REMOVE_SUBTREE, node: node });
                      }
                    }}
                    onDoubleClick={(e) => {
                      dispatch({ type: actions.START_EDIT, node: node });
                      //e.stopPropagation();
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      dispatch({ type: actions.NEW_CHILD, node: node });
                      //e.stopPropagation();
                    }}
                    // onMouseOver={() => {
                    //   // console.log(
                    //   //   `hovering: ${JSON.stringify(node.data.name)}`
                    //   // );
                    // }}
                  >
                    {node.data.name}
                  </text>
                </Group>
              );
            })}
          </Group>
        )}
      </Tree>
    </svg>
  );
}
