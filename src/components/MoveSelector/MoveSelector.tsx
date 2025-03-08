import React from "react";
import "./MoveSelector.css";
import ArrowButton from "../ArrowButton/ArrowButton";

interface MoveSelectorProps {
  movesCount: number;
  onUndoMove: () => void;
  onRedoMove: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const MoveSelector: React.FC<MoveSelectorProps> = ({
  movesCount,
  onUndoMove,
  onRedoMove,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="move-selector-container">
      <div className="move-selector">
        <ArrowButton direction="left" onClick={onUndoMove} disabled={!canUndo} />
        <span className="move-count">{movesCount}</span>
        <ArrowButton direction="right" onClick={onRedoMove} disabled={!canRedo} />
      </div>
    </div>
  );
};

export default MoveSelector;
