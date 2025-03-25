"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  role: "gestor" | "cliente";
}

export default function Sidebar({ children, role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const linksGestor = [
    { label: "Dashboard", path: "/gestor" },
    { label: "Instâncias", path: "/gestor/instancias" }, // caminho novo
  ];

  const linksCliente = [{ label: "Minha Instância", path: "/cliente" }];

  const links = role === "gestor" ? linksGestor : linksCliente;

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-zinc-900 text-white p-6 space-y-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {role === "gestor" ? "Painel Gestor" : "Painel Cliente"}
        </h2>
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.path}
              onClick={() => router.push(link.path)}
              className={`cursor-pointer px-4 py-2 rounded-md transition ${
                pathname === link.path ? "bg-blue-600" : "hover:bg-zinc-700"
              }`}
            >
              {link.label}
            </li>
          ))}
        </ul>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-600 hover:bg-red-700 py-2 rounded-md text-sm"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 bg-zinc-950 text-white p-10 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
