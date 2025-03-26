'use client';

import { useCallback, useEffect, useState } from "react";
import { Cliente, EvolutionInstance } from "@/lib/types";
import Sidebar from "@/components/Sidebar";

export default function GestorPage() {
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
    <Sidebar role="gestor">
      <div className="page-container max-w-4xl">
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

            <button
              onClick={handleSubmit}
              className="btn"
            >
              {editando ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>

        <h2 className="form-title">Clientes Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Instância</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(clientes) && clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.instanceId}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="bg-yellow-500 px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="bg-red-600 px-3 py-1 rounded text-sm"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-white/60">
                    Nenhum cliente cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}
