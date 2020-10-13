/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState, useEffect, useReducer } from "react";
import SyntaxTree from "./SyntaxTree";
import ToolBar from "./ToolBar";
import Sliders from "./Components/Sliders";
import { TreeNode } from "./Types/TreeTypes";
import { sampleTreeWithID, blankTreeWithID } from "./Utils/SampleTrees";
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
  | { type: "reset-blank" };
type StateType = {
  tree: TreeNode;
  operatingNode: HierarchyPointNode<TreeNode> | null;
  inputAvailable: boolean;
};
export default function App() {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [form] = Form.useForm();

  const [state, dispatch] = useReducer(reducer, {
    tree: sampleTreeWithID,
    operatingNode: null,
    inputAvailable: false
  });

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
        return { ...state, inputAvailable: false, tree: newTree };
      case "reset-sample":
        return state; //do nothing for now
      case "reset-blank":
        return state; //do nothing for now
      default:
        return state;
    }
  }

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
