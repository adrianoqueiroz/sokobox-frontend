import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  movesCount: number;
  timeElapsed: number;
  onRestart: () => void; // ✅ Função de reinício como prop
}

const Sidebar: React.FC<SidebarProps> = ({ movesCount, timeElapsed, onRestart }) => {
  // ✅ Formata o tempo para mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-sidebar">
      <h1 className="sokobox-logo">SokoBox</h1>

      <h2>Estatísticas</h2>
      <p>🔄 Movimentos: {movesCount}</p>
      <p>⏳ Tempo: {formatTime(timeElapsed)}</p>

      {/* 🔄 Botão de Reiniciar */}
      <button className="restart-button" onClick={onRestart}>🔄 Reiniciar</button>

      {/* 📺 Replay */}
      <button className="replay-button">📺 Ver Replay</button>
    </div>
  );
};

export default Sidebar;
