import { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const SOCKET_URL = "ws://localhost:8080/ws/game";

export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [gameState, setGameState] = useState<any>(null);

    useEffect(() => {
        console.log("🔌 Tentando conectar ao WebSocket...");
        const ws = new ReconnectingWebSocket(SOCKET_URL);

        ws.onopen = () => {
            console.log("✅ Conectado ao WebSocket!");
            setSocket(ws as WebSocket); // 🔹 Garantimos que `ws` é do tipo correto
        };

        ws.onmessage = (event) => {
            try {
                // console.log("📥 Mensagem recebida:", event.data);
                const parsedData = JSON.parse(event.data);
                setGameState(parsedData);
            } catch (error) {
                console.error("❌ Erro ao processar a mensagem do WebSocket:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("❌ Erro no WebSocket:", error);
        };

        return () => {
            console.log("❌ Desconectando WebSocket...");
            ws.close();
        };
    }, []);

    const sendMove = (sessionId: string, direction: string, resetMovesAfterIndex: number) => {
        if (!socket) {
            console.error("❌ WebSocket não está conectado!");
            return;
        }

        const moveCommand = { sessionId, direction, resetMovesAfterIndex };
        // console.log("📤 Enviando movimento via WebSocket:", moveCommand);
        socket.send(JSON.stringify(moveCommand));
    };

    return { gameState, sendMove };
};
