export interface UserToken {
  email: string;
  tipo: "cliente" | "gestor";
  instanceId?: string; // Apenas clientes têm
  iat?: number; // gerado pelo JWT
  exp?: number; // gerado pelo JWT
}

export interface Instancia {
  id: string;
  name: string;
  status: string;
  qrcode?: string;
  number?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EvolutionInstance {
  id: string;
  name: string;
  connectionStatus: "open" | "qr" | "closed" | string;
  qrcode?: string;
  number?: string;
  email?: string;
  password?: string;
  profileName?: string;
  profilePicUrl?: string;
  integration?: string;
  clientName?: string;
  ownerJid?: string;
  token?: string;
  disconnectionAt?: string;
  disconnectionReasonCode?: number;
  disconnectionObject?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    Message?: number;
    Contact?: number;
    Chat?: number;
  };
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  senha: string;
  instanceId: string;
  criadoEm: string;
}
