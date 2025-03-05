import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  movesCount: number;
  timeElapsed: number; // ✅ Tempo já é recebido como prop
}

const Sidebar: React.FC<SidebarProps> = ({ movesCount, timeElapsed }) => {
  // ✅ Formata o tempo para mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-sidebar">
      <h1>SokoBox</h1>

      <h2>Estatísticas</h2>
      <p>🔄 Movimentos: {movesCount}</p>
      <p>⏳ Tempo: {formatTime(timeElapsed)}</p> {/* ✅ Mostra o tempo formatado */}
      <button className="replay-button">📺 Ver Replay</button>
    </div>
  );
};

export default Sidebar;
