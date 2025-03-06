import React, { useEffect, useState } from 'react';
import Board from '../components/Board/Board';
import Sidebar from '../components/Sidebar/Sidebar';
import { getLatestSession, restartSession, getPhases } from '../services/sessionService';
import { sendMove } from '../services/moveService';
import { TerrainType, ObjectType, MoveDirection, MovedObject } from '../types/GameTypes';
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

  const [moveHistory, setMoveHistory] = useState<ObjectType[][][]>([]);  // 🔹 Histórico de movimentos
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);  // 🔹 Índice do movimento atual

  // 🔹 Atualiza o histórico ao fazer um movimento
  useEffect(() => {
    if (!sessionId) return;

    if (moveHistory.length === 0 || currentMoveIndex === moveHistory.length - 1) {
      setMoveHistory([...moveHistory, objects]);
      setCurrentMoveIndex(moveHistory.length);
    }
  }, [objects]);

  // 🔹 Volta um movimento no histórico
  const handleUndoMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      setObjects(moveHistory[currentMoveIndex - 1]);
    }
  };

  // 🔹 Refaz um movimento no histórico
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

  // ✅ Corrigido: Evento de teclado para adicionar movimento à fila
  useEffect(() => {
    if (!sessionId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [sessionId]);

  // ✅ Corrigido: Processamento da fila de movimentos
  useEffect(() => {
    if (!sessionId || moveQueue.length === 0 || isMoving || isProcessingQueue)
      return;
  
    setIsProcessingQueue(true);
  
    const processNextMove = async () => {
      if (moveQueue.length === 0) {
        setIsProcessingQueue(false);
        return;
      }
  
      setIsMoving(true);
      const move = moveQueue[0];
  
      try {
        const data = await sendMove(sessionId, move);
        if (!data) throw new Error("Erro ao mover o jogador");

        const lastMove = data.moves[data.moves.length - 1] || {};
        setAnimatingObjects(lastMove.movedObjects || []);

        setTimeout(() => {
          setObjects(data.objects);
          setAnimatingObjects([]);
          setMoveQueue((prevQueue) => prevQueue.slice(1));
          setMovesCount(data.moves.length);
          setIsMoving(false);
          setIsProcessingQueue(false);
        }, 200);
      } catch (error) {
        console.error('Erro ao mover:', error);
        setMoveQueue((prevQueue) => prevQueue.slice(1));
        setIsMoving(false);
        setIsProcessingQueue(false);
      }
    };
  
    processNextMove();
  }, [sessionId, moveQueue, isMoving, isProcessingQueue]);

  // ✅ Mantém os botões de fase como estavam antes
  const handlePreviousPhase = () => {
    setPhaseIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPhase = () => {
    setPhaseIndex((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="game-wrapper">
      <div className="game-container">
        {isLoading ? <p>Carregando sessão...</p> : <Board terrain={terrain} objects={objects} animatingObjects={animatingObjects} />}
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
