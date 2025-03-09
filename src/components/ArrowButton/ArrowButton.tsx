import React from "react";
import "./ArrowButton.css";

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right";
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, ...props }) => {
  return (
    <button className={`arrow-button ${direction}`} {...props}>
      {direction === "left" ? "‹" : "›"}
    </button>
  );
};

export default ArrowButton;
