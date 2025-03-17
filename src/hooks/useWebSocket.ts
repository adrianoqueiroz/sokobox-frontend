import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { MoveResponse } from '../types/GameTypes'; 

const WS_URL = import.meta.env.VITE_WS_URL;

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<MoveResponse | undefined>();

  useEffect(() => {
    console.log('🔌 Tentando conectar ao WebSocket...');
    const ws = new ReconnectingWebSocket(WS_URL);

    ws.onopen = () => {
      console.log('✅ Conectado ao WebSocket!');
      setSocket(ws as WebSocket);
    };

    ws.onmessage = (event) => {
      try {
        console.log("🔄 Dados recebidos brutos:", event.data);
        const parsedData: MoveResponse = JSON.parse(event.data);
        console.log("✅ Mensagem processada:", parsedData);
        setGameState(parsedData);
      } catch (error) {
        console.error('❌ Erro ao processar a mensagem do WebSocket:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error);
    };

    return () => {
      console.log('❌ Desconectando WebSocket...');
      ws.close();
    };
  }, []);

  const sendMove = (
    playerId: string,
    sessionId: string,
    direction: string, // se você tiver um enum para Direction, pode usar o tipo correspondente
    currentMoveIndex: number,
  ) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket não está conectado ou ainda está abrindo!');
      return;
    }

    const moveCommand = { playerId, sessionId, direction, currentMoveIndex };
    console.log("🚀 Enviando movimento:", moveCommand);
    socket.send(JSON.stringify(moveCommand));
  };

  return { gameState, sendMove };
};