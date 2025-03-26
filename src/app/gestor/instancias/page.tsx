'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import Sidebar from '@/components/Sidebar';
import { EvolutionInstance } from '@/lib/types';

const ITEMS_PER_PAGE = 4;

export default function GestorInstancias() {
  const [instancias, setInstancias] = useState<EvolutionInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

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
    if (!novoNome.trim()) return;

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
    } else {
      alert('Erro ao criar instância');
    }
  };

  const acao = async (tipo: 'connect' | 'logout' | 'delete', id: string) => {
    const confirmar = tipo === 'delete' ? confirm('Deseja deletar esta instância?') : true;
    if (!confirmar) return;

    const method = tipo === 'delete' ? 'DELETE' : 'GET';
    const res = await fetch(`/api/evolution/instancias/${tipo}/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) await fetchInstancias();
    else alert('Erro na operação');
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

        <form onSubmit={criarInstancia} className="form-row mb-6">
          <input
            type="text"
            placeholder="Nome da nova instância"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className="input w-full"
          />
          <button type="submit" className="btn bg-purple-600 hover:bg-purple-700 text-sm">
            Criar
          </button>
        </form>

        {loading && <p className="text-muted mb-4">Carregando instâncias...</p>}

        <div className="grid md:grid-cols-2 gap-4">
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
                  {inst.connectionStatus}
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
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 text-sm rounded ${
                  paginaAtual === i + 1
                    ? 'bg-purple-600'
                    : 'bg-white/10 hover:bg-white/20'
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
