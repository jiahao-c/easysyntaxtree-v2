import React, { useState, useEffect, useReducer } from "react";
import SyntaxTree from "./SyntaxTree";
import ToolBar from "./ToolBar";
import Sliders from "./Components/Sliders";
import AlertOperation, { AlertMode } from "./Components/Alert";
import { StateType, ActionType, actions } from "./Types/TreeTypes";
import {
  sampleTreeWithID,
  blankTreeWithID,
  sampleTree2WithID
} from "./Utils/SampleTrees";
import { calcWidth, calcHeight } from "./Utils/dimension";
import {
  renameNode,
  addNewChild,
  removeSubtree,
  getHeight,
  makeTriangleChild,
  genID
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
          state.operatingNode!.data.id!,
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
        tree: addNewChild(state.tree, action.node.data.id!)
      };
    case actions.MAKE_TRIANGLE:
      return {
        ...state,
        past: [...state.past, state.tree],
        future: [],
        tree: makeTriangleChild(state.tree, action.node.data.id!)
      };
    case actions.REMOVE_SUBTREE:
      return {
        ...state,
        past: [...state.past, state.tree],
        future: [],
        tree: removeSubtree(state.tree, action.node.data.id!)
      };
    case actions.RESET_BLANK:
      return { ...state, tree: blankTreeWithID };
    case actions.RESET_BASIC:
      return { ...state, tree: sampleTreeWithID };
    case actions.RESET_DP:
      return { ...state, tree: sampleTree2WithID };
    case actions.DO_IMPORT:
      return {...state, tree: genID(action.newTree)}
    default:
      return state;
  }
}

export default function App() {
  const [angle, setAngle] = useState(24);
  const [lineOffset, setLineOffset] = useState(6);
  const [form] = Form.useForm();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMode, setAlertMode] = useState(AlertMode.DELETE);
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
    window.addEventListener("keydown", (e) => {
      setAlertMode(e.ctrlKey ? AlertMode.DELETE : AlertMode.TRIG);
      setIsAlertVisible(e.ctrlKey || e.altKey);
    });
    window.addEventListener("keyup", (e) =>
      setIsAlertVisible(e.ctrlKey && e.altKey)
    );
  }, []);

  useEffect(() => {
    if (state.operatingNode) {
      form.setFieldsValue({ newText: state.operatingNode.data.name });
    } else {
      form.resetFields();
    }
  }, [state.operatingNode, form]);

  return (
    <div
      className="App"
      style={{
        'textAlign':'center',
        'backgroundColor':'rgba(0, 0, 0, 0.05)',
        'padding':'15px',
        'minHeight':'100vh'
      }}
    >
      <Sliders
        currentWidth={width}
        currentHeight={height}
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
      onContextMenu={(e) => e.preventDefault()}
      className="TreeSVG"
      style={{
        'backgroundColor': '#fff',
        'textAlign':'center'
      }}
      >
        <AlertOperation isVisible={isAlertVisible} mode={alertMode} />
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
