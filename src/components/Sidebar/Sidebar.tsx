import React from "react";
import "./Sidebar.css";
import PhaseSelector from "../PhaseSelector/PhaseSelector";
import MoveSelector from "../MoveSelector/MoveSelector";
import StatsComponent from "../StatsComponent/StatsComponent";
import SokoBoxLogo from "../SokoBoxLogo/SokoBoxLogo";

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
}) => {
  return (
    <div className="game-sidebar">
      <SokoBoxLogo />

      <div className="sidebar-section">
        <h3 className="section-title">Selecionar Fase</h3>
        <PhaseSelector
          phaseName={phaseName}
          phaseNumber={1}
          onPreviousPhase={onPreviousPhase}
          onNextPhase={onNextPhase}
        />
      </div>

      <hr className="sidebar-divider" /> {/* 🔹 Linha separadora */}

      <div className="sidebar-section">
        <h3 className="section-title">Estatísticas</h3>
        <StatsComponent movesCount={movesCount} timeElapsed={timeElapsed} />
      </div>

      <hr className="sidebar-divider" /> {/* 🔹 Linha separadora */}

      <div className="sidebar-section">
        <h3 className="section-title">Histórico de Movimentos</h3>
        <MoveSelector
          movesCount={movesCount}
          onUndoMove={onUndoMove}
          onRedoMove={onRedoMove}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      <hr className="sidebar-divider" /> {/* 🔹 Linha separadora */}

      <button className="restart-button" onClick={onRestart}>
        🔄 Reiniciar
      </button>
    </div>
  );
};

export default Sidebar;
