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
  <div className="login-box">
    <h1 className="form-title">Entrar no Painel</h1>

    <input
      type="email"
      placeholder="Email"
      className="input"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Senha"
      className="input"
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
    />

    <button onClick={handleLogin} className="btn w-full">
      Entrar
    </button>
  </div>
</div>

  );
}
