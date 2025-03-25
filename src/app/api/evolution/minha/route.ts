import { NextRequest, NextResponse } from "next/server";
import { listarInstancias } from "@/lib/evolution";
import type { EvolutionInstance } from "../../../../lib/types";

export async function GET(req: NextRequest) {
  const instanceId = req.nextUrl.searchParams.get("instanceId");

  const todas = await listarInstancias();
  const instancia = todas.find((i: EvolutionInstance) => i.id === instanceId);

  if (!instancia)
    return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  return NextResponse.json(instancia);
}
