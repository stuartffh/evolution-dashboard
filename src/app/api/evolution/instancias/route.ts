import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import axios from 'axios';

const MASTER_KEY = process.env.MASTER_KEY || 'zapchatbr.com';
const BASE_URL = 'https://panel.zapchatbr.com/instance';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  if (decoded.tipo !== 'gestor') {
    return NextResponse.json({ error: 'Acesso restrito a gestores' }, { status: 403 });
  }

  try {
    const response = await axios.get(`${BASE_URL}/fetchInstances`, {
      headers: { apikey: MASTER_KEY }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar instâncias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar instâncias" },
      { status: 500 },
    );
  }
}
