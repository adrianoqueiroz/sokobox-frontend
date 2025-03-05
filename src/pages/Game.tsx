import React, { useEffect, useState } from 'react'
import Board from '../components/Board/Board'
import {
  ObjectType,
  TerrainType,
  MoveDirection,
  MovedObject,
} from '../types/GameTypes'

const Game: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [terrain, setTerrain] = useState<TerrainType[][]>([])
  const [objects, setObjects] = useState<ObjectType[][]>([])
  const [animatingObjects, setAnimatingObjects] = useState<MovedObject[]>([])
  const [moveQueue, setMoveQueue] = useState<MoveDirection[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 🔹 Busca a última sessão disponível no backend
  useEffect(() => {
    fetch('http://localhost:8080/sessions/latest')
      .then((response) => response.json())
      .then((data) => {
        if (data.sessionId) {
          setSessionId(data.sessionId)
          setTerrain(data.terrain)
          setObjects(data.objects)
          setIsLoading(false)
        } else {
          console.error('Nenhuma sessão encontrada.')
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar a sessão:', error)
        setIsLoading(false)
      })
  }, [])

  // 🔹 Captura eventos do teclado e adiciona à fila de movimentos
  useEffect(() => {
    if (!sessionId) return

    const handleKeyDown = (event: KeyboardEvent) => {
      let direction: MoveDirection | null = null

      if (event.key === 'ArrowUp') direction = MoveDirection.UP
      if (event.key === 'ArrowDown') direction = MoveDirection.DOWN
      if (event.key === 'ArrowLeft') direction = MoveDirection.LEFT
      if (event.key === 'ArrowRight') direction = MoveDirection.RIGHT

      if (direction) {
        setMoveQueue((prevQueue) => [...prevQueue, direction])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [sessionId])

  // 🔹 Processa a fila de movimentos com tratamento para erros
  useEffect(() => {
    if (!sessionId || moveQueue.length === 0 || isMoving || isProcessingQueue)
      return

    setIsProcessingQueue(true)

    const processNextMove = async () => {
      if (moveQueue.length === 0) {
        setIsProcessingQueue(false)
        return
      }

      setIsMoving(true)
      const move = moveQueue[0]

      try {
        const response = await fetch('http://localhost:8080/moves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, direction: move }),
        })

        if (!response.ok) {
          throw new Error('Erro ao mover o jogador')
        }

        const data = await response.json()
        const lastMove = data.moves[data.moves.length - 1] || {}

        setAnimatingObjects(lastMove.movedObjects || [])

        setTimeout(() => {
          setObjects(data.objects)
          setAnimatingObjects([])
          setMoveQueue((prevQueue) => prevQueue.slice(1)) // 🔹 Remove o movimento processado com sucesso
          setIsMoving(false)

          if (moveQueue.length > 1) {
            processNextMove()
          } else {
            setIsProcessingQueue(false)
          }
        }, 200)
      } catch (error) {
        console.error('Erro ao mover:', error)
        setMoveQueue((prevQueue) => prevQueue.slice(1)) // 🔹 Remove o movimento que falhou para evitar loops infinitos
        setIsMoving(false)
        setIsProcessingQueue(false)
      }
    }

    processNextMove()
  }, [sessionId, moveQueue, isMoving, isProcessingQueue])

  return (
    <div>
      <h1>Sokobox</h1>
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
  )
}

export default Game
