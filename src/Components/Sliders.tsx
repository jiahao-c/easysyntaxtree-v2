import React from "react";
import { Slider, Collapse } from "antd";

interface SliderProps {
  currentWidth: number;
  currentHeight: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setAngle: React.Dispatch<React.SetStateAction<number>>;
  setLineOffset: React.Dispatch<React.SetStateAction<number>>;
}

export default function Sliders(props: SliderProps) {
  return (
    <div>
      <Collapse
        items={[{
          key: '1',
          label: 'Customize Width and Height',
          children: (
            <>
              Width Control:
              <Slider
                defaultValue={props.currentWidth}
                min={100}
                max={1000}
                onAfterChange={props.setWidth}
              />
              Height Control:
              <Slider
                defaultValue={props.currentHeight}
                min={100}
                max={1000}
                onAfterChange={props.setHeight}
              />
            </>
          )
        }]}
      />
      {/*Angle Control:
        <Slider
        defaultValue={24}
        min={-24}
        max={72}
        onAfterChange={props.setAngle}
      />
      Line Offset Control:
      <Slider
        defaultValue={6}
        min={-12}
        max={24}
        onAfterChange={props.setLineOffset}
      /> */}
    </div>
  );
}
