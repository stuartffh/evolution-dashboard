import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import axios, { AxiosError } from "axios";

const MASTER_KEY = process.env.MASTER_KEY || "zapchatbr.com";
const BASE_URL = "https://panel.zapchatbr.com";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const token = auth.replace("Bearer ", "");
  const decoded = verifyToken(token);
  if (!decoded || decoded.tipo !== "gestor") {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }

  const body = await req.json();
  const { instanceName } = body;

  if (!instanceName) {
    return NextResponse.json(
      { error: "Nome da instância obrigatório" },
      { status: 400 },
    );
  }

  try {
    const payload = {
      instanceName,
      token: instanceName, // pode ser igual ao nome ou gerar aleatório
      integration: "WHATSAPP-BAILEYS",
    };

    const { data } = await axios.post(`${BASE_URL}/instance/create`, payload, {
      headers: { apikey: MASTER_KEY },
    });

    return NextResponse.json(data);
  } catch (error) {
    const err = error as AxiosError;
    const msg = err.response?.data ?? err.message ?? "Erro desconhecido";
    console.error("Erro ao criar instância:", msg);
    return NextResponse.json(
      { error: "Erro ao criar instância", detalhe: msg },
      { status: 500 },
    );
  }
}
