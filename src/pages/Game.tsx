import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import Sidebar from '../components/Sidebar/Sidebar';
import { getLatestSession, startSession, restartSession, getPhasesSequence, changePhase } from '../services/sessionService';
import {
  GameSessionResponse,
  MoveResponse,
  ObjectTile,
  MovedObject,
  MoveRecord,
  Direction,
  Position,
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
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [nameSelectedPhase, setNameSelectedPhase] = useState<string | null>(null);
  
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [playerDirection, setPlayerDirection] = useState<Direction>(Direction.DOWN);
  const [skinIndex, setSkinIndex] = useState(0);

  const { gameState, sendMove: sendMoveWS } = useWebSocket();

  useEffect(() => {
    console.log("🛠️ currentSession atualizado:", currentSession);
  }, [currentSession]);

  useEffect(() => {
    console.log("🔄 Inicializando o jogo...");
    console.log("📡 Estado atual da sessão antes da inicialização:", currentSession);
  
    const initializeGame = async () => {
      try {
        const sessionData = await getLatestSession();
        console.log("📡 Sessão carregada do backend:", sessionData);
  
        if (sessionData && sessionData.sessionId) {
          if (!currentSession.sessionId || currentSession.sessionId !== sessionData.sessionId) {
            console.log("✅ Nova sessão recebida:", sessionData.sessionId);
            setCurrentSession(sessionData);
            setCurrentObjects(sessionData.currentObjects);
            setNameSelectedPhase(sessionData.phase.name);
            setTimeElapsed(0);
            setSessionStartTime(new Date(sessionData.updatedAt));
            setCurrentMoveIndex(0);
            setMovesCount(0);
            setIsProcessing(false);
          } else {
            console.log("Sessão já carregada, sem alterações.");
          }
        } else {
          // Lógica para iniciar uma nova sessão se nenhuma for encontrada
          console.log("⚠️ Nenhuma sessão encontrada, iniciando uma nova...");
          const newSession = await handleStartSession();
          console.log("📡 Nova sessão iniciada:", newSession);
          if (newSession && newSession.sessionId) {
            setCurrentSession(newSession);
            setCurrentObjects(newSession.currentObjects);
            setNameSelectedPhase(newSession.phase.name);
            setTimeElapsed(0);
            setSessionStartTime(new Date(newSession.updatedAt));
            setCurrentMoveIndex(0);
            setMovesCount(0);
            setIsProcessing(false);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar sessão:', error);
      } finally {
        setIsLoading(false);
        console.log("✅ Inicialização concluída.");
      }
    };
  
    initializeGame();
  }, []); 

  useEffect(() => {
    if (!sessionStartTime) return;
    
    const updateTime = () => {
      const now = new Date();
      setTimeElapsed(Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000));
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  useEffect(() => {
    if (!currentSession || !currentSession.sessionId) return;

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

  const handleSwipe = useCallback((direction: Direction) => {
    if (!currentSession || !currentSession.sessionId) return;

    console.log("🕹️ Swipe detectado:", direction);
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

  const playerPosition: Position = useMemo(() => {
    const found = currentObjects.find((obj) => obj.type === ObjectType.PLAYER);
    return found ? found.position : { row: 0, col: 0 };
  }, [currentObjects]);

  const handleRestart = async () => {
    if (!currentSession || !currentSession.sessionId) return;
    try {
      const sessionData = await restartSession(currentSession.sessionId);
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

  useEffect(() => {
    if (!currentSession || moveQueue.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const move = moveQueue[0];

    console.log("📡 Enviando movimento para WebSocket:", {
      sessionId: currentSession.sessionId,
      move,
      currentMoveIndex,
    });

    sendMoveWS(currentSession.sessionId, move, currentMoveIndex);
    setMoveQueue((prevQueue) => prevQueue.slice(1));
  }, [currentSession, moveQueue, isProcessing, sendMoveWS, currentMoveIndex]);

  useEffect(() => {
    if (gameState) {
      console.log("📡 Resposta recebida do WebSocket:", gameState);
  
      if ('error' in gameState && gameState.error) {
        console.error("Erro do backend:", gameState.message);
        setIsProcessing(false);
        return;
      }
  
      const moveResponse: MoveResponse = gameState;
  
      if (moveResponse.objects && moveResponse.terrain) {
        console.log("🔄 Atualizando currentObjects e terrain após movimento...");
        setCurrentObjects([...moveResponse.objects]); 
        setCurrentSession((prevSession) => ({
          ...prevSession,
          currentObjects: moveResponse.objects, 
          moveRecords: moveResponse.moveRecords,
          completed: moveResponse.completed,
        }));
      } else {
        console.error("❌ Erro: MoveResponse não retornou objetos ou terreno atualizados.");
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
  
        setTimeout(() => {
          setIsProcessing(false);
        }, 220);
      } else {
        setIsProcessing(false);
      }
      console.log("moveRecords atualizados:", moveResponse.moveRecords);
    }
  }, [gameState]);

  
  useEffect(() => {
    console.log("🔍 Buscando sequência de fases...");
    const fetchPhasesSequence = async () => {
      try {
        const sequenceResponse = await getPhasesSequence();
        console.log("📋 Fases carregadas:", sequenceResponse);
        
        if (sequenceResponse.length > 0) {
          setPhases(sequenceResponse.map(id => ({ id, name: `Fase ${id}` })));
          setPhaseIndex(0);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar sequência de fases:', error);
      }
    };

    fetchPhasesSequence();
  }, []);
  
  useEffect(() => {
    if (phases.length === 0 || phaseIndex < 0 || phaseIndex >= phases.length) return;
  
    console.log(`🔄 Trocando para a fase ${phases[phaseIndex].id}`);
 
    const fetchSelectedPhase = async () => {
      try {
        const phaseId = phases[phaseIndex].id;
        console.log(`📡 Enviando request para trocar para a fase ${phaseId}...`);
  
        const newSession = await changePhase(currentSession.sessionId, phaseId, currentSession.playerId);
        console.log("✅ Nova sessão recebida após troca de fase:", newSession);
  
        if (!newSession) {
          console.error('❌ Erro: newSession está null');
          return;
        }
  
        setMoveRecords([]);
        setMoveQueue([]);
        setMovesCount(0);
        setCurrentMoveIndex(0);
        setIsProcessing(false);
        setTimeElapsed(0);
        setSessionStartTime(new Date());
        setCurrentSession(newSession);

      } catch (error) {
        console.error('❌ Erro ao trocar de fase:', error);
      }
    };
  
    if (currentSession.sessionId) {
      fetchSelectedPhase();
    }
  }, [phaseIndex, phases, currentSession.sessionId]); 

  
  const handleStartSession = async (phaseId?: string): Promise<GameSessionResponse> => {
    try {
      const newSession = await startSession(phaseId);
      if (newSession && newSession.sessionId) {
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
  
  const handlePhaseChange = async (newPhase: number) => {

    try {
      const newSession = await changePhase(currentSession.sessionId, phases[newPhase].id, currentSession.playerId);
      
      if (newSession && newSession.sessionId) {
        setMoveRecords([]);
        setMoveQueue([]);
        setMovesCount(0);
        setCurrentMoveIndex(0);
        setIsProcessing(false);
        setTimeElapsed(0);
        setSessionStartTime(new Date());
        setCurrentSession(newSession);
      } else {
        console.error("❌ Erro: newSession não contém um sessionId válido.");
      }
    } catch (error) {
      console.error('Erro ao mudar fase:', error);
    }
  };

  const handleMoveChange = (newMove: number) => {
    if (newMove >= 0 && newMove <= movesCount) {
      setCurrentMoveIndex(newMove);
    }
  };

  const handleSkinChange = (newSkinIndex: number) => {
    if (newSkinIndex >= 0 && newSkinIndex < 8) {
      setSkinIndex(newSkinIndex);
    }
  };

  return (
    <div className="game-wrapper" {...swipeHandlers}>
      <div className="game-container">
        {isLoading ? <p>Carregando...</p> :
         <ZoomableBoard 
         terrain={currentSession.phase.terrain} 
         objects={currentObjects} 
         moveRecords={moveRecords} 
         playerDirection={playerDirection} 
         playerPosition={playerPosition}
         skinIndex={skinIndex}
         onSwipe={handleSwipe} 
       />}
      </div>

      <Sidebar
        timeElapsed={timeElapsed}
        phaseName={nameSelectedPhase || "Fase Desconhecida"}
        phaseNumber={phaseIndex + 1}
        skinIndex={skinIndex}
        maxSkins={7}
        maxPhases={phases.length}
        maxMoves={movesCount}
        moveHistoryIndex={currentMoveIndex}
        onSkinChange={handleSkinChange}
        onPhaseChange={handlePhaseChange}
        onMoveChange={handleMoveChange}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default Game;