import React from "react";
import { Alert, Affix } from "antd";

interface AlertProps {
  isVisible: boolean;
}

export default function AlertDelete(props: AlertProps) {
  const affixStyle = {
    visibility: props.isVisible ? "visible" : "hidden",
    display: "flex",
    justifyContent: "center"
  };

  return (
    <div>
      <Affix offsetTop={20} style={affixStyle}>
        <Alert
          message="DELETE MODE: click on a node to remove the subtree"
          type="warning"
          showIcon
        />
      </Affix>
    </div>
  );
}
