import React, { useEffect, useState } from 'react';
import Board from '../components/Board/Board';
import { ObjectType, TerrainType, MoveRecord, MovedObject } from '../types/GameTypes';

const Game: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [terrain, setTerrain] = useState<TerrainType[][]>([]);
  const [objects, setObjects] = useState<ObjectType[][]>([]);
  const [animatingObjects, setAnimatingObjects] = useState<MovedObject[]>([]);

  // 🔹 Obtém a última sessão ativa
  useEffect(() => {
    fetch(`http://localhost:8080/sessions`)
      .then(response => response.json())
      .then(sessions => {
        if (sessions.length > 0) {
          setSessionId(sessions[sessions.length - 1].sessionId);
        } else {
          console.error('Nenhuma sessão encontrada.');
        }
      })
      .catch(error => console.error('Erro ao buscar sessão:', error));
  }, []);

  // 🔹 Carrega os dados da sessão
  useEffect(() => {
    if (!sessionId) return;

    fetch(`http://localhost:8080/sessions/${sessionId}`)
      .then(response => response.json())
      .then(data => {
        setTerrain(data.terrain);
        setObjects(data.objects);
      })
      .catch(error => console.error('Erro ao carregar a fase:', error));
  }, [sessionId]);

  // 🔹 Captura eventos do teclado e envia o comando de movimentação
  useEffect(() => {
    if (!sessionId) return;

    const handleKeyDown = async (event: KeyboardEvent) => {
      let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null = null;
      if (event.key === 'ArrowUp') direction = 'UP';
      if (event.key === 'ArrowDown') direction = 'DOWN';
      if (event.key === 'ArrowLeft') direction = 'LEFT';
      if (event.key === 'ArrowRight') direction = 'RIGHT';

      if (direction) {
        try {
          const response = await fetch(`http://localhost:8080/moves`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, direction }),
          });

          if (!response.ok) {
            throw new Error('Erro ao mover o jogador');
          }

          const data = await response.json();

          // 🔥 Pegamos apenas os objetos movimentados na ÚLTIMA jogada
          const lastMove: MoveRecord | undefined = data.moves[data.moves.length - 1];
          if (lastMove) {
            setAnimatingObjects(lastMove.movedObjects);
          }

          // 🔄 Pequeno delay antes de atualizar os objetos para permitir a animação
          setTimeout(() => {
            setObjects(data.objects);
            setAnimatingObjects([]); // 🔄 Remove a animação após a atualização real
          }, 200);
        } catch (error) {
          console.error('Erro ao mover:', error);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sessionId]);

  return (
    <div>
      <h1>Sokobox</h1>
      <Board terrain={terrain} objects={objects} animatingObjects={animatingObjects} />
    </div>
  );
};

export default Game;
