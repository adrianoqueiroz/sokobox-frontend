import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import Sidebar from '../components/Sidebar/Sidebar';
import { getLatestSession, startSession, restartSession, getPhasesSequence } from '../services/sessionService';
import {
  GameSessionResponse,
  MoveResponse,
  ObjectTile,
  MovedObject,
  MoveRecord,
  Direction,
  ObjectType
} from '../types/GameTypes';
import { useWebSocket } from '../hooks/useWebSocket';
import ZoomableBoard from '../components/ZoomableBoard/ZoomableBoard';
import './Game.css';

const Game: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<GameSessionResponse>({} as GameSessionResponse);
  const [currentObjects, setCurrentObjects] = useState<ObjectTile[]>([]);
  const [moveRecords, setMoveRecords] = useState<MoveRecord[]>([]);

  const [moveQueue, setMoveQueue] = useState<Direction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movesCount, setMovesCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [phases, setPhases] = useState<{ id: string; name: string }[]>([]);
  const [nameSelectedPhase, setNameSelectedPhase] = useState<string | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [playerDirection, setPlayerDirection] = useState<Direction>(Direction.DOWN);
  const [skinIndex, setSkinIndex] = useState(0);
  
  
  
  const [selectedPlayerid, setSelectedPlayerId] = useState("");
  const [selectedPhaseId, setselectedPhaseId] = useState("");

  const { gameState, sendMove: sendMoveWS } = useWebSocket();

  useEffect(() => {
    console.log("🔧 Definindo Player ID e Phase ID...");
    setSelectedPlayerId("d9b0c494-4aa9-4c74-947d-8e2467616dd1");
    setselectedPhaseId("1052ca0b-df02-4124-82f3-a21208bf067b");
  }, []);

  useEffect(() => {
    initializeGame();
  }, [selectedPlayerid, selectedPhaseId]);

  //inicializa o game após carregar o playerId e phaseId
  const initializeGame = async () => {
    if (!selectedPlayerid || !selectedPhaseId) {
      console.log("⏳ Aguardando playerId e phaseId serem definidos...");
      return;
    }
  
    try {
      console.log("🔄 Tentando recuperar a sessão existente...");
      let session = await getLatestSession();
  
      if (!session || !session.id) {
        console.log("⚠️ Nenhuma sessão encontrada, iniciando uma nova...");
        session = await handleStartSession();
      }
  
      if (session && session.id) {
        console.log("✅ Sessão carregada:", session);
        setCurrentSession(session);
        setCurrentObjects(session.currentObjects);
        setMoveRecords(session.moveRecords);
        setNameSelectedPhase(session.phase.name);
        setTimeElapsed(0);
        setSessionStartTime(new Date(session.updatedAt));
        setCurrentMoveIndex(0);
        setMovesCount(0);
        setIsProcessing(false);
      } else {
        console.error("❌ Erro: Nenhuma sessão válida foi carregada.");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar sessão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSession = async (): Promise<GameSessionResponse> => {
    if (!selectedPlayerid || !selectedPhaseId) {
      console.error("❌ Erro: `selectedPlayerid` ou `selectedPhaseId` não definidos.");
      return {} as GameSessionResponse;
    }
  
    try {
      console.log("📡 Enviando requisição para iniciar sessão:", {
        playerId: selectedPlayerid,
        phaseId: selectedPhaseId,
      });
  
      const newSession = await startSession(selectedPlayerid, selectedPhaseId);
      if (newSession && newSession.id) {
        setCurrentSession(newSession);
        return newSession;
      } else {
        console.error("❌ Erro: newSession não contém um sessionId válido.");
        return {} as GameSessionResponse;
      }
    } catch (error) {
      console.error("❌ Erro ao iniciar sessão:", error);
      return {} as GameSessionResponse;
    }
  };

  const handleRestart = async () => {
    if (!currentSession || !currentSession.id) return;
  
    try {
      const sessionData = await restartSession(currentSession.id);
      if (sessionData) {
        setCurrentSession(sessionData);
        setCurrentObjects(sessionData.currentObjects);
        setNameSelectedPhase(sessionData.phase.name);
        setTimeElapsed(0);
        setSessionStartTime(new Date(sessionData.updatedAt));
        setCurrentMoveIndex(0);
        setMovesCount(0);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao reiniciar a sessão:', error);
    }
  };

  //timer da sidebar
  useEffect(() => {
    if (!sessionStartTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      setTimeElapsed(Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  //handle key down
  useEffect(() => {
    if (!currentSession || !currentSession.id) return;

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

  //handle swipe
  const handleSwipe = useCallback((direction: Direction) => {
    if (!currentSession || !currentSession.id) return;
    console.log("🕹️ Swipe detectado:", direction);
    setMoveQueue((prevQueue) => [...prevQueue, direction]);
  }, [currentSession]);

// Enviar o movimento apenas se não estiver processando
useEffect(() => {
  if (!currentSession || moveQueue.length === 0 || isProcessing) return;

  setIsProcessing(true);
  const move = moveQueue[0];

  console.log("📡 Enviando movimento para WebSocket:", {
    sessionId: currentSession.id,
    playerId: selectedPlayerid,
    move,
    currentMoveIndex,
  });

  sendMoveWS(selectedPlayerid, currentSession.id, move, currentMoveIndex);
}, [currentSession, moveQueue, isProcessing, sendMoveWS, currentMoveIndex]);

// Escutar a resposta do WebSocket para processar o próximo movimento
useEffect(() => {
  if (!gameState) return;

  console.log("📡 Resposta recebida do WebSocket:", gameState);

  if ('error' in gameState && gameState.error) {
    console.error("❌ Erro do backend:", gameState);

    // Removemos o movimento problemático da fila
    setMoveQueue((prevQueue) => prevQueue.slice(1));

    // Liberamos o processamento para aceitar novos movimentos
    setIsProcessing(false);
    return;
  }

  const moveResponse: MoveResponse = gameState;

  if (moveResponse.objects && moveResponse.terrain) {
    setCurrentObjects([...moveResponse.objects]); 
    setCurrentSession((prevSession) => ({
      ...prevSession,
      currentObjects: moveResponse.objects, 
      moveRecords: moveResponse.moveRecords,
      completed: moveResponse.completed,
    }));
  }

  const lastMove = moveResponse.moveRecords.length > 0 
    ? moveResponse.moveRecords[moveResponse.moveRecords.length - 1] 
    : undefined;

  if (lastMove?.movedObjects) {
    const playerMove = lastMove.movedObjects.find(
      (obj: MovedObject) => obj.type === ObjectType.PLAYER
    );
    if (playerMove) {  
      setPlayerDirection(lastMove.direction);
    }
    setMoveRecords([...moveResponse.moveRecords]);
    setCurrentMoveIndex(moveResponse.moveRecords.length);
  }

  // Agora removemos o movimento processado e liberamos o processamento
  setMoveQueue((prevQueue) => prevQueue.slice(1));
  setIsProcessing(false);
}, [gameState]);

  return (
    <div className="game-wrapper">
      <div className="game-container">
        {isLoading ? (
          <p>Carregando...</p>
        ) : !currentSession || !currentSession.phase ? (
          <p>⚠️ Sessão não encontrada. Tente reiniciar.</p>
        ) : (
          <ZoomableBoard
            terrain={currentSession.phase.terrain} // ⬅️ Evita erro ao acessar `terrain`
            objects={currentObjects} // ⬅️ Evita erro ao acessar `currentObjects`
            moveRecords={currentSession.moveRecords}
            playerId={selectedPlayerid}
            playerDirection={playerDirection}
            skinIndex={skinIndex}
            onSwipe={handleSwipe}
          />
        )}
      </div>
      
      <Sidebar
        timeElapsed={timeElapsed}
        phaseName={nameSelectedPhase || "Fase Desconhecida"}
        phaseNumber={1}
        skinIndex={skinIndex}
        maxSkins={7}
        maxPhases={1}
        maxMoves={movesCount}
        moveHistoryIndex={currentMoveIndex}
        onSkinChange={setSkinIndex}
        onMoveChange={setCurrentMoveIndex}
        onRestart={handleRestart}
        onPhaseChange={() => {}} // Temporário
      />
    </div>
  );
};

export default Game;