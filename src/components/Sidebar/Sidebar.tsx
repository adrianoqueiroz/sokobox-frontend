import React from 'react';
import './Sidebar.css';
import PhaseNavigation from '../PhaseNavigation/PhaseNavigation';

interface SidebarProps {
  movesCount: number;
  timeElapsed: number;
  onRestart: () => Promise<void>;
  phaseName: string;
  onPreviousPhase: () => void;
  onNextPhase: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  movesCount,
  timeElapsed,
  onRestart,
  phaseName,
  onPreviousPhase,
  onNextPhase
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-sidebar">
      <h1 className="sokobox-logo">SokoBox</h1>

      {/* 🔹 Navegação entre fases */}
      <PhaseNavigation 
        phaseName={phaseName} 
        onPrevious={onPreviousPhase} 
        onNext={onNextPhase} 
      />
      
      {/* 🔹 Novo bloco de estatísticas estilizado */}
      <div className="stats-container">
        <h2>Estatísticas</h2>
        <div className="stats-item">
          <span className="stats-icon">🔄</span>
          <span className="stats-text">Movimentos:</span>
          <span className="stats-value">{movesCount}</span>
        </div>
        <div className="stats-item">
          <span className="stats-icon">⏳</span>
          <span className="stats-text">Tempo:</span>
          <span className="stats-value">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* 🔹 Botão de reiniciar estilizado */}
      <button className="restart-button" onClick={onRestart}>🔄 Reiniciar</button>
    </div>
  );
};

export default Sidebar;
