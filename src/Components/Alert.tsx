import React from "react";
import { Alert } from "antd";

interface AlertProps {
  isVisible: boolean;
}

//TODO: finish alert logic
export default function AlertDelete(props: AlertProps) {
  //key down isVisible, key up . Use keybaord event
  return (
    (props.isVisible)?
    <div>
      <Alert
        message="DELETE MODE: click on a node to remove the subtree"
        type="warning"
        showIcon
        closable
      />
    </div>:null
  );
}
