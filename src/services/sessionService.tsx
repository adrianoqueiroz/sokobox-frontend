import { GameSessionResponse, PhaseType, MoveResponse } from '../types/GameTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const getLatestSession = async (): Promise<GameSessionResponse> => {
  try {
    const response = await fetch(`${API_URL}/sessions/latest`);
    if (!response.ok) throw new Error('Erro ao buscar a sessão');
    return await response.json() as GameSessionResponse;
  } catch (error) {
    console.error(error);
    return {} as GameSessionResponse;
  }
};

export const startSession = async (phaseId?: string): Promise<GameSessionResponse> => {
  try {
    const response = await fetch(`${API_URL}/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phaseId ? { phaseId } : {}),
    });
    if (!response.ok) throw new Error('Erro ao iniciar sessão');
    return await response.json() as GameSessionResponse;
  } catch (error) {
    console.error(error);
    return {} as GameSessionResponse;
  }
};

export const changePhase = async (sessionId: string, phaseId: string, playerId: string): Promise<GameSessionResponse> => {
  try {
    console.log("📡 Enviando request para changePhase:", { sessionId, phaseId, playerId });

    if (!sessionId) {
      throw new Error("❌ sessionId está indefinido antes de enviar a requisição!");
    }

    const response = await fetch(`${API_URL}/sessions/switch-phase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, phaseId, playerId }), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao trocar de fase: ${errorText}`);
    }
    
    return await response.json() as GameSessionResponse;
  } catch (error) {
    console.error(error);
    return {} as GameSessionResponse;
  }
};

export const getPhasesSequence = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/phases/sequence`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Erro ao buscar a sequência de fases');
    const data = await response.json();
    return Array.isArray(data.orderedPhaseIds) ? data.orderedPhaseIds : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const restartSession = async (sessionId: string): Promise<GameSessionResponse> => {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/restart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Erro ao reiniciar a sessão');
    return await response.json() as GameSessionResponse;
  } catch (error) {
    console.error(error);
    return {} as GameSessionResponse;
  }
};

export const getPhase = async (phaseId: string): Promise<PhaseType> => {
  try {
    const response = await fetch(`${API_URL}/phases/${phaseId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Erro ao buscar a fase');
    return await response.json() as PhaseType;
  } catch (error) {
    console.error(error);
    return {} as PhaseType;
  }
};

export const getPhases = async (): Promise<PhaseType[]> => {
  try {
    const response = await fetch(`${API_URL}/phases`);
    if (!response.ok) throw new Error('Erro ao buscar fases');
    return await response.json() as PhaseType[];
  } catch (error) {
    console.error(error);
    return [];
  }
};