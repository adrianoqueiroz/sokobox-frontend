import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import Sidebar from '../components/Sidebar/Sidebar';
import { getLatestSession, restartSession, getPhases } from '../services/sessionService';
import { GameSession, TerrainType, ObjectType, Direction, MovedObject, Position } from '../types/GameTypes';
import { useWebSocket } from '../hooks/useWebSocket';
import ZoomableBoard from '../components/ZoomableBoard/ZoomableBoard';
import './Game.css';

const Game: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [terrain, setTerrain] = useState<TerrainType[][]>([]);
  const [objects, setObjects] = useState<ObjectType[][]>([]);
  const [animatingObjects, setAnimatingObjects] = useState<MovedObject[]>([]);
  const [moveQueue, setMoveQueue] = useState<Direction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movesCount, setMovesCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [phases, setPhases] = useState<{ id: string; name: string }[]>([]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [playerDirection, setPlayerDirection] = useState<Direction>(Direction.DOWN);
  const [skinIndex, setSkinIndex] = useState(0);

  const { gameState, sendMove: sendMoveWS } = useWebSocket();

  /** 🔹 Carrega as fases e a sessão */
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const phasesData = await getPhases();
        setPhases(phasesData);
        setPhaseIndex(0);

        const sessionData = await getLatestSession();
        if (sessionData) {
          setCurrentSession(sessionData);
          setTerrain(sessionData.terrain);
          setObjects(sessionData.objects);
          setSessionStartTime(new Date(sessionData.updatedAt));
          setMovesCount(sessionData.moves.length);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, []);

  /** Atualiza o tempo de jogo */
  useEffect(() => {
    if (!sessionStartTime) return;

    const updateTime = () => {
      const now = new Date();
      setTimeElapsed(Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000));
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  /** Captura eventos de teclado */
  useEffect(() => {
    if (!currentSession) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isProcessing) return;

      const directionMap: { [key: string]: Direction } = {
        ArrowUp: Direction.UP,
        ArrowDown: Direction.DOWN,
        ArrowLeft: Direction.LEFT,
        ArrowRight: Direction.RIGHT,
      };

      const direction = directionMap[event.key];
      if (direction) {
        setMoveQueue((prevQueue) => [...prevQueue, direction]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSession, isProcessing]);

  /** Captura eventos de Swipe */
  const handleSwipe = useCallback((direction: Direction) => {
    if (!currentSession) return;
    setMoveQueue((prevQueue) => [...prevQueue, direction]);
  }, [currentSession]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(Direction.LEFT),
    onSwipedRight: () => handleSwipe(Direction.RIGHT),
    onSwipedUp: () => handleSwipe(Direction.UP),
    onSwipedDown: () => handleSwipe(Direction.DOWN),
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 10,
  });

  const playerPosition: Position | null = useMemo(() => {
    const found = objects.flatMap((row, rowIndex) =>
      row.map((objectType, colIndex) =>
        objectType === ObjectType.PLAYER ? { row: rowIndex, col: colIndex } : null
      )
    ).find((pos) => pos !== null);
  
    return found ?? { row: 0, col: 0 };
  }, [objects]);

  /** Reinicia o jogo */
  const handleRestart = async () => {
    if (!currentSession) return;

    try {
      const data = await restartSession(currentSession.sessionId);
      if (data) {
        setCurrentSession(data);
        setTerrain(data.terrain);
        setObjects(data.objects);
        setTimeElapsed(0);
        setSessionStartTime(new Date(data.updatedAt));
        setCurrentMoveIndex(0);
        setMovesCount(0);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao reiniciar a sessão:', error);
    }
  };

  /** 🔹 Processa a fila de movimentos */
  useEffect(() => {
    if (!currentSession || moveQueue.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const move = moveQueue[0];

    sendMoveWS(currentSession.sessionId, move, currentMoveIndex);

    setMoveQueue((prevQueue) => prevQueue.slice(1));
  }, [currentSession, moveQueue, isProcessing, sendMoveWS, currentMoveIndex]);

  /** 🔹 Atualiza o estado do jogo */
  useEffect(() => {
    if (gameState) {
      if (gameState.error) {
        console.error('Erro do backend:', gameState.error);
        setIsProcessing(false);
        return;
      }

      setObjects(gameState.objects);
      setMovesCount(gameState.moves.length);

      const lastMove = gameState.moves.at(-1);
      if (lastMove?.movedObjects) {
        
        const playerMove = lastMove.movedObjects.find(
          (obj: MovedObject) => obj.type === ObjectType.PLAYER
        );
        
        if (playerMove) {
          const direction 
            = playerMove.toRow < playerMove.fromRow ? Direction.UP
            : playerMove.toRow > playerMove.fromRow ? Direction.DOWN
            : playerMove.toCol < playerMove.fromCol ? Direction.LEFT
            : Direction.RIGHT;
          setPlayerDirection(direction);
        }

        setAnimatingObjects(lastMove.movedObjects);
        setTimeout(() => {
          setAnimatingObjects([]);
          setIsProcessing(false);
        }, 220);
      } else {
        setIsProcessing(false);
      }
    }
  }, [gameState]);

  const handlePreviousPhase = () => {
    setPhaseIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleNextPhase = () => {
    setPhaseIndex((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
  };
  
  const handleUndoMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  };
  
  const handleRedoMove = () => {
    if (currentMoveIndex < moveQueue.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  };

  const handlePreviousSkin = () => {
    setSkinIndex((prev) => (prev > 0 ? prev - 1 : 7));
  };

  const handleNextSkin = () => {
    setSkinIndex((prev) => (prev < 7 ? prev + 1 : 0));
  };


  return (
    <div className="game-wrapper" {...swipeHandlers}>
      <div className="game-container">
        {isLoading ? <p>Carregando...</p> :
         <ZoomableBoard 
          terrain={terrain} 
          objects={objects} 
          animatingObjects={animatingObjects} 
          playerDirection={playerDirection} 
          playerPosition={playerPosition}
          skinIndex={skinIndex}
          onSwipe={handleSwipe} 
         />}
      </div>

      <Sidebar
        movesCount={movesCount}
        timeElapsed={timeElapsed}
        onRestart={handleRestart}
        phaseName={"Phase Name"}
        phaseNumber={phaseIndex + 1} // 🔹 Convertendo índice para fase real
        maxPhases={phases.length} // 🔹 Número total de fases disponíveis
        onPhaseChange={(newPhase) => setPhaseIndex(newPhase - 1)} // 🔹 Atualiza a fase
        moveHistoryIndex={currentMoveIndex}
        maxMoves={moveQueue.length - 1}
        onMoveChange={(newMove) => setCurrentMoveIndex(newMove)}
        skinIndex={skinIndex}
        onPreviousSkin={handlePreviousSkin}
        onNextSkin={handleNextSkin}
      />

    </div>
  );
};

export default Game;
