const API_URL = import.meta.env.VITE_API_URL

export const getLatestSession = async () => {
  try {
    const response = await fetch(`${API_URL}/sessions/latest`)
    if (!response.ok) throw new Error('Erro ao buscar a sessão')
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

export const restartSession = async (sessionId: string) => {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/restart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Erro ao reiniciar a sessão')
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getPhases = async () => {
  try {
    const response = await fetch(`${API_URL}/phases`)
    if (!response.ok) throw new Error('Erro ao buscar fases')
    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}
