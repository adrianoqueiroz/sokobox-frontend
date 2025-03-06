import React from 'react';
import './PhaseNavigation.css';

interface PhaseNavigationProps {
  phaseName: string;
  onPrevious: () => void;
  onNext: () => void;
}

const PhaseNavigation: React.FC<PhaseNavigationProps> = ({ phaseName, onPrevious, onNext }) => {
  return (
    <div className="phase-navigation">
      <button className="phase-button prev" onClick={onPrevious}>‹</button>
      <span className="phase-name">{phaseName}</span>
      <button className="phase-button next" onClick={onNext}>›</button>
    </div>
  );
};

export default PhaseNavigation;
