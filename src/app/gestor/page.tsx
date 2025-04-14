'use client';

<<<<<<< HEAD
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Bars3Icon, XMarkIcon, CubeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ClientePage() {
  const [instancia, setInstancia] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const qrInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter(); 
=======
import { useCallback, useEffect, useState } from "react";
import { Cliente, EvolutionInstance } from "@/lib/types";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Importa os ícones do Heroicons


>>>>>>> d3957ff671db613f3ebf853c4e2fe1b818b7d018

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchStatus = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const instanciaId = payload.instanceId;

      const res = await fetch(`/api/evolution/minha?instanceId=${instanciaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setInstancia(data);
      } else {
        console.error('Erro ao buscar instância do cliente');
      }
    } catch (error) {
      console.error('Erro ao processar token ou buscar status:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const conectarInstancia = async () => {
    if (!instancia) return;
    setShowQRModal(true);
    fetchQRCode();

    qrInterval.current = setInterval(() => {
      fetchQRCode();
    }, 15000);

    try {
      const res = await fetch(
        `/api/evolution/instancias/connect/${instancia.name}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        alert('Erro ao conectar instância');
      }
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
    }
  };

  const fetchQRCode = async () => {
    if (!instancia) return;

    try {
      const res = await fetch(
        `/api/evolution/instancias/connect/${instancia.name}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data?.base64) {
          setQrcode(data.base64);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error);
    }
  };

  const desconectarInstancia = async () => {
    if (!instancia) return;

    try {
      const res = await fetch(
        `/api/evolution/instancias/logout/${instancia.name}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        await fetchStatus();
      } else {
        alert('Erro ao desconectar instância');
      }
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    router.push('/login'); 
  };

  const fecharModal = () => {
    setShowQRModal(false);
    setQrcode(null);
    if (qrInterval.current) clearInterval(qrInterval.current);
    fetchStatus();
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchStatus();
    return () => {
      if (qrInterval.current) clearInterval(qrInterval.current);
    };
  }, [fetchStatus]);
=======
    fetchClientes();
    fetchInstancias();
  }, [fetchClientes, fetchInstancias]);

  const handleSubmit = async () => {
    const method = editando ? "PUT" : "POST";
    const url = editando
      ? `/api/cliente/editar/${editando}`
      : "/api/cliente/criar";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ nome: "", email: "", senha: "", instanceId: "" });
      setEditando(null);
      await fetchClientes();
      await fetchInstancias();
    } else {
      alert("Erro ao salvar cliente");
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
    if (!confirm("Tem certeza que deseja deletar?")) return;

    await fetch(`/api/cliente/deletar/${id}?acao=delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchClientes();
    await fetchInstancias();
  };
>>>>>>> d3957ff671db613f3ebf853c4e2fe1b818b7d018

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-90 via-gray-900 to-black text-white">
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-black to-purple-900 text-white z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <div className="p-4">
          <button
            onClick={() => setIsSidebarOpen(false)} 
            className="p-2 bg-purple-700 text-white rounded-md focus:outline-none flex items-center mb-4"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-6">Cliente</h2>
          <ul className="space-y-4">
            <li className="flex items-center hover:bg-gray-800 p-2 rounded-md cursor-pointer">
              <CubeIcon className="h-5 w-5 mr-3" />
              Minha Instância
            </li>
          </ul>
        </div>
        <div className="p-4 mt-auto">
          <button
            onClick={logout} 
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center p-4 text-white">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 bg-purple-700 text-white rounded-md focus:outline-none flex items-center z-50"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center p-6">
          <h1 className="text-3xl font-bold mb-6 text-white">Painel do Cliente</h1>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Minha Instância</h1>

          {loading && (
            <p className="text-center text-gray-400 animate-pulse">Carregando...</p>
          )}

          {instancia && (
            <div className="card p-6 rounded-lg shadow-lg text-white">
              <div className="card-header flex flex-col items-start mb-4">
                <h2 className="text-2xl font-semibold">{instancia.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    instancia.connectionStatus === 'open'
                      ? 'bg-green-600 text-white'
                      : instancia.connectionStatus === 'qr'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {instancia.connectionStatus === 'open'
                    ? 'Conectado'
                    : instancia.connectionStatus === 'qr'
                    ? 'QR Code pendente'
                    : 'Desconectado'}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <p>
                  <strong>Número:</strong> {instancia.ownerJid || 'Não disponível'}
                </p>
                <p>
                  <strong>Nome no WhatsApp:</strong> {instancia.profileName || 'Não disponível'}
                </p>
                <p>
                  <strong>Mensagens:</strong> {instancia._count?.Message ?? 0}
                </p>
                <p>
                  <strong>Contatos:</strong> {instancia._count?.Contact ?? 0}
                </p>
              </div>

              <div className="btn-group flex flex-col gap-4">
                <button
                  onClick={fetchStatus}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition duration-200"
                >
                  Atualizar
                </button>

                {instancia.connectionStatus === 'open' ? (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-md transition duration-200"
                  >
                    Conectado
                  </button>
                ) : (
                  <button
                    onClick={conectarInstancia}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-md transition duration-200"
                  >
                    Conectar
                  </button>
                )}
              </div>
            </div>
          )}

{showQRModal && (
    <div className="modal">
        <div className="modal-box">
            <h2 className="modal-title">
                Escaneie o QR Code abaixo
            </h2>

            {qrcode ? (
                <Image
                    src={qrcode}
                    alt="QR Code"
                    width={250}
                    height={250}
                    className="qr-image"
                />
            ) : (
                <p className="loading-text">Aguardando QR Code...</p>
            )}

            <button
                onClick={fecharModal}
                className="close-btn"
            >
                Fechar
            </button>
        </div>
    </div>
)}
        </div>
      </div>
    </div>
  );
}