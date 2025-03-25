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
    setShowQRModal(true); // Mostra modal
    fetchQRCode(); // Primeira chamada

    // Atualiza o QR code a cada 15s
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
    fetchStatus(); // Atualiza status ao fechar
  };

  useEffect(() => {
    fetchStatus();
    return () => {
      if (qrInterval.current) clearInterval(qrInterval.current);
    };
  }, [fetchStatus]);

  return (
    <Sidebar role="cliente">
      <div className="max-w-xl mx-auto py-8 relative">
        <h1 className="text-2xl font-bold mb-6">Minha Instância</h1>

        {loading && <p className="text-gray-400">Carregando...</p>}

        {instancia && (
          <div className="bg-white/10 p-6 rounded space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{instancia.name}</h2>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  instancia.connectionStatus === 'open'
                    ? 'bg-green-700'
                    : instancia.connectionStatus === 'qr'
                    ? 'bg-yellow-600'
                    : 'bg-red-700'
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

            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={fetchStatus}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                Atualizar
              </button>

              {instancia.connectionStatus === 'open' && (
                <button
                  onClick={desconectarInstancia}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Desconectar
                </button>
              )}

              {!['open', 'qr'].includes(instancia.connectionStatus) && (
                <button
                  onClick={conectarInstancia}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  Conectar
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODAL QR CODE */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg text-center relative">
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
                <p className="text-sm text-gray-400">Aguardando QR Code...</p>
              )}

              <button
                onClick={fecharModal}
                className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
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
