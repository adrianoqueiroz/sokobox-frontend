import React from "react";
import "./Sidebar.css";
import NumberSelector from "../NumberSelector/NumberSelector";
import StatsComponent from "../StatsComponent/StatsComponent";
import SokoBoxLogo from "../SokoBoxLogo/SokoBoxLogo";
import SkinSelector from "../SkinSelector/SkinSelector";

interface SidebarProps {
  timeElapsed: number;
  onRestart: () => Promise<void>;
  phaseName: string;
  phaseNumber: number;
  maxPhases: number;
  onPhaseChange: (newPhase: number) => void;
  moveHistoryIndex: number;
  maxMoves: number;
  onMoveChange: (newMoveIndex: number) => void;
  skinIndex: number;
  maxSkins: number;
  onSkinChange: (newSkinIndex: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  timeElapsed,
  onRestart,
  phaseName,
  phaseNumber,
  maxPhases,
  onPhaseChange,
  moveHistoryIndex,
  maxMoves,
  onMoveChange,
  skinIndex,
  maxSkins,
  onSkinChange,
}) => {
  return (
    <div className="game-sidebar">
      <SokoBoxLogo />

      <div className="sidebar-section">
        <h3 className="section-title">Skin</h3>
        <SkinSelector
          skinIndex={skinIndex}
          maxSkinValue={maxSkins}
          onSkinChange={onSkinChange}
        />
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        <h3 className="section-title">Fase</h3>
        <NumberSelector
          label={`Fase: ${phaseName}`} // 🔹 Mostra o nome da fase junto ao número
          value={phaseNumber}
          minValue={1}
          maxValue={maxPhases}
          onChange={onPhaseChange}
        />
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
      <h3 className="section-title">Movimentos</h3>
        <NumberSelector
          value={moveHistoryIndex}
          minValue={0}
          maxValue={maxMoves}
          onChange={onMoveChange}
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
