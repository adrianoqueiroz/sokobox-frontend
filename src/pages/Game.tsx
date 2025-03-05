import React, { useEffect, useState } from 'react';
import Board from '../components/Board/Board';
import Sidebar from '../components/Sidebar/Sidebar';
import {
  ObjectType,
  TerrainType,
  MoveDirection,
  MovedObject,
} from '../types/GameTypes';
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
  
  // 🔹 Busca a última sessão disponível no backend
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/sessions/latest')
      .then((response) => response.json())
      .then((data) => {
        if (data.sessionId) {
          setSessionId(data.sessionId);
          setTerrain(data.terrain);
          setObjects(data.objects);
  
          // ✅ Converte createdAt do backend para um objeto Date
          if (data.createdAt) {
            setSessionStartTime(new Date(data.createdAt));
          }
  
          // ✅ Atualiza a contagem de movimentos com o tamanho da lista de moves
          if (data.moves) {
            setMovesCount(data.moves.length);
          }
  
          setIsLoading(false);
        } else {
          console.error('Nenhuma sessão encontrada.');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar a sessão:', error);
        setIsLoading(false);
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
  

  // 🔹 Captura eventos do teclado e adiciona à fila de movimentos
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

  // 🔹 Processa a fila de movimentos com tratamento para erros
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
        const response = await fetch('http://localhost:8080/moves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, direction: move }),
        });
  
        if (!response.ok) {
          throw new Error('Erro ao mover o jogador');
        }
  
        const data = await response.json();
        const lastMove = data.moves[data.moves.length - 1] || {};
  
        setAnimatingObjects(lastMove.movedObjects || []);
  
        setTimeout(() => {
          setObjects(data.objects);
          setAnimatingObjects([]);
          setMoveQueue((prevQueue) => prevQueue.slice(1));
  
          // ✅ Atualiza a contagem de movimentos com base no tamanho da lista de moves retornada
          setMovesCount(data.moves.length);
  
          setIsMoving(false);
  
          if (moveQueue.length > 1) {
            processNextMove();
          } else {
            setIsProcessingQueue(false);
          }
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

  return (
    <div className="game-wrapper">
      {/* 🔹 O Board agora é um componente independente */}
      <div className="game-container">
        {isLoading ? (
          <p>Carregando sessão...</p>
        ) : (
          <Board
            terrain={terrain}
            objects={objects}
            animatingObjects={animatingObjects}
          />
        )}
      </div>

      {/* 🔹 Sidebar agora está completamente separada */}
      <Sidebar movesCount={movesCount} timeElapsed={timeElapsed} />
    </div>
  );
};

export default Game;
