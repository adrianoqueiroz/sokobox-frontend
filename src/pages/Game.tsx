import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { getLatestSession, restartSession, getPhases } from '../services/sessionService';
import { TerrainType, ObjectType, MoveDirection, MovedObject } from '../types/GameTypes';
import { useWebSocket } from '../hooks/useWebSocket';
import SwipeableBoard from '../components/SwipeableBoard/Swipeableboard';
import './Game.css';

const Game: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [terrain, setTerrain] = useState<TerrainType[][]>([]);
  const [objects, setObjects] = useState<ObjectType[][]>([]);
  const [animatingObjects, setAnimatingObjects] = useState<MovedObject[]>([]);
  const [moveQueue, setMoveQueue] = useState<MoveDirection[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movesCount, setMovesCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [phases, setPhases] = useState<{ id: string, name: string }[]>([]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [moveHistory, setMoveHistory] = useState<ObjectType[][][]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [playerDirection, setPlayerDirection] = useState<'up'|'down'|'left'|'right'>('down');

  const { gameState, sendMove: sendMoveWS } = useWebSocket();

  // Atualiza o histórico de movimentos
  useEffect(() => {
    if (!sessionId) return;

    if (moveHistory.length === 0 || currentMoveIndex === moveHistory.length - 1) {
      setMoveHistory([...moveHistory, objects]);
      setCurrentMoveIndex(moveHistory.length);
    }
  }, [objects]);

  const handleUndoMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      setObjects(moveHistory[currentMoveIndex - 1]);
    }
  };

  const handleRedoMove = () => {
    if (currentMoveIndex < moveHistory.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      setObjects(moveHistory[currentMoveIndex + 1]);
    }
  };

  useEffect(() => {
    getPhases().then((data) => {
      setPhases(data);
      setPhaseIndex(0);
    });

    getLatestSession().then((data) => {
      if (data) {
        setSessionId(data.sessionId);
        setTerrain(data.terrain);
        setObjects(data.objects);
        if (data.createdAt) setSessionStartTime(new Date(data.createdAt));
        if (data.moves) setMovesCount(data.moves.length);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!sessionStartTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedTime = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      setTimeElapsed(elapsedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const handleRestart = async () => {
    if (!sessionId) return;
    const data = await restartSession(sessionId);
    if (data) {
      setTerrain(data.terrain);
      setObjects(data.objects);
      setMovesCount(0);
      setTimeElapsed(0);
      setSessionStartTime(new Date(data.updatedAt));
    }
  };

  // Adiciona movimento à fila via evento de teclado
  useEffect(() => {
    if (!sessionId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignora novas entradas se já estiver em movimento
      if (isMoving) return;

      let direction: MoveDirection | null = null;
      if (event.key === 'ArrowUp') direction = MoveDirection.UP;
      if (event.key === 'ArrowDown') direction = MoveDirection.DOWN;
      if (event.key === 'ArrowLeft') direction = MoveDirection.LEFT;
      if (event.key === 'ArrowRight') direction = MoveDirection.RIGHT;

      if (direction) {
        setMoveQueue((prevQueue) => [...prevQueue, direction]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sessionId, isMoving]);

  const handleSwipe = (direction: MoveDirection) => {
    // Aqui você pode optar por ignorar isMoving se quiser permitir movimentos contínuos

    console.log('Swipe detectado:', direction);

    setMoveQueue(prevQueue => [...prevQueue, direction]);
  };  

  // Processa a fila de movimentos via WebSocket
  useEffect(() => {
    if (!sessionId || moveQueue.length === 0 || isMoving || isProcessingQueue) return;

    setIsProcessingQueue(true);
    const move = moveQueue[0];
    setIsMoving(true);

    // Se currentMoveIndex for 0 (ou seja, sem movimentos anteriores), envia -1 para indicar que não há índice válido.
    const resetIndex = currentMoveIndex === 0 ? -1 : currentMoveIndex;
    sendMoveWS(sessionId, move, resetIndex);

    // Remove o movimento enviado da fila
    setMoveQueue((prevQueue) => prevQueue.slice(1));

  }, [sessionId, moveQueue, isMoving, isProcessingQueue, sendMoveWS, currentMoveIndex]);


  // Atualiza o estado do jogo a partir do gameState recebido via WebSocket
// Atualiza o estado do jogo a partir do gameState recebido via WebSocket
useEffect(() => {
  if (gameState) {
    if (gameState.error) {
      console.error("Erro recebido do backend:", gameState.error);
      setIsMoving(false);
      setIsProcessingQueue(false);
      return;
    }

    console.log("gameState recebido:", gameState);
    const { moves, objects } = gameState;
    setObjects(objects);
    setMovesCount(moves.length);
    const lastMove = moves && moves.length > 0 ? moves[moves.length - 1] : null;
    if (lastMove && lastMove.movedObjects) {
      console.log("Atualizando animação com movedObjects:", lastMove.movedObjects);
      setAnimatingObjects(lastMove.movedObjects);

      // Atualiza a direção do player se houver movimento do PLAYER
      const playerMove = lastMove.movedObjects.find((obj: MovedObject) => obj.type === 'PLAYER');
      if (playerMove) {
        let direction: 'up' | 'down' | 'left' | 'right' = 'down';
        if (playerMove.toRow < playerMove.fromRow) direction = 'up';
        else if (playerMove.toRow > playerMove.fromRow) direction = 'down';
        else if (playerMove.toCol < playerMove.fromCol) direction = 'left';
        else if (playerMove.toCol > playerMove.fromCol) direction = 'right';
        setPlayerDirection(direction);
      }

      // Após 500ms (duração da animação), remove os AnimatedObjects e libera o próximo movimento
      setTimeout(() => {
        setAnimatingObjects([]);
        setIsMoving(false);
        setIsProcessingQueue(false);
      }, 220);
    } else {
      // Se não houver animação, libera imediatamente
      setIsMoving(false);
      setIsProcessingQueue(false);
    }
  }
}, [gameState]);


  const handlePreviousPhase = () => {
    setPhaseIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPhase = () => {
    setPhaseIndex((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
  };




  // Dentro do Game.tsx (antes do return)
  const playerPos = React.useMemo(() => {
    for (let i = 0; i < objects.length; i++) {
      for (let j = 0; j < objects[i].length; j++) {
        if (objects[i][j] === 'PLAYER') {
          return { row: i, col: j };
        }
      }
    }
    // Se não encontrar, retorna posição padrão (por exemplo, 0,0)
    return { row: 0, col: 0 };
  }, [objects]);


  return (
    <div className="game-wrapper">
      <div className="game-container">
      {isLoading ? <p>Carregando sessão...</p> : (
          <SwipeableBoard
            onSwipe={handleSwipe}
            terrain={terrain}
            objects={objects}
            animatingObjects={animatingObjects}
            playerDirection={playerDirection}
            playerRow={playerPos.row}
            playerCol={playerPos.col}
          />
        )}
      </div>
      <Sidebar 
        movesCount={movesCount} 
        timeElapsed={timeElapsed} 
        onRestart={handleRestart} 
        phaseName={phases[phaseIndex]?.name || "Fase Desconhecida"}
        onPreviousPhase={handlePreviousPhase} 
        onNextPhase={handleNextPhase} 
        onUndoMove={handleUndoMove} 
        onRedoMove={handleRedoMove} 
        canUndo={currentMoveIndex > 0}
        canRedo={currentMoveIndex < moveHistory.length - 1}
      />
    </div>
  );
};

export default Game;
