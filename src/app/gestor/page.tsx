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
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useToastContext } from '@/components/ToastProvider';
import { Cliente, EvolutionInstance } from '@/lib/types';

// UI Components
import { 
  PageContainer, 
  ContentContainer, 
  Card, 
  GridCols3,
  NavHeader,
  PageHeader,
  Stack
} from '@/components/ui/Layout';
import { 
  Form, 
  FormField, 
  FormGrid, 
  FormActions,
  TextInput,
  EmailInput,
  PasswordInput,
  Select,
  Option
} from '@/components/ui/Form';
import { 
  PrimaryButton, 
  SecondaryButton, 
  DangerButton,
  ButtonGroup 
} from '@/components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCellAvatar,
  TableCell,
  TableCellBadge,
  TableCellActions,
  TableEmptyState,
  TableLoadingState,
  ActionButton
} from '@/components/ui/Table';

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
    <PageContainer>
      {/* Navigation Header */}
      <NavHeader 
        brand="ZapChatBR" 
        subtitle="Painel Gestor"
        actions={
          <DangerButton
            onClick={logout}
            icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
            size="sm"
          >
            Sair
          </DangerButton>
        }
      />

      <ContentContainer>
        <Stack>
          {/* Page Header */}
          <PageHeader 
            title="Dashboard Gestor"
            subtitle="Gerencie clientes e instâncias da Evolution API"
            actions={
              <PrimaryButton
                onClick={() => setShowForm(!showForm)}
                icon={<PlusIcon className="h-5 w-5" />}
              >
                Novo Cliente
              </PrimaryButton>
            }
          />

          {/* Stats Cards */}
          <GridCols3>
            <Card>
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total de Clientes</p>
                  <p className="text-2xl font-bold text-white">{clientes.length}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <CubeIcon className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Instâncias Totais</p>
                  <p className="text-2xl font-bold text-white">{instancias.length}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Disponíveis</p>
                  <p className="text-2xl font-bold text-white">{instanciasDisponiveis.length}</p>
                </div>
              </div>
            </Card>
          </GridCols3>

          {/* Form Modal */}
          {showForm && (
            <Card variant="dark">
              <Form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-white mb-6">
                  {editando ? 'Editar Cliente' : 'Criar Novo Cliente'}
                </h2>
                
                <FormGrid>
                  <FormField label="Nome do Cliente" required>
                    <TextInput
                      placeholder="Digite o nome"
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />
                  </FormField>

                  <FormField label="Email" required>
                    <EmailInput
                      placeholder="cliente@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </FormField>

                  <FormField label="Senha" required>
                    <PasswordInput
                      placeholder="Digite a senha"
                      value={form.senha}
                      onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    />
                  </FormField>

                  <FormField label="Instância" required>
                    <Select
                      value={form.instanceId}
                      onChange={(e) => setForm({ ...form, instanceId: e.target.value })}
                    >
                      <Option value="">Selecione uma instância</Option>
                      {editando ? (
                        // Quando editando, mostra todas as instâncias (incluindo a atual do cliente)
                        instancias.map((inst) => (
                          <Option key={inst.id} value={inst.id}>
                            {inst.name}
                          </Option>
                        ))
                      ) : (
                        // Quando criando, mostra apenas disponíveis
                        instanciasDisponiveis.map((inst) => (
                          <Option key={inst.id} value={inst.id}>
                            {inst.name}
                          </Option>
                        ))
                      )}
                    </Select>
                  </FormField>
                </FormGrid>

                <FormActions>
                  <ButtonGroup>
                    <PrimaryButton
                      type="button"
                      onClick={handleSubmit}
                      loading={saving}
                      loadingText={editando ? 'Atualizando...' : 'Criando...'}
                    >
                      {editando ? 'Atualizar Cliente' : 'Criar Cliente'}
                    </PrimaryButton>

                    <SecondaryButton onClick={handleCancelForm}>
                      Cancelar
                    </SecondaryButton>
                  </ButtonGroup>
                </FormActions>
              </Form>
            </Card>
          )}

          {/* Clientes Table */}
          <Card>
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Clientes Cadastrados</h2>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Cliente</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Instância</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {loading ? (
                  <TableLoadingState colSpan={5} />
                ) : clientes.length === 0 ? (
                  <TableEmptyState
                    colSpan={5}
                    icon={<UserGroupIcon className="h-12 w-12" />}
                    title="Nenhum cliente cadastrado"
                    description="Clique em 'Novo Cliente' para começar"
                  />
                ) : (
                  clientes.map((cliente) => {
                    const instancia = instancias.find(inst => inst.id === cliente.instanceId);
                    return (
                      <TableRow key={cliente.id}>
                        <TableCellAvatar
                          name={cliente.nome}
                          subtitle={`ID: ${cliente.id.substring(0, 8)}...`}
                        />
                        
                        <TableCell>{cliente.email}</TableCell>
                        
                        <TableCell>
                          <span className="text-blue-400 font-medium">
                            {instancia?.name || cliente.instanceId}
                          </span>
                        </TableCell>
                        
                        <TableCellBadge
                          text="Ativo"
                          variant="success"
                          icon={<CheckCircleIcon className="h-3 w-3" />}
                        />
                        
                        <TableCellActions>
                          <ActionButton
                            onClick={() => handleEdit(cliente)}
                            icon={<PencilIcon />}
                            variant="primary"
                            title="Editar cliente"
                          />
                          <ActionButton
                            onClick={() => handleDelete(cliente.id)}
                            icon={<TrashIcon />}
                            variant="danger"
                            title="Deletar cliente"
                          />
                        </TableCellActions>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}