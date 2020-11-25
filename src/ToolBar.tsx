import React,{ useState } from "react";
import { Button, Form, Input, Dropdown, Menu, Modal,Row } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { actions, TreeNode } from "./Types/TreeTypes";
import { removeID } from "./Utils/traverse";
import { helpData } from "./Utils/helpData";
import downloadSvg, { downloadPng } from "svg-crowbar";
import HelpCard from "./Components/HelpCard";
import "./Styles/Toolbar.css";
import "antd/dist/antd.css";

interface ToolBarProps {
  isInputAvailable: boolean;
  dispatch: any;
  form: any;
  canUndo: boolean;
  canRedo: boolean;
  tree: TreeNode;
}

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
      <Menu.Item onClick={() => {
        setIsImportInputVisible(true);
        }}>JSON</Menu.Item>
      {/* <Menu.Item>[NP [N Brackets]]</Menu.Item> */}
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
  const [isImportInputVisible, setIsImportInputVisible] = useState(false);
  return (
    <div
      className="ToolBar"
    >
      <Modal
        title="Please paste the exported JSON"
        visible={isImportInputVisible}
        onOk={() => setIsImportInputVisible(false)}
        onCancel={() => setIsImportInputVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsImportInputVisible(false)}>
            OK
          </Button>
        ]}
        width={1000} 
      >
       <Form
        onFinish={(val: any) => {
          let newTree:TreeNode = JSON.parse(val.JSONString);
          dispatch({ type: actions.DO_IMPORT, newTree: newTree});
        }}
      >
        <Form.Item name="JSONString">
          <Input
            addonBefore={"JSON:"}
            addonAfter={"Press Enter to import"}
          />
        </Form.Item>
      </Form>
      </Modal>
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
        width={700}
      >
        <Row>
        {helpData.map((help) => (
          <HelpCard 
          key={help.src}
          text={help.text} 
          src={help.src} />
        ))}
        </Row>
      </Modal>
      <Button
        icon={<QuestionCircleOutlined />}
        onClick={() => setIsHelpVisible(true)}
      >
        How-to
      </Button>
      <Dropdown overlay={TemplateMenu} placement="bottomCenter">
        <Button type="primary">Templates</Button>
      </Dropdown>
      <Button
        onClick={() => dispatch({ type: actions.UNDO })}
        disabled={!canUndo}
        type="primary"
        icon={<UndoOutlined />}
      >
        Undo
      </Button>
      <Button
        disabled={!canRedo}
        onClick={() => dispatch({ type: actions.REDO })}
        type="primary"
        icon={<RedoOutlined />}
      >
        Redo
      </Button>
      <Dropdown overlay={ExportMenu} placement="bottomCenter">
        <Button type="primary">Export</Button>
      </Dropdown>
      <Dropdown overlay={ImportMenu} placement="bottomCenter">
        <Button type="primary">Import</Button>
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
            addonAfter={"Press Enter to make change"}
            disabled={!isInputAvailable}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
