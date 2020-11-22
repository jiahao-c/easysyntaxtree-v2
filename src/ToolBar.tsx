/** @jsx jsx */
//import { Dispatch, SetStateAction } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useState } from "react";
import { Button, Form, Input, Dropdown, Menu, Modal } from "antd";
import {
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
//import { TreeNode } from "../Types/TreeTypes";
import { actions, TreeNode } from "./Types/TreeTypes";
import { removeID } from "./Utils/traverse";
import downloadSvg, { downloadPng } from "svg-crowbar";
import "antd/dist/antd.css";

interface ToolBarProps {
  isInputAvailable: boolean;
  dispatch: any;
  form: any;
  canUndo: boolean;
  canRedo: boolean;
  tree: TreeNode;
}

const ButtonStyled = styled(Button)`
  margin: 5px;
`;

export default function ToolBar({
  isInputAvailable,
  dispatch,
  form,
  canUndo,
  canRedo,
  tree
}: ToolBarProps) {
  const ExportMenu = (
    <Menu>
      <Menu.Item onClick={() => console.log(JSON.stringify(removeID(tree)))}>
        JSON without ID
      </Menu.Item>
      <Menu.Item onClick={() => console.log(JSON.stringify(tree))}>
        JSON
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          downloadSvg(document.querySelector("#treeSVG"), "EasySyntaxTree")
        }
      >
        SVG
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          downloadPng(document.querySelector("#treeSVG"), "EasySyntaxTree", {
            css: "internal"
          })
        }
      >
        PNG
      </Menu.Item>
    </Menu>
  );
  const ImportMenu = (
    <Menu>
      <Menu.Item>JSON</Menu.Item>
      <Menu.Item>[NP [N Brackets]]</Menu.Item>
    </Menu>
  );
  const TemplateMenu = (
    <Menu>
      <Menu.Item onClick={() => dispatch({ type: actions.RESET_BLANK })}>
        Blank Tree
      </Menu.Item>
      <Menu.Item onClick={() => dispatch({ type: actions.RESET_BASIC })}>
        Tree with TP
      </Menu.Item>
      <Menu.Item onClick={() => dispatch({ type: actions.RESET_DP })}>
        Tree with DP
      </Menu.Item>
    </Menu>
  );

  const [isHelpVisible, setIsHelpVisible] = useState(false);

  return (
    <div
      css={css`
        text-align: center;
      `}
    >
      <Modal
        title="How To Use Easy Syntax Tree"
        visible={isHelpVisible}
        onOk={() => setIsHelpVisible(false)}
        onCancel={() => setIsHelpVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsHelpVisible(false)}>
            OK
          </Button>
        ]}
      >
        <p>To start, select a template</p>
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://user-images.githubusercontent.com/8275280/99901077-f3429e00-2cee-11eb-99b0-671e6c5ee674.jpeg"
          alt="template"
        />
        <p>To add a child, Right Click on a node</p>
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://user-images.githubusercontent.com/8275280/99901079-f63d8e80-2cee-11eb-8bc1-82ad1c7dab09.jpeg"
          alt="right-click"
        />
        <p>
          To remove a subtree, hold <kbd>Control</kbd> and Left Click on a node{" "}
        </p>
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://user-images.githubusercontent.com/8275280/99901077-f3429e00-2cee-11eb-99b0-671e6c5ee674.jpeg"
          alt="ctrl-left-click"
        />
        <p>To edit a node, double click on it</p>
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://user-images.githubusercontent.com/8275280/99901078-f50c6180-2cee-11eb-963d-db820515b8d2.jpeg"
          alt="double-click"
        />
      </Modal>
      <ButtonStyled
        icon={<QuestionCircleOutlined />}
        onClick={() => setIsHelpVisible(true)}
      >
        How-to
      </ButtonStyled>
      <Dropdown overlay={TemplateMenu} placement="bottomCenter">
        <ButtonStyled type="primary">Templates</ButtonStyled>
      </Dropdown>
      <ButtonStyled
        onClick={() => dispatch({ type: actions.UNDO })}
        disabled={!canUndo}
        type="primary"
        icon={<UndoOutlined />}
      >
        Undo
      </ButtonStyled>
      <ButtonStyled
        disabled={!canRedo}
        onClick={() => dispatch({ type: actions.REDO })}
        type="primary"
        icon={<RedoOutlined />}
      >
        Redo
      </ButtonStyled>
      {/* <ButtonStyled icon={<DeleteOutlined />} type="primary">
        Remove Subtree
      </ButtonStyled> */}
      {/* <ButtonStyled type="primary">Draw Movement Trace</ButtonStyled> */}
      <Dropdown overlay={ExportMenu} placement="bottomCenter">
        <ButtonStyled type="primary">Export</ButtonStyled>
      </Dropdown>
      <Dropdown overlay={ImportMenu} placement="bottomCenter">
        <ButtonStyled type="primary">Import</ButtonStyled>
      </Dropdown>

      <Form
        form={form}
        onFinish={(val: any) => {
          dispatch({ type: actions.FINISH_EDIT, newText: val.newText });
          form.setFieldsValue({ newText: "" });
        }}
      >
        <Form.Item name="newText">
          <Input
            addonBefore={"Node Text:"}
            //addonAfter={"Press Enter to make change"}
            disabled={!isInputAvailable}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
