import { useState } from "react";
import { Button, Form, Input, Dropdown, Modal, Row } from "antd";
import type { MenuProps } from 'antd';
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

interface ToolBarProps {
  dispatch: any;
  canUndo: boolean;
  canRedo: boolean;
  tree: TreeNode;
}

export default function ToolBar({
  dispatch,
  canUndo,
  canRedo,
  tree
}: ToolBarProps) {
  const exportItems: MenuProps['items'] = [
    {
      key: 'json',
      label: 'JSON',
      onClick: () => console.log(JSON.stringify(removeID(tree)))
    },
    {
      key: 'svg',
      label: 'SVG',
      onClick: () => downloadSvg(document.querySelector("#treeSVG"), "EasySyntaxTree")
    },
    {
      key: 'png',
      label: 'PNG',
      onClick: () => downloadPng(document.querySelector("#treeSVG"), "EasySyntaxTree", {
        css: "internal"
      })
    }
  ];

  const importItems: MenuProps['items'] = [
    {
      key: 'json',
      label: 'JSON',
      onClick: () => setIsImportInputVisible(true)
    }
  ];

  const templateItems: MenuProps['items'] = [
    {
      key: 'blank',
      label: 'Blank Tree',
      onClick: () => dispatch({ type: actions.RESET_BLANK })
    },
    {
      key: 'tp',
      label: 'Tree with TP',
      onClick: () => dispatch({ type: actions.RESET_BASIC })
    },
    {
      key: 'dp',
      label: 'Tree with DP',
      onClick: () => dispatch({ type: actions.RESET_DP })
    }
  ];

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isImportInputVisible, setIsImportInputVisible] = useState(false);
  return (
    <div
      className="ToolBar"
    >
      <Modal
        title="Please paste the exported JSON"
        open={isImportInputVisible}
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
        open={isHelpVisible}
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
      <Dropdown menu={{ items: templateItems }} placement="bottom">
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
      <Dropdown menu={{ items: exportItems }} placement="bottom">
        <Button type="primary">Export</Button>
      </Dropdown>
      <Dropdown menu={{ items: importItems }} placement="bottom">
        <Button type="primary">Import</Button>
      </Dropdown>
    </div>
  );
}
