import React from "react";
import "./NumberSelector.css";
import ArrowButton from "../ArrowButton/ArrowButton";

interface NumberSelectorProps {
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (newValue: number) => void;
  label?: string;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({
  value,
  minValue,
  maxValue,
  onChange,
  label,
}) => {
  const handleDecrease = () => {
    if (value > minValue) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < maxValue) onChange(value + 1);
  };

  return (
    <div className="number-selector-container">
      {label && <h3 className="number-selector-title">{label}</h3>}

      <div className="selector-controls">
        <ArrowButton direction="left" onClick={handleDecrease} disabled={value <= minValue} />

        <div className="selector-number-box">
          <span className="selector-number">{value}</span>
        </div>

        <ArrowButton direction="right" onClick={handleIncrease} disabled={value >= maxValue} />
      </div>
    </div>
  );
};

export default NumberSelector;
