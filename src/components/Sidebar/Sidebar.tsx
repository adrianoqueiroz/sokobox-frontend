import React from "react";
import "./Sidebar.css";
import PhaseSelector from "../PhaseSelector/PhaseSelector";
import MoveSelector from "../MoveSelector/MoveSelector";
import StatsComponent from "../StatsComponent/StatsComponent";
import SokoBoxLogo from "../SokoBoxLogo/SokoBoxLogo";
import SkinSelector from "../SkinSelector/SkinSelector";

interface SidebarProps {
  movesCount: number;
  timeElapsed: number;
  onRestart: () => Promise<void>;
  phaseName: string;
  onPreviousPhase: () => void;
  onNextPhase: () => void;
  onUndoMove: () => void;
  onRedoMove: () => void;
  canUndo: boolean;
  canRedo: boolean;
  skinIndex: number;
  onPreviousSkin: () => void;
  onNextSkin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  movesCount,
  timeElapsed,
  onRestart,
  phaseName,
  onPreviousPhase,
  onNextPhase,
  onUndoMove,
  onRedoMove,
  canUndo,
  canRedo,
  skinIndex,
  onPreviousSkin,
  onNextSkin,
}) => {
  return (
    <div className="game-sidebar">
      <SokoBoxLogo />

      <div className="sidebar-section">
        <h3 className="section-title">Skin</h3>
        <SkinSelector
          skinIndex={skinIndex}
          onPreviousSkin={onPreviousSkin}
          onNextSkin={onNextSkin}
        />
      </div>

      <hr className="sidebar-divider" />
      
      <div className="sidebar-section">
        <h3 className="section-title">Fase</h3>
        <PhaseSelector
          phaseName={phaseName}
          phaseNumber={1}
          onPreviousPhase={onPreviousPhase}
          onNextPhase={onNextPhase}
        />
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        <h3 className="section-title">Movimentos</h3>
        <MoveSelector
          movesCount={movesCount}
          onUndoMove={onUndoMove}
          onRedoMove={onRedoMove}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        <h3 className="section-title">Estatísticas</h3>
        <StatsComponent timeElapsed={timeElapsed} attempts={1} />
      </div>

      <hr className="sidebar-divider" />

      <button className="restart-button" onClick={onRestart}>
        🔄 Reiniciar
      </button>
    </div>
  );
};

export default Sidebar;
