import React from "react";
import { Alert, Affix } from "antd";

export enum AlertMode {
  DELETE,
  TRIG
}

interface AlertProps {
  isVisible: boolean;
  mode: AlertMode;
}

export default function AlertOperation(props: AlertProps) {
  const affixStyle = {
    visibility: props.isVisible ? "visible" : "hidden",
    display: "flex",
    justifyContent: "center"
  };

  return (
    <div>
      <Affix offsetTop={20} style={affixStyle}>
        <Alert
          message={
            props.mode === AlertMode.DELETE
              ? "DELETE MODE: click on a node to remove the subtree"
              : "MAKE TRIANGLE MODE: click on a node to connect its child with a triangle"
          }
          type="warning"
          showIcon
        />
      </Affix>
    </div>
  );
}
