// 📌 sessionService.ts
const BASE_URL = 'http://localhost:8080';

export const getLatestSession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sessions/latest`);
    if (!response.ok) throw new Error('Erro ao buscar a sessão');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const restartSession = async (sessionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}/restart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Erro ao reiniciar a sessão');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPhases = async () => {
  try {
    const response = await fetch(`${BASE_URL}/phases`);
    if (!response.ok) throw new Error('Erro ao buscar fases');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
