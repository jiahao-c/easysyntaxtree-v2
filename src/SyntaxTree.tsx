import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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

// EditingInput component moved outside to prevent recreation
const EditingInput = ({ 
  editingNodeId, 
  editText, 
  setEditText, 
  dispatch, 
  svgRef, 
  data, 
  inputRef 
}: {
  editingNodeId: number | null;
  editText: string;
  setEditText: (text: string) => void;
  dispatch: any;
  svgRef: React.RefObject<SVGSVGElement>;
  data: any;
  inputRef: React.RefObject<HTMLInputElement>;
}) => {
  const [position, setPosition] = useState<{x: number, y: number} | null>(null);

  // Calculate position when editing starts or layout changes
  useEffect(() => {
    if (editingNodeId === null || !svgRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!svgRef.current) return;
      
      const svgRect = svgRef.current.getBoundingClientRect();
      const editingNode = data.descendants().find((node: any) => node.data.id === editingNodeId);
      
      if (!editingNode) {
        return;
      }

      // The Tree component adds x and y properties to the hierarchy nodes
      const nodeWithPosition = editingNode as any;
      if (!('x' in nodeWithPosition) || !('y' in nodeWithPosition)) {
        // Retry after a longer delay if position is not available
        setTimeout(updatePosition, 50);
        return;
      }

      const absoluteX = svgRect.left + margin.left + nodeWithPosition.x;
      const absoluteY = svgRect.top + margin.top + nodeWithPosition.y;
      
      setPosition({ x: absoluteX, y: absoluteY });
    };

    // Use multiple strategies to ensure position is calculated correctly
    // First attempt immediately
    updatePosition();
    
    // Backup attempts with increasing delays
    const timeoutId1 = setTimeout(updatePosition, 10);
    const timeoutId2 = setTimeout(updatePosition, 50);
    const timeoutId3 = setTimeout(updatePosition, 100);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [editingNodeId, data, svgRef]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch({ type: actions.FINISH_EDIT, nodeId: editingNodeId, newText: editText });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      dispatch({ type: actions.CANCEL_EDIT });
    }
  }, [editingNodeId, editText, dispatch]);

  const handleInputBlur = useCallback(() => {
    if (editingNodeId !== null) {
      dispatch({ type: actions.FINISH_EDIT, nodeId: editingNodeId, newText: editText });
    }
  }, [editingNodeId, editText, dispatch]);

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (editingNodeId === null || !position) return null;

  return createPortal(
    <input
      ref={inputRef}
      type="text"
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleInputBlur}
      onClick={handleInputClick}
      style={{
        position: 'fixed',
        left: position.x - 60,
        top: position.y - 12,
        width: '120px',
        height: '20px',
        textAlign: 'center',
        border: '2px solid #007bff',
        borderRadius: '4px',
        fontSize: '15px',
        fontFamily: 'Arial',
        padding: '2px 4px',
        outline: 'none',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
        zIndex: 9999,
        boxSizing: 'border-box'
      }}
    />,
    document.body
  );
};

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
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (editingNodeId !== null && inputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 10);
    }
  }, [editingNodeId]);

  return width < 100 ? null : (
    <>
      <svg
        ref={svgRef}
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
                    {!isEditing && (
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
      <EditingInput
        editingNodeId={editingNodeId}
        editText={editText}
        setEditText={setEditText}
        dispatch={dispatch}
        svgRef={svgRef}
        data={data}
        inputRef={inputRef}
      />
    </>
  );
}
