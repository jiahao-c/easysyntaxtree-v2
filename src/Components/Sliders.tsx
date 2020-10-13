import React from "react";
import { Slider } from "antd";

interface SliderProps {
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

export default function Sliders(props: SliderProps) {
  return (
    <div>
      Width Slider:
      <Slider
        defaultValue={500}
        min={100}
        max={1000}
        onAfterChange={props.setWidth}
      />
      Height Slider:
      <Slider
        defaultValue={500}
        min={100}
        max={1000}
        onAfterChange={props.setHeight}
      />
    </div>
  );
}
