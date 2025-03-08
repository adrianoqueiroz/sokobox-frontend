import React from 'react';
import './FixedObject.css';

interface FixedObjectProps {
  objectType: string; // ou ObjectType se estiver tipado como union (ex: 'BOX' | ...)
  cellSize: number;
  imageUrl: string;
}

const FixedObject: React.FC<FixedObjectProps> = ({ objectType, cellSize, imageUrl }) => {
  return (
    <div
      className="fixed-object"
      style={{
        width: cellSize,
        height: cellSize,
        background: imageUrl ? `url(${imageUrl}) no-repeat center` : 'none',
        backgroundSize: 'contain',
      }}
    />
  );
};

export default FixedObject;
