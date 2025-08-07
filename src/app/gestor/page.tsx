'use client';

import { useCallback, useEffect, useState } from 'react';
import ResponsiveSidebar from '@/components/ResponsiveSidebar';
import PageLayout from '@/components/PageLayout';
import ResponsiveCard from '@/components/ResponsiveCard';
import { useToastContext } from '@/components/ToastProvider';
import { LoadingButton, LoadingCard } from '@/components/Loading';
import { Cliente, EvolutionInstance } from '@/lib/types';

export default function GestorDashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [instancias, setInstancias] = useState<EvolutionInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', instanceId: '' });
  const [editando, setEditando] = useState<string | null>(null);
  const toast = useToastContext();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchClientes = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch('/api/cliente/listar', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      } else {
        console.error('Erro ao buscar clientes');
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchInstancias = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch('/api/cliente/instancias-disponiveis', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setInstancias(data);
      }
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.senha || !form.instanceId) {
      toast.warning('Campos obrigatórios', 'Por favor, preencha todos os campos');
      return;
    }

    setSaving(true);

    const method = editando ? 'PUT' : 'POST';
    const url = editando
      ? `/api/cliente/editar/${editando}`
      : '/api/cliente/criar';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ nome: '', email: '', senha: '', instanceId: '' });
        setEditando(null);
        await fetchClientes();
        await fetchInstancias();
        toast.success(
          editando ? 'Cliente atualizado!' : 'Cliente criado!',
          'As informações foram salvas com sucesso'
        );
      } else {
        const errorText = await res.text();
        toast.error('Erro ao salvar cliente', errorText || 'Tente novamente em alguns instantes');
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro de conexão', 'Não foi possível conectar com o servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setForm({
      nome: cliente.nome,
      email: cliente.email,
      senha: cliente.senha,
      instanceId: cliente.instanceId,
    });
    setEditando(cliente.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      const res = await fetch(`/api/cliente/deletar/${id}?acao=delete`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await fetchClientes();
        await fetchInstancias();
        toast.success('Cliente deletado', 'O cliente foi removido com sucesso');
      } else {
        const errorText = await res.text();
        toast.error('Erro ao deletar cliente', errorText || 'Tente novamente em alguns instantes');
      }
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast.error('Erro de conexão', 'Não foi possível conectar com o servidor');
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchInstancias();
  }, [fetchClientes, fetchInstancias]);

  return (
    <ResponsiveSidebar role="gestor">
      <PageLayout 
        title="Painel do Gestor"
        subtitle="Gerencie clientes e instâncias da Evolution API"
      >
        {/* Formulário para criar/editar cliente */}
        <ResponsiveCard 
          title={editando ? 'Editar Cliente' : 'Criar Novo Cliente'}
          className="mb-6"
        >
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome do cliente"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="input"
            />
            
            <input
              type="email"
              placeholder="Email do cliente"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
            />
            
            <input
              type="password"
              placeholder="Senha do cliente"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              className="input"
            />
            
            <select
              value={form.instanceId}
              onChange={(e) => setForm({ ...form, instanceId: e.target.value })}
              className="input"
            >
              <option value="">Selecione uma instância</option>
              {instancias.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4">
            <LoadingButton
              onClick={handleSubmit}
              isLoading={saving}
              loadingText={editando ? 'Atualizando...' : 'Criando...'}
              className="btn bg-purple-600 hover:bg-purple-700"
            >
              {editando ? 'Atualizar' : 'Criar'} Cliente
            </LoadingButton>
            
            {editando && (
              <button
                onClick={() => {
                  setEditando(null);
                  setForm({ nome: '', email: '', senha: '', instanceId: '' });
                }}
                className="btn bg-gray-600 hover:bg-gray-700"
              >
                Cancelar
              </button>
            )}
          </div>
        </ResponsiveCard>

        {/* Lista de clientes */}
        <LoadingCard 
          isLoading={loading} 
          loadingMessage="Carregando clientes..."
          className="card"
        >
          <h2 className="text-xl font-bold mb-4">Clientes Cadastrados</h2>
          
          {clientes.length === 0 && !loading ? (
            <p className="text-center text-gray-400">Nenhum cliente cadastrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3">Nome</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Instância</th>
                    <th className="text-left p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b border-white/5">
                      <td className="p-3">{cliente.nome}</td>
                      <td className="p-3">{cliente.email}</td>
                      <td className="p-3">{cliente.instanceId}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cliente)}
                            className="btn bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id)}
                            className="btn bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </LoadingCard>
      </PageLayout>
    </ResponsiveSidebar>
  );
}