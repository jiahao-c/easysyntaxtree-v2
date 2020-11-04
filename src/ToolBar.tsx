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
        title="Basic Modal"
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
        <p>To add a child, right click on a node</p>
        <p>To remove a subtree, hold shift and right click on a node </p>
        <p>To edit a node, double click on it</p>
      </Modal>
      <ButtonStyled
        icon={<QuestionCircleOutlined />}
        onClick={() => setIsHelpVisible(true)}
      >
        Help
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
      <ButtonStyled type="primary">Draw Movement</ButtonStyled>
      <Dropdown overlay={ExportMenu} placement="bottomCenter">
        <ButtonStyled type="primary">Export</ButtonStyled>
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
