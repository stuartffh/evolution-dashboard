import { NextRequest, NextResponse } from "next/server";

const MASTER_KEY = process.env.MASTER_KEY || "zapchatbr.com";
const BASE_URL = "https://panel.zapchatbr.com";

// GET → conectar
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ acao: string; id: string }> },
) {
  const { acao, id: instanceName } = await context.params;

  if (acao !== "connect" || !instanceName) {
    return NextResponse.json(
      { error: "Ação ou ID inválido para GET" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/instance/connect/${instanceName}`,
      {
        method: "GET",
        headers: {
          apikey: MASTER_KEY,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao conectar", detalhe: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Erro interno ao conectar:", err);
    return NextResponse.json(
      { error: "Erro interno ao conectar" },
      { status: 500 },
    );
  }
}

// DELETE → logout ou delete
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ acao: string; id: string }> },
) {
  const { acao, id: instanceName } = await context.params;

  if (!acao || !instanceName) {
    return NextResponse.json(
      { error: "Parâmetros inválidos" },
      { status: 400 },
    );
  }

  let endpoint = "";
  if (acao === "logout") {
    endpoint = `/instance/logout/${instanceName}`;
  } else if (acao === "delete") {
    endpoint = `/instance/delete/${instanceName}`;
  } else {
    return NextResponse.json(
      { error: "Ação inválida para DELETE" },
      { status: 405 },
    );
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        apikey: MASTER_KEY,
      },
    });

    if (!response.ok) {
      const msg = await response.text();
      return NextResponse.json(
        { error: "Erro ao executar ação", detalhe: msg },
        { status: response.status },
      );
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error("Erro interno ao executar ação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
