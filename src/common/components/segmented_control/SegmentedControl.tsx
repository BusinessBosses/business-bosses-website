import React, { useRef, useState, useEffect } from "react";
import "./styles.css";

interface Segment {
  label: string;
  value: string;
  ref: React.RefObject<HTMLDivElement>;
}

interface Props {
  name: string;
  segments: Segment[];
  callback: (value: string, index: number) => void;
  defaultIndex?: number;
  controlRef: React.RefObject<HTMLDivElement>;
}

const SegmentedControl: React.FC<Props> = ({
  name,
  segments,
  callback,
  defaultIndex = 0,
  controlRef,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const componentReady = useRef<boolean>(false);

  // Determine when the component is "ready"
  useEffect(() => {
    componentReady.current = true;
  }, []);

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref;
    const { offsetWidth, offsetLeft } = activeSegmentRef.current!;
    const { style } = controlRef.current!;

    style.setProperty("--highlight-width", `${offsetWidth}px`);
    style.setProperty("--highlight-x-pos", `${offsetLeft}px`);
  }, [activeIndex, callback, controlRef, segments]);

  const onInputChange = (value: string, index: number) => {
    setActiveIndex(index);
    callback(value, index);
  };

  return (
    <div className="controls-container" ref={controlRef}>
      <div className={`controls ${componentReady.current ? "ready" : "idle"}`}>
        {segments.map((item, i) => (
          <div
            key={item.value}
            className={`segment ${i === activeIndex ? "active" : "inactive"}`}
            ref={item.ref}
          >
            <input
              type="radio"
              value={item.value}
              id={item.label}
              name={name}
              onChange={() => onInputChange(item.value, i)}
              checked={i === activeIndex}
            />
            <label htmlFor={item.label}>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
