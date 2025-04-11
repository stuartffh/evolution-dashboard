'use client';

import { useCallback, useEffect, useState } from "react";
import { Cliente, EvolutionInstance } from "@/lib/types";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Importa os ícones do Heroicons
import path from "path";
import type { fill, stroke } from "pdfkit";

export default function GestorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [instancias, setInstancias] = useState<EvolutionInstance[]>([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    instanceId: "",
  });
  const [editando, setEditando] = useState<string | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;


  const fetchClientes = useCallback(async () => {
    try {
      const res = await fetch("/api/cliente/listar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return setClientes([]);
      const data = await res.json();

      if (Array.isArray(data)) {
        setClientes(data);
      } else {
        setClientes([]);
      }
    } catch {
      setClientes([]);
    }
  }, [token]);

  const fetchInstancias = useCallback(async () => {
    try {
      const res = await fetch("/api/cliente/instancias-disponiveis", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return setInstancias([]);
      const data = await res.json();

      if (Array.isArray(data)) {
        setInstancias(data);
      } else {
        setInstancias([]);
      }
    } catch {
      setInstancias([]);
    }
  }, [token]);

  useEffect(() => {
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

    await fetch(`/api/cliente/deletar/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchClientes();
    await fetchInstancias();
  };

  return (
    <div
      className="flex min-h-screen relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at top,rgb(32, 8, 66) 15%, transparent 40%), radial-gradient(circle at bottom,rgb(9, 22, 59) 15%, transparent 40%)",
        backgroundColor: "#000000",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >

      <div className="flex min-h-screen bg-gradient-to-b from-purple-90 via-gray-900 to-black text-white">
        <div
          className={`fixed top-0 left-0 h-full bg-gradient-to-b from-black to-purple-900 text-white z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col ">
              <div className="p-3">
                <h2 className="text-2xl font-bold mb-6">Gestor</h2>
                <ul className="space-y-4">
                  <li className="flex items-center hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                    <span className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h11M9 21V3m0 0l-6 6m6-6l6 6"
                        />
                      </svg>
                    </span>
                    Dashboard
                  </li>
                  <li className="flex items-center hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                    <span className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 17l-4 4m0 0l-4-4m4 4V3"
                        />
                      </svg>
                    </span>
                    Clientes
                  </li>
                  <li className="flex items-center hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                    <span className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M4 6h16M4 10h16m-7 4h7"
                        />
                      </svg>
                    </span>
                    Configurações
                  </li>
                </ul>
              </div>

              <div className="p-4 mt-auto">
                <button
                  onClick={() => {
                    alert("Você saiu!");
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7"
                    />
                  </svg>
                  Sair
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 ml-2 bg-black text-white rounded-md focus:outline-none flex items-center"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        <div className="page-container">
          <h1 className="page-title">Painel do Gestor</h1>

          <div className="card mb-10">
            <h2 className="form-title">
              {editando ? "Editar Cliente" : "Novo Cliente"}
            </h2>

            <div className="grid gap-4">
              <input
                className="input"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              <input
                className="input"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="password"
                className="input"
                placeholder="Senha"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
              />
              <select
                className="input"
                value={form.instanceId}
                onChange={(e) => setForm({ ...form, instanceId: e.target.value })}
              >
                <option value="">Selecione uma instância</option>
                {Array.isArray(instancias) &&
                  instancias.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
              </select>

              <button onClick={handleSubmit} className="btn">
                {editando ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </div>

          <h2 className="form-title text-lg md:text-xl">Clientes Cadastrados</h2>
          <div className="overflow-x-auto">
            <table className="table text-sm md:text-base w-full">
              <thead>
                <tr>
                  <th className="px-2 py-1">Nome</th>
                  <th className="px-2 py-1">Email</th>
                  <th className="px-2 py-1">Instância</th>
                  <th className="px-2 py-1">Ações</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(clientes) && clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-2 py-1">{cliente.nome}</td>
                      <td className="px-2 py-1">{cliente.email}</td>
                      <td className="px-2 py-1">{cliente.instanceId}</td>
                      <td className="space-x-2 px-2 py-1">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="bg-yellow-500 px-2 py-1 rounded text-xs md:text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="bg-red-600 px-2 py-1 rounded text-xs md:text-sm"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-2 text-center text-white/60">
                      Nenhum cliente cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}