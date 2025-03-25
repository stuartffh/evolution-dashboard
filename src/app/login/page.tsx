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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-white px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Entrar no Painel</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-6 px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-md"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
