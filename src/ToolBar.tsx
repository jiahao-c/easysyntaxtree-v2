/** @jsx jsx */
//import { Dispatch, SetStateAction } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Button, Form, Input } from "antd";
import {
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
//import { TreeNode } from "../Types/TreeTypes";
import "antd/dist/antd.css";

interface ToolBarProps {
  isInputAvailable: boolean;
  dispatch: any;
  form: any;
}

const ButtonStyled = styled(Button)`
  margin: 5px;
`;

export default function ToolBar({
  isInputAvailable,
  dispatch,
  form
}: ToolBarProps) {
  return (
    <div
      css={css`
        text-align: center;
      `}
    >
      <ButtonStyled icon={<QuestionCircleOutlined />}>Help</ButtonStyled>
      <ButtonStyled
        type="primary"
        onClick={() => dispatch({ type: "reset-sample" })}
      >
        Example Tree
      </ButtonStyled>
      <ButtonStyled
        type="primary"
        onClick={() => dispatch({ type: "reset-blank" })}
      >
        Blank Tree
      </ButtonStyled>
      <ButtonStyled type="primary" icon={<UndoOutlined />}>
        Undo
      </ButtonStyled>
      <ButtonStyled type="primary" icon={<RedoOutlined />}>
        Redo
      </ButtonStyled>
      <ButtonStyled icon={<DeleteOutlined />} type="primary">
        Remove Subtree
      </ButtonStyled>
      <ButtonStyled type="primary">Draw Movement</ButtonStyled>
      <ButtonStyled type="primary">Export</ButtonStyled>

      <Form
        form={form}
        onFinish={(val: any) => {
          dispatch({ type: "finish-edit", newText: val.newText });
          form.setFieldsValue({ newText: "" });
        }}
      >
        <Form.Item name="newText">
          <Input addonBefore={"Node Text:"} disabled={!isInputAvailable} />
        </Form.Item>
      </Form>
    </div>
  );
}
