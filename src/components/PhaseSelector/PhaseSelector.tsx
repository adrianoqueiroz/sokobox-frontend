import React from "react";
import "./PhaseSelector.css";
import ArrowButton from "../ArrowButton/ArrowButton";

interface PhaseSelectorProps {
  phaseName: string;
  phaseNumber: number;
  onPreviousPhase: () => void;
  onNextPhase: () => void;
}

const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  phaseName,
  phaseNumber,
  onPreviousPhase,
  onNextPhase,
}) => {
  return (
    <div className="phase-selector-container">
      <span className="phase-subtitle">{phaseName}</span>
      <div className="phase-selector">
        <ArrowButton direction="left" onClick={onPreviousPhase} />
        <span className="phase-number">{phaseNumber}</span>
        <ArrowButton direction="right" onClick={onNextPhase} />
      </div>
    </div>
  );
};

export default PhaseSelector;
