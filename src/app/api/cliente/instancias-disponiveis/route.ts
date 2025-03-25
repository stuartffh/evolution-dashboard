import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { listarInstanciasDisponiveis } from "@/lib/evolution";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  const user = verifyToken(token);

  if (!user || user.tipo !== "gestor") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const instancias = await listarInstanciasDisponiveis();
    return NextResponse.json(instancias, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar instâncias disponíveis:", error);
    return NextResponse.json(
      { error: "Erro ao listar instâncias" },
      { status: 500 },
    );
  }
}
