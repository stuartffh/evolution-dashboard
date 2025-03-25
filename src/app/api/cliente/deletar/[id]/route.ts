import { NextRequest, NextResponse } from "next/server";

const MASTER_KEY = process.env.MASTER_KEY || "zzz";
const BASE_URL = "https://panel.zzz.com";

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string; acao: "connect" | "logout" | "delete" } },
) {
  const { id, acao } = context.params;

  if (!id || !acao) {
    return NextResponse.json(
      { error: "Parâmetros inválidos" },
      { status: 400 },
    );
  }

  const endpoint =
    acao === "connect"
      ? `/instance/connect/${id}`
      : acao === "logout"
        ? `/instance/logout/${id}`
        : acao === "delete"
          ? `/instance/delete/${id}`
          : null;

  if (!endpoint) {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: acao === "delete" ? "DELETE" : "GET",
      headers: {
        apikey: MASTER_KEY,
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json(
        { error: "Falha na operação", detalhe: msg },
        { status: res.status },
      );
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error("Erro ao executar ação:", error);
    return NextResponse.json(
      { error: "Erro interno ao executar ação" },
      { status: 500 },
    );
  }
}
