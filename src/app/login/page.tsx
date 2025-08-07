'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/components/ToastProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToastContext();

  const handleLogin = async () => {
    if (!email || !senha) {
      toast.warning('Campos obrigatórios', 'Por favor, preencha email e senha');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token;

        if (!token) {
          toast.error('Erro de autenticação', 'Token não retornado pelo servidor');
          return;
        }

        localStorage.setItem('token', token);

        let payload;
        try {
          payload = JSON.parse(atob(token.split('.')[1]));
        } catch (err) {
          console.error('Erro ao decodificar token:', err);
          toast.error('Token inválido', 'Erro ao processar dados de login');
          return;
        }

        toast.success('Login realizado!', 'Redirecionando para o painel...');

        if (payload.tipo === 'gestor') {
          router.push('/gestor');
        } else if (payload.tipo === 'cliente') {
          router.push('/cliente');
        } else {
          toast.error('Erro de autorização', 'Tipo de usuário não reconhecido');
        }
      } else {
        const errorText = await res.text();
        toast.error('Login falhou', errorText || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro de conexão', 'Não foi possível conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-login">
      <div className="login-box w-80 h-96 p-6 rounded-lg flex flex-col items-center justify-center shadow-lg">
        <h1 className="form-title text-2xl font-bold text-white mb-6">ZapChatBR</h1>

        <input
          type="email"
          placeholder="Email"
          className="input w-full mb-4 border-b-2 border-gray-500 bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="input w-full mb-4 border-b-2 border-gray-500 bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

<button
          onClick={handleLogin}
          disabled={loading}
          className="btn w-full py-2 font-semibold rounded-md transition duration-200 ease-in-out shadow disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading ? '#666' : 'linear-gradient(to right, #08132b, #1d042e)',
            color: '#fff',
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}