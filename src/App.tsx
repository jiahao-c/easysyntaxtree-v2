/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState, useEffect, useReducer } from "react";
import SyntaxTree from "./SyntaxTree";
import ToolBar from "./ToolBar";
import Sliders from "./Components/Sliders";
import { TreeNode } from "./Types/TreeTypes";
import {
  sampleTreeWithID,
  blankTreeWithID,
  sampleTree2WithID
} from "./Utils/SampleTrees";
import { HierarchyPointNode } from "d3-hierarchy";
import { renameNode } from "./Utils/traverse";
import { Form } from "antd";
import produce from "immer";
import "antd/dist/antd.css";

type ActionType =
  | { type: "start-edit"; node: HierarchyPointNode<TreeNode> }
  | { type: "background-click" }
  | { type: "finish-edit"; newText: string }
  | { type: "reset-sample" }
  | { type: "reset-blank" }
  | { type: "undo" }
  | { type: "redo" };
type StateType = {
  tree: TreeNode;
  operatingNode: HierarchyPointNode<TreeNode> | null;
  inputAvailable: boolean;
  past: TreeNode[];
  future: TreeNode[];
};

//change case names to CONST
function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "start-edit":
      return { ...state, operatingNode: action.node, inputAvailable: true };
    case "background-click":
      return { ...state, operatingNode: null, inputAvailable: false };
    case "finish-edit":
      const newTree = produce(state.tree, (draft) => {
        renameNode(draft, state.operatingNode!.data.id, action.newText);
      });
      return {
        ...state,
        past: [...state.past, state.tree],
        future: [],
        inputAvailable: false,
        tree: newTree
      };
    case "reset-sample":
      return state; //do nothing for now
    case "reset-blank":
      return state; //do nothing for now
    case "undo":
      const lastTree = state.past.pop();
      state.future.push(state.tree);
      return { ...state, tree: lastTree! };
    case "redo":
      const nextTree = state.future.pop();
      state.past.push(state.tree);
      return { ...state, tree: nextTree! };
    default:
      return state;
  }
}

export default function App() {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [form] = Form.useForm();

  const [state, dispatch] = useReducer(reducer, {
    tree: sampleTree2WithID,
    operatingNode: null,
    inputAvailable: false,
    past: [],
    future: []
  });

  useEffect(() => {
    if (state.operatingNode) {
      form.setFieldsValue({ newText: state.operatingNode.data.name });
    } else {
      form.resetFields();
    }
  }, [state.operatingNode]);

  return (
    <div
      className="App"
      css={css`
        text-align: center;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 15px;
        min-height: 100vh;
      `}
    >
      <Sliders setWidth={setWidth} setHeight={setHeight} />
      <ToolBar
        isInputAvailable={state.inputAvailable}
        dispatch={dispatch}
        form={form}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
      />
      <div
        css={css`
          text-align: center;
          background-color: #fff;
        `}
      >
        <SyntaxTree
          tree={state.tree}
          width={width}
          height={height}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}
