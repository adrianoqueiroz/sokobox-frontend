const WS_URL = import.meta.env.VITE_WS_URL

export const sendMove = async (
  sessionId: string,
  direction: string,
  resetMovesAfterIndex: number,
) => {
  try {
    const response = await fetch(`${WS_URL}/moves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        direction,
        resetMovesAfterIndex, // 🔹 Indica até onde os movimentos são válidos
      }),
    })

    if (!response.ok) throw new Error('Erro ao mover o jogador')
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}
