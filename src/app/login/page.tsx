'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.token;

      if (!token) {
        alert('Token não retornado pela API');
        return;
      }

      localStorage.setItem('token', token);

      let payload;
      try {
        payload = JSON.parse(atob(token.split('.')[1]));
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        alert('Token inválido');
        return;
      }

      if (payload.tipo === 'gestor') {
        router.push('/gestor');
      } else if (payload.tipo === 'cliente') {
        router.push('/cliente');
      } else {
        alert('Tipo de usuário desconhecido');
      }
    } else {
      alert('Credenciais inválidas');
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
          className="btn w-full py-2 font-semibold rounded-md transition duration-200 ease-in-out shadow"
          style={{
            background: 'linear-gradient(to right, #08132b, #1d042e)',
            color: '#fff',
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}