import React from "react";
import { Card, Col } from "antd";

export interface HelpCardProps {
  text: string;
  src: string;
}

export default function HelpCard({ text, src }: HelpCardProps) {
  // span={8} lg={12} md={24} style={{padding:'10px'}}
  return (
    <Col lg={12} md={24} style={{ padding: "10px" }}>
      <Card cover={<img alt={text} src={src} />} size={"small"}>
        {text}
      </Card>
    </Col>
  );
}
