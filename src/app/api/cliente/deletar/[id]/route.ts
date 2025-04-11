import { NextRequest, NextResponse } from "next/server";


const MASTER_KEY = process.env.MASTER_KEY || "zapchatbr.com";
const BASE_URL = "https://panel.zapchatbr.com";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const url = new URL(req.url);
  const acao = url.searchParams.get("acao");

  if (!id || !acao || !["connect", "logout", "delete"].includes(acao)) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const endpoint =
    acao === "connect"
      ? `/instance/connect/${id}`
      : acao === "logout"
      ? `/instance/logout/${id}`
      : `/instance/delete/${id}`;

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
        { status: res.status }
      );
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error("Erro ao executar ação:", error);
    return NextResponse.json(
      { error: "Erro interno ao executar ação" },
      { status: 500 }
    );
  }
}
