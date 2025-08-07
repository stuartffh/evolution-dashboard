'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  CubeIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useToastContext } from '@/components/ToastProvider';
import { LoadingButton, LoadingSpinner } from '@/components/Loading';
import { Cliente, EvolutionInstance } from '@/lib/types';

export default function GestorDashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [instancias, setInstancias] = useState<EvolutionInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', instanceId: '' });
  const [editando, setEditando] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useToastContext();
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

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
        setShowForm(false);
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
    setShowForm(true);
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

  const handleCancelForm = () => {
    setForm({ nome: '', email: '', senha: '', instanceId: '' });
    setEditando(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchClientes();
    fetchInstancias();
  }, [fetchClientes, fetchInstancias]);

  const instanciasDisponiveis = instancias.filter(inst => 
    !clientes.some(cliente => cliente.instanceId === inst.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ZapChatBR
              </h1>
              <span className="ml-3 text-gray-400">Painel Gestor</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total de Clientes</p>
                <p className="text-2xl font-bold text-white">{clientes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <CubeIcon className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Instâncias Totais</p>
                <p className="text-2xl font-bold text-white">{instancias.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Disponíveis</p>
                <p className="text-2xl font-bold text-white">{instanciasDisponiveis.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <PlusIcon className="h-5 w-5" />
            Novo Cliente
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {editando ? 'Editar Cliente' : 'Criar Novo Cliente'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="Digite a senha"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instância
                </label>
                <select
                  value={form.instanceId}
                  onChange={(e) => setForm({ ...form, instanceId: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Selecione uma instância</option>
                  {editando ? (
                    // Quando editando, mostra todas as instâncias (incluindo a atual do cliente)
                    instancias.map((inst) => (
                      <option key={inst.id} value={inst.id} className="bg-slate-800">
                        {inst.name}
                      </option>
                    ))
                  ) : (
                    // Quando criando, mostra apenas disponíveis
                    instanciasDisponiveis.map((inst) => (
                      <option key={inst.id} value={inst.id} className="bg-slate-800">
                        {inst.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <LoadingButton
                onClick={handleSubmit}
                isLoading={saving}
                loadingText={editando ? 'Atualizando...' : 'Criando...'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                {editando ? 'Atualizar Cliente' : 'Criar Cliente'}
              </LoadingButton>

              <button
                onClick={handleCancelForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Clientes Table */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Clientes Cadastrados</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-400">Carregando clientes...</span>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Nenhum cliente cadastrado</p>
              <p className="text-gray-500 text-sm">Clique em "Novo Cliente" para começar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Nome</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Instância</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-300">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clientes.map((cliente) => {
                    const instancia = instancias.find(inst => inst.id === cliente.instanceId);
                    return (
                      <tr key={cliente.id} className="hover:bg-white/5 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {cliente.nome.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-white font-medium">{cliente.nome}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{cliente.email}</td>
                        <td className="px-6 py-4">
                          <span className="text-blue-400 font-medium">
                            {instancia?.name || cliente.instanceId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Ativo
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(cliente)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                              title="Editar cliente"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cliente.id)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                              title="Deletar cliente"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}