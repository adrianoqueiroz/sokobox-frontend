import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { MoveResponse } from '../types/GameTypes';

const BASE_WS_URL = import.meta.env.VITE_WS_URL;

export const useWebSocket = (playerId: string, sessionId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<MoveResponse | undefined>();

  useEffect(() => {
    if (!playerId || !sessionId) {
      console.error('❌ playerId ou sessionId não informados! Não conectando ao WebSocket.');
      return;
    }

    // Enviando os IDs como query params (método correto)
    const WS_URL = `${BASE_WS_URL}?playerId=${encodeURIComponent(playerId)}&sessionId=${encodeURIComponent(sessionId)}`;
    console.log('🔌 Tentando conectar ao WebSocket:', WS_URL);

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
        console.error('❌ Erro ao processar a mensagem do WebSocket:', error, 'Dados:', event.data);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error);
    };

    return () => {
      console.log('❌ Desconectando WebSocket...');
      ws.close();
    };
  }, [playerId, sessionId]);

  const sendMove = (
    direction: string,
    currentMoveIndex: number,
  ) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket não está conectado ou ainda está abrindo!');
      return;
    }

    const moveCommand = { direction, currentMoveIndex };
    console.log("🚀 Enviando movimento:", moveCommand);
    socket.send(JSON.stringify(moveCommand));
  };

  return { gameState, sendMove };
};