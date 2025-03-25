import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  const user = verifyToken(token);

  if (!user || user.tipo !== "gestor") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const clientes = await prisma.cliente.findMany({
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(clientes);
}
