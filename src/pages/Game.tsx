import React, { useEffect, useState, useCallback } from 'react'
import Board from '../components/Board/Board'
import { ObjectType, TerrainType, MoveDirection } from '../types/GameTypes'

const Game: React.FC = () => {
  const [terrain, setTerrain] = useState<TerrainType[][]>([])
  const [objects, setObjects] = useState<ObjectType[][]>([])
  const sessionId = 'b088cd0e-0b4a-4576-8d55-a2c733a4009b' // TODO: Tornar dinâmico depois

  // Carrega os dados da fase do backend
  useEffect(() => {
    fetch(`http://localhost:8080/sessions/${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        setTerrain(data.terrain)
        setObjects(data.objects)
      })
      .catch((error) => console.error('Erro ao carregar a fase:', error))
  }, [sessionId])

  // Função para movimentar o jogador
  const movePlayer = useCallback(
    async (direction: MoveDirection) => {
      try {
        const response = await fetch(`http://localhost:8080/moves`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, direction }),
        })

        if (!response.ok) {
          throw new Error('Erro ao mover o jogador')
        }

        const data = await response.json()
        setObjects(data.objects)
      } catch (error) {
        console.error('Erro ao mover:', error)
      }
    },
    [sessionId],
  )

  // Captura os eventos do teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, MoveDirection> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      }

      const direction = keyMap[event.key]
      if (direction) {
        movePlayer(direction)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer])

  return (
    <div>
      <h1>Sokobox</h1>
      <Board terrain={terrain} objects={objects} />
    </div>
  )
}

export default Game
