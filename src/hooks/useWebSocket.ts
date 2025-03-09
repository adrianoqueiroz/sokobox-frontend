import { useEffect, useState } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

const WS_URL = import.meta.env.VITE_WS_URL

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [gameState, setGameState] = useState<any>(null)

  useEffect(() => {
    console.log('🔌 Tentando conectar ao WebSocket...')
    const ws = new ReconnectingWebSocket(WS_URL)

    ws.onopen = () => {
      console.log('✅ Conectado ao WebSocket!')
      setSocket(ws as WebSocket)
    }

    ws.onmessage = (event) => {
      try {
      
        const parsedData = JSON.parse(event.data)
        setGameState(parsedData)
      } catch (error) {
        console.error('❌ Erro ao processar a mensagem do WebSocket:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error)
    }

    return () => {
      console.log('❌ Desconectando WebSocket...')
      ws.close()
    }
  }, [])

  const sendMove = (
    sessionId: string,
    direction: string,
    currentMoveIndex: number,
  ) => {
    if (!socket) {
      console.error('❌ WebSocket não está conectado!')
      return
    }

    const moveCommand = { sessionId, direction, currentMoveIndex }
    socket.send(JSON.stringify(moveCommand))
  }

  return { gameState, sendMove }
}
