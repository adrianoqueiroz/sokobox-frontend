import React from 'react';
import './FixedObject.css';

interface FixedObjectProps {
  objectType: string;
  cellSize: number;
  imageUrl: string;
  from: { row: number; col: number };
  destinationActive?: boolean;
}

const FixedObject: React.FC<FixedObjectProps> = ({ objectType, cellSize, imageUrl, from, destinationActive = false }) => {
  const round = (value: number) => Math.round(value);
  const top = round(from.row * cellSize);
  const left = round(from.col * cellSize);

  return (
    <div
      className={`fixed-object object-${objectType.toLowerCase()} ${destinationActive ? 'destination-active' : ''}`}
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        top: `${top}px`,
        left: `${left}px`,
        background: imageUrl ? `url(${imageUrl}) no-repeat center` : '#ccc',
        backgroundSize: 'contain',
      }}
    >
      {/* Fallback: mostra o nome do objeto */}
      {!imageUrl && <span>{objectType}</span>}
    </div>
  );
};

export default FixedObject;
