'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useToastContext } from '@/components/ToastProvider';
import { PageContainer, Card } from '@/components/ui/Layout';
import { Form, FormField, EmailInput, PasswordInput, FormActions } from '@/components/ui/Form';
import { PrimaryButton } from '@/components/ui/Button';

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
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ZapChatBR
            </h1>
            <p className="mt-3 text-gray-400 text-sm sm:text-base">
              Faça login para acessar o painel
            </p>
          </div>

          {/* Login Card */}
          <Card variant="glass" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur opacity-60"></div>
            <div className="relative">
              <Form onSubmit={handleLogin}>
                <FormField label="Email" required>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <EmailInput
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Digite seu email"
                    />
                  </div>
                </FormField>

                <FormField label="Senha" required>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <PasswordInput
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="pl-10"
                      placeholder="Digite sua senha"
                    />
                  </div>
                </FormField>

                <FormActions>
                  <PrimaryButton
                    type="button"
                    onClick={handleLogin}
                    loading={loading}
                    loadingText="Entrando..."
                    icon={<ArrowRightIcon className="h-4 w-4" />}
                    fullWidth
                    size="lg"
                  >
                    Entrar
                  </PrimaryButton>
                </FormActions>
              </Form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 text-center mb-2">Credenciais de teste:</p>
                <div className="text-xs text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Admin:</span>
                    <span className="text-purple-400">admin / admin123</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}