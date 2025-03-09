import React from "react";
import "./StatsComponent.css";

interface StatsComponentProps {
  timeElapsed: number;
  attempts: number;
}

const StatsComponent: React.FC<StatsComponentProps> = ({ timeElapsed, attempts }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="stats-component">
      <div className="stats-item">
        <span className="stats-icon">🎯</span>
        <span className="stats-text">Tentativas:</span>
        <span className="stats-value">{attempts}</span>
      </div>
      <div className="stats-item">
        <span className="stats-icon">⏳</span>
        <span className="stats-text">Tempo:</span>
        <span className="stats-value">{formatTime(timeElapsed)}</span>
      </div>
    </div>
  );
};

export default StatsComponent;
