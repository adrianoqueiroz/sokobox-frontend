import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  elapsedTime: number;
  moveCount: number;
  bestScore: number | null;
  onRestart: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ elapsedTime, moveCount, bestScore, onRestart }) => {
  return (
    <div className="sidebar">
      <h2>📊 Estatísticas</h2>
      <p>⏳ Tempo: {elapsedTime}s</p>
      <p>🚶 Movimentos: {moveCount}</p>
      <p>🏆 Melhor: {bestScore !== null ? bestScore : '-'}</p>

      <button onClick={onRestart}>🔄 Reiniciar</button>
      <button disabled={true}>▶️ Mostrar Replay</button>
      <button disabled={true}>🏠 Voltar ao Menu</button>
    </div>
  );
};

export default Sidebar;
