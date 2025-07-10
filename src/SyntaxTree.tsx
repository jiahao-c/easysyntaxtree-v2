import { useMemo, useState, useEffect, useRef } from "react";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { LinkVerticalLine, Polygon } from "@visx/shape";
import { TreeNode,actions } from "./Types/TreeTypes";
import { calcHalfTextWidth } from "./Utils/dimension";

const margin = { top: 20, left: 30, right: 30, bottom: 70 };

interface TreeProps {
  width: number;
  height: number;
  tree: TreeNode;
  dispatch: any;
  angle: number;
  lineOffset: number;
  editingNodeId: number | null;
}

export default function SyntaxTree({
  width,
  height,
  tree,
  dispatch,
  angle,
  lineOffset,
  editingNodeId
}: TreeProps) {
  const data = useMemo(() => hierarchy(tree), [tree]);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingNodeId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingNodeId]);

  const handleKeyDown = (e: React.KeyboardEvent, nodeId: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch({ type: actions.FINISH_EDIT, nodeId, newText: editText });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      dispatch({ type: actions.CANCEL_EDIT });
    }
  };

  const handleInputBlur = (nodeId: number) => {
    dispatch({ type: actions.FINISH_EDIT, nodeId, newText: editText });
  };

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
              const isEditing = editingNodeId === node.data.id;

              return (
                <Group top={top} left={left} key={key}>
                  {isEditing ? (
                    <foreignObject
                      x={-50}
                      y={-10}
                      width={100}
                      height={20}
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, node.data.id!)}
                        onBlur={() => handleInputBlur(node.data.id!)}
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          border: '1px solid #ccc',
                          borderRadius: '2px',
                          fontSize: '15px',
                          fontFamily: 'Arial',
                          padding: '2px',
                          outline: 'none'
                        }}
                      />
                    </foreignObject>
                  ) : (
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
                        if (e.altKey) {
                          dispatch({ type: actions.MAKE_TRIANGLE, node: node });
                        }
                      }}
                      onDoubleClick={(e) => {
                        setEditText(node.data.name);
                        dispatch({ type: actions.START_EDIT, nodeId: node.data.id! });
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (e.ctrlKey) {
                          dispatch({ type: actions.REMOVE_SUBTREE, node: node });
                        } else {
                          dispatch({ type: actions.NEW_CHILD, node: node });
                        }
                      }}
                    >
                      {node.data.name}
                    </text>
                  )}
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
                    points={
                  [[link.source.x,link.source.y + 8],
                  [link.target.x - halfTextWidth - 5,link.target.y - 15],
                  [link.target.x + halfTextWidth + 5,link.target.y - 15]]
                  }
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
