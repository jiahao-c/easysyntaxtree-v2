/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState, useEffect, useReducer } from "react";
import SyntaxTree from "./SyntaxTree";
import ToolBar from "./ToolBar";
import Sliders from "./Components/Sliders";
import { TreeNode, StateType, ActionType, actions } from "./Types/TreeTypes";
import {
  sampleTreeWithID,
  blankTreeWithID,
  sampleTree2WithID
} from "./Utils/SampleTrees";
import { HierarchyPointNode } from "d3-hierarchy";
import { renameNode, addNewChild } from "./Utils/traverse";
import { Form } from "antd";
import "antd/dist/antd.css";

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case actions.START_EDIT:
      return { ...state, operatingNode: action.node, inputAvailable: true };
    case actions.BG_CLICK:
      return { ...state, operatingNode: null, inputAvailable: false };
    case actions.FINISH_EDIT:
      return {
        ...state,
        past: [...state.past, state.tree],
        future: [],
        inputAvailable: false,
        tree: renameNode(
          state.tree,
          state.operatingNode!.data.id,
          action.newText
        )
      };
    case actions.UNDO:
      return {
        ...state,
        future: [...state.future, state.tree],
        tree: state.past.pop()!
      };
    case actions.REDO:
      return {
        ...state,
        past: [...state.past, state.tree],
        tree: state.future.pop()!
      };
    case actions.NEW_CHILD:
      return {
        ...state,
        past: [...state.past, state.tree],
        future: [],
        tree: addNewChild(state.tree, action.node.data.id)
      };
    case actions.RESET_BLANK:
      return state; //do nothing for now
    case actions.RESET_BASIC:
      return state; //do nothing for now
    case actions.RESET_DP:
      return state; //do nothing for now
    default:
      return state;
  }
}

export default function App() {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [angle, setAngle] = useState(24);
  const [lineOffset, setLineOffset] = useState(6);
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
      <Sliders
        setWidth={setWidth}
        setHeight={setHeight}
        setAngle={setAngle}
        setLineOffset={setLineOffset}
      />
      <ToolBar
        isInputAvailable={state.inputAvailable}
        dispatch={dispatch}
        form={form}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
        tree={state.tree}
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
          angle={angle}
          lineOffset={lineOffset}
        />
      </div>
    </div>
  );
}
