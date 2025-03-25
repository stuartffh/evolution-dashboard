import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  const user = verifyToken(token);
  if (!user || user.tipo !== "gestor") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { nome, email, senha, instanceId } = await req.json();

  try {
    const cliente = await prisma.cliente.update({
      where: { id: context.params.id },
      data: { nome, email, senha, instanceId },
    });

    return NextResponse.json(cliente);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Erro desconhecido" }, { status: 400 });
  }
}
