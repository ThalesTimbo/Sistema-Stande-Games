export type EquipmentType = 'pc' | 'console';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  isOccupied: boolean;
  currentSession?: Session;
}

export interface Session {
  id: string;
  equipmentId: string;
  startTime: Date;
  duration: number; // em minutos
  timeRemaining: number; // em segundos
  playerName?: string;
}
