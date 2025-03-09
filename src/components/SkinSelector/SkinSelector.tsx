import React from "react";
import "./SkinSelector.css";
import ArrowButton from "../ArrowButton/ArrowButton";

interface SkinSelectorProps {
  skinIndex: number;
  onPreviousSkin: () => void;
  onNextSkin: () => void;
}

const CELL_SIZE = 50;
const SPRITE_WIDTH = 600;
const SPRITE_HEIGHT = 400;
const TOTAL_SKINS = 8;

/** 🔹 Corrigido: Agora cada skin é posicionada corretamente no sprite */
const getSpritePosition = (skinIndex: number) => {
  const row = Math.floor(skinIndex / 4) * 4; 
  const indexSprite = 1 + (skinIndex % 4) * 3;
  const col = indexSprite * CELL_SIZE ;

  return `-${col+1}px -${row * CELL_SIZE}px`;
};

const SkinSelector: React.FC<SkinSelectorProps> = ({
  skinIndex,
  onPreviousSkin,
  onNextSkin,
}) => {
  return (
    <div className="skin-selector-container">

      <div className="skin-selector">
        <ArrowButton
          direction="left"
          onClick={onPreviousSkin}
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
          onClick={onNextSkin}
          disabled={skinIndex === TOTAL_SKINS - 1}
        />
      </div>
    </div>
  );
};

export default SkinSelector;
