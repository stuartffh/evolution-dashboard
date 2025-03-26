'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { EvolutionInstance } from '@/lib/types';
import Image from 'next/image';

export default function ClientePage() {
  const [instancia, setInstancia] = useState<EvolutionInstance | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrcode, setQrcode] = useState<string | null>(null);
  const qrInterval = useRef<NodeJS.Timeout | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchStatus = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    const payload = JSON.parse(atob(token.split('.')[1]));
    const instanciaId = payload.instanceId;

    const res = await fetch(`/api/evolution/minha?instanceId=${instanciaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setInstancia(data);
    } else {
      console.error('Erro ao buscar instância do cliente');
    }

    setLoading(false);
  }, [token]);

  const conectarInstancia = async () => {
    if (!instancia) return;
    setShowQRModal(true);
    fetchQRCode();

    qrInterval.current = setInterval(() => {
      fetchQRCode();
    }, 15000);

    const res = await fetch(`/api/evolution/instancias/connect/${instancia.name}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      alert('Erro ao conectar instância');
    }
  };

  const fetchQRCode = async () => {
    if (!instancia) return;

    const res = await fetch(`/api/evolution/instancias/connect/${instancia.name}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.base64) {
        setQrcode(data.base64);
      }
    }
  };

  const desconectarInstancia = async () => {
    if (!instancia) return;
    const res = await fetch(`/api/evolution/instancias/logout/${instancia.name}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      await fetchStatus();
    } else {
      alert('Erro ao desconectar instância');
    }
  };

  const fecharModal = () => {
    setShowQRModal(false);
    setQrcode(null);
    if (qrInterval.current) clearInterval(qrInterval.current);
    fetchStatus();
  };

  useEffect(() => {
    fetchStatus();
    return () => {
      if (qrInterval.current) clearInterval(qrInterval.current);
    };
  }, [fetchStatus]);

  return (
    <Sidebar role="cliente">
      <div className="page-container max-w-xl">
        <h1 className="page-title">Minha Instância</h1>

        {loading && <p className="text-muted">Carregando...</p>}

        {instancia && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{instancia.name}</h2>
              <span
                className={`status ${
                  instancia.connectionStatus === 'open'
                    ? 'status-open'
                    : instancia.connectionStatus === 'qr'
                    ? 'status-qr'
                    : 'status-disconnected'
                }`}
              >
                {instancia.connectionStatus === 'open'
                  ? 'Conectado'
                  : instancia.connectionStatus === 'qr'
                  ? 'QR Code pendente'
                  : 'Desconectado'}
              </span>
            </div>

            <p><strong>Número:</strong> {instancia.ownerJid || 'Não disponível'}</p>
            <p><strong>Nome no WhatsApp:</strong> {instancia.profileName || 'Não disponível'}</p>
            <p><strong>Mensagens:</strong> {instancia._count?.Message ?? 0}</p>
            <p><strong>Contatos:</strong> {instancia._count?.Contact ?? 0}</p>

            <div className="btn-group grid grid-cols-4 gap-4">
              <button onClick={fetchStatus} className="btn">
                Atualizar
              </button>

              {instancia.connectionStatus === 'open' && (
                <button onClick={desconectarInstancia} className="btn bg-red-600 hover:bg-red-700">
                  Desconectar
                </button>
              )}

              {!['open', 'qr'].includes(instancia.connectionStatus) && (
                <button onClick={conectarInstancia} className="btn bg-green-600 hover:bg-green-700">
                  Conectar
                </button>
              )}
            </div>
          </div>
        )}

        {showQRModal && (
          <div className="modal">
            <div className="modal-box">
              <h2 className="text-lg font-bold mb-4">Escaneie o QR Code abaixo</h2>

              {qrcode ? (
                <Image
                  src={qrcode}
                  alt="QR Code"
                  width={250}
                  height={250}
                  className="mx-auto border border-white/20 rounded"
                />
              ) : (
                <p className="text-muted">Aguardando QR Code...</p>
              )}

              <button
                onClick={fecharModal}
                className="btn bg-red-600 hover:bg-red-700 mt-4"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
