'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import Sidebar from '@/components/Sidebar';
import { useToastContext } from '@/components/ToastProvider';
import { LoadingButton, LoadingCard } from '@/components/Loading';
import { EvolutionInstance } from '@/lib/types';

const ITEMS_PER_PAGE = 4;

export default function GestorInstancias() {
  const [instancias, setInstancias] = useState<EvolutionInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [criandoInstancia, setCriandoInstancia] = useState(false);
  const toast = useToastContext();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchInstancias = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/evolution/instancias', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Erro ao buscar instâncias:', res.status, err);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setInstancias(data);
    setLoading(false);
  }, [token]);

  const criarInstancia = async (e: FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) {
      toast.warning('Campo obrigatório', 'Por favor, insira um nome para a instância');
      return;
    }

    setCriandoInstancia(true);

    try {
      const res = await fetch('/api/evolution/instancias/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ instanceName: novoNome })
      });

      if (res.ok) {
        setNovoNome('');
        await fetchInstancias();
        toast.success('Instância criada', 'A instância foi criada com sucesso');
      } else {
        const errorText = await res.text();
        toast.error('Erro ao criar instância', errorText || 'Tente novamente em alguns instantes');
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast.error('Erro de conexão', 'Não foi possível conectar com o servidor');
    } finally {
      setCriandoInstancia(false);
    }
  };

  const acao = async (tipo: 'connect' | 'logout' | 'delete', id: string) => {
    const confirmar = tipo === 'delete' ? confirm('Deseja deletar esta instância?') : true;
    if (!confirmar) return;

    const url = `/api/evolution/instancias?id=${id}&acao=${tipo}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      await fetchInstancias();
      const successMessages = {
        'connect': 'Instância conectada com sucesso',
        'logout': 'Instância desconectada com sucesso', 
        'delete': 'Instância deletada com sucesso'
      };
      toast.success('Operação realizada', successMessages[tipo]);
    } else {
      const errorText = await res.text();
      toast.error('Erro na operação', errorText || 'Tente novamente em alguns instantes');
    }
  };

  useEffect(() => {
    fetchInstancias();
  }, [fetchInstancias]);

  const totalPages = Math.ceil(instancias.length / ITEMS_PER_PAGE);
  const instanciasPaginadas = instancias.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  return (
    <Sidebar role="gestor">
      <div className="page-container max-w-5xl">
        <h1 className="page-title">Gerenciar Instâncias</h1>

        <form onSubmit={criarInstancia} className="form-row mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Nome da nova instância"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className="input w-full"
          />
          <LoadingButton 
            type="submit" 
            isLoading={criandoInstancia}
            loadingText="Criando..."
            className="btn bg-purple-600 hover:bg-purple-700 text-sm"
          >
            Criar
          </LoadingButton>
        </form>

        <LoadingCard 
          isLoading={loading} 
          loadingMessage="Carregando instâncias..."
          className="grid md:grid-cols-2 gap-4"
        >
          {instanciasPaginadas.map((inst) => (
            <div key={inst.id} className="card space-y-2">
              <div className="card-header">
                <h2 className="text-base font-semibold">{inst.name}</h2>
                <span
                  className={`status ${
                    inst.connectionStatus === 'open'
                      ? 'status-open'
                      : inst.connectionStatus === 'qr'
                      ? 'status-qr'
                      : 'status-disconnected'
                  } text-xs`}
                >
                  {inst.connectionStatus === 'open'
                    ? 'Conectado'
                    : inst.connectionStatus === 'qr'
                    ? 'QR Code'
                    : 'Desconectado'}
                </span>
              </div>

              <p className="text-sm"><strong>ID:</strong> {inst.id}</p>
              {inst.number && <p className="text-sm"><strong>Número:</strong> {inst.number}</p>}
              {inst._count && (
                <>
                  <p className="text-sm"><strong>Mensagens:</strong> {inst._count.Message ?? 0}</p>
                  <p className="text-sm"><strong>Contatos:</strong> {inst._count.Contact ?? 0}</p>
                </>
              )}

              <div className="btn-group flex-wrap mt-2 gap-1">
                {inst.connectionStatus !== 'open' && (
                  <button
                    className="btn bg-green-600 hover:bg-green-700 text-xs"
                    onClick={() => acao('connect', inst.name)}
                  >
                    Conectar
                  </button>
                )}
                <button
                  className="btn bg-red-600 hover:bg-red-700 text-xs"
                  onClick={() => acao('logout', inst.name)}
                >
                  Desconectar
                </button>
                <button
                  className="btn bg-blue-600 hover:bg-blue-700 text-xs"
                  onClick={fetchInstancias}
                >
                  Atualizar
                </button>
                <button
                  className="btn bg-white/10 hover:bg-red-900 text-xs"
                  onClick={() => acao('delete', inst.name)}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </LoadingCard>

        {totalPages > 1 && (
          <div className="pagination mt-6 flex gap-2 justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 text-sm rounded transition ${
                  paginaAtual === i + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={() => setPaginaAtual(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
