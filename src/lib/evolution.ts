// src/lib/evolution.ts
import axios from "axios";
import { EvolutionInstance } from "./types";
const BASE_URL = "https://panel.zapchatbr.com";
const MASTER_KEY = process.env.MASTER_KEY || "zapchatbr.com";

export async function listarInstanciasDisponiveis(): Promise<
  EvolutionInstance[]
> {
  const { data }: { data: EvolutionInstance[] } = await axios.get(
    `${BASE_URL}/instance/fetchInstances`,
    {
      headers: { apikey: MASTER_KEY },
    },
  );

  return data;
}

export async function listarInstancias(): Promise<EvolutionInstance[]> {
  return listarInstanciasDisponiveis();
}

// Funções auxiliares
export async function conectarInstancia(id: string) {
  await axios.get(`${BASE_URL}/instance/connect/${id}`, {
    headers: { apikey: MASTER_KEY },
  });
}

export async function desconectarInstancia(id: string) {
  await axios.delete(`${BASE_URL}/instance/logout/${id}`, {
    headers: { apikey: MASTER_KEY },
  });
}
