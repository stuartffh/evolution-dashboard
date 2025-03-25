import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserToken } from './types';

// ✅ Função para garantir que o secret esteja presente
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
  }
  return secret;
};

const SECRET = getJwtSecret();

// ✅ Gera o token com base no usuário
export function generateToken(user: UserToken): string {
  return jwt.sign(user, SECRET, { expiresIn: '1d' });
}

// ✅ Verifica e decodifica um token JWT com segurança
export function verifyToken(token: string): UserToken | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;

    // Verifica se o token contém os dados mínimos esperados
    if (
      typeof decoded === 'object' &&
      'email' in decoded &&
      'tipo' in decoded &&
      (decoded.tipo === 'cliente' || decoded.tipo === 'gestor')
    ) {
      return {
        email: decoded.email as string,
        tipo: decoded.tipo as 'cliente' | 'gestor',
        instanceId: decoded.instanceId as string | undefined,
      };
    }

    return null;
  } catch (error) {
    console.warn('Token inválido ou expirado:', error);
    return null;
  }
}
