import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { Cliente } from '@prisma/client';

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();

  // Gestor fixo
  if (email === process.env.ADMIN_USER && senha === process.env.ADMIN_SENHA) {
    const token = generateToken({
      email,
      tipo: 'gestor',
      instanceId: undefined, // ou simplesmente omita, pois é opcional
    });
    

    return NextResponse.json({ token, tipo: 'gestor' });
  }

  // Cliente no banco
  const cliente: Cliente | null = await prisma.cliente.findUnique({ where: { email } });

  if (!cliente || cliente.senha !== senha) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  const token = generateToken({
    email: cliente.email,
    tipo: 'cliente',
    instanceId: cliente.instanceId,
  });

  return NextResponse.json({ token, tipo: 'cliente' });
}
