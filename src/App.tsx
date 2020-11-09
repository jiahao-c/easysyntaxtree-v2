/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState, useEffect, useReducer } from "react";
import SyntaxTree from "./SyntaxTree";
import ToolBar from "./ToolBar";
import Sliders from "./Components/Sliders";
import AlertDelete from "./Components/Alert";
import { TreeNode, StateType, ActionType, actions } from "./Types/TreeTypes";
import {
  sampleTreeWithID,
  blankTreeWithID,
  sampleTree2WithID
} from "./Utils/SampleTrees";
import { calcWidth, calcHeight } from "./Utils/dimension";
import { HierarchyPointNode } from "d3-hierarchy";
import {
  renameNode,
  addNewChild,
  removeSubtree,
  getHeight
} from "./Utils/traverse";
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
    case actions.REMOVE_SUBTREE:
      return {
        ...state,
        past: [...state.past, state.tree],
        future: [],
        tree: removeSubtree(state.tree, action.node.data.id)
      };
    case actions.RESET_BLANK:
      return { ...state, tree: blankTreeWithID };
    case actions.RESET_BASIC:
      return { ...state, tree: sampleTreeWithID };
    case actions.RESET_DP:
      return { ...state, tree: sampleTree2WithID };
    default:
      return state;
  }
}

export default function App() {
  const [angle, setAngle] = useState(24);
  const [lineOffset, setLineOffset] = useState(6);
  const [form] = Form.useForm();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    tree: sampleTreeWithID,
    operatingNode: null,
    inputAvailable: false,
    past: [],
    future: []
  });
  const [width, setWidth] = useState(calcWidth(getHeight(state.tree)));
  const [height, setHeight] = useState(calcHeight(getHeight(state.tree)));

  useEffect(() => {
    let treeHeight = getHeight(state.tree);
    setWidth(calcWidth(treeHeight));
    setHeight(calcHeight(treeHeight));
  }, [state.tree]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => setIsAlertVisible(e.ctrlKey));
    window.addEventListener("keyup", (e) => setIsAlertVisible(e.ctrlKey));
  }, []);

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
        onContextMenu={(e) => e.preventDefault()}
      >
        <AlertDelete isVisible={isAlertVisible} />
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
