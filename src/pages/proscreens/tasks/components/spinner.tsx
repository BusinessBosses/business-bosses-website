import React from "react";

interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 16 }) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="relative"
    >
      <svg
        width="100%"
        height="100%"
        fill="none"
        className="absolute animate-spin stroke-inherit"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="1.75"
        viewBox="1 0.125 23 23.75"
      >
        <path
          d="M12.5 23c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11"
          strokeLinecap="round"
        ></path>
      </svg>
    </div>
  );
};

export default Spinner;
