import React from "react";
import "./SkinSelector.css";
import ArrowButton from "../ArrowButton/ArrowButton";

interface SkinSelectorProps {
  skinIndex: number;
  maxSkinValue: number;
  onSkinChange: (newSkinIndex: number) => void;
}

const CELL_SIZE = 50;
const SPRITE_WIDTH = 600;
const SPRITE_HEIGHT = 400;

const getSpritePosition = (skinIndex: number) => {
  const row = Math.floor(skinIndex / 4) * 4; 
  const indexSprite = 1 + (skinIndex % 4) * 3;
  const col = indexSprite * CELL_SIZE ;

  return `-${col}px -${row * CELL_SIZE}px`;
};

const SkinSelector: React.FC<SkinSelectorProps> = ({
  skinIndex,
  maxSkinValue,
  onSkinChange,
}) => {

    const handleDecrease = () => {
      if (skinIndex > 0) {
        onSkinChange(skinIndex - 1);
      }
    };
  
    const handleIncrease = () => {
      if (skinIndex < maxSkinValue) {
        onSkinChange(skinIndex + 1);
      }
    };

  return (
    <div className="skin-selector-container">

      <div className="skin-selector">
        <ArrowButton
          direction="left"
          onClick={handleDecrease}
          disabled={skinIndex === 0}
        />

        {/* 🔹 Contêiner para a visualização da skin com um fundo de FLOOR */}
        <div className="skin-preview-container">
          <div className="skin-preview-floor" />
          <div
            className="skin-preview"
            style={{
              background: "url('/assets/player-sprite.png') no-repeat",
              backgroundSize: `${SPRITE_WIDTH}px ${SPRITE_HEIGHT}px`,
              backgroundPosition: getSpritePosition(skinIndex),
            }}
          />
        </div>

        <ArrowButton
          direction="right"
          onClick={handleIncrease}
          disabled={skinIndex === maxSkinValue}
        />
      </div>
    </div>
  );
};

export default SkinSelector;
