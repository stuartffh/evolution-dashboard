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
    { label: "Instâncias", path: "/gestor/instancias" },
  ];

  const linksCliente = [
    { label: "Minha Instância", path: "/cliente" }
  ];

  const links = role === "gestor" ? linksGestor : linksCliente;

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <aside className="sidebar w-[250px] bg-black/80 border-r border-white/10 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6 text-center">
            {role === "gestor" ? "Painel Gestor" : "Painel Cliente"}
          </h2>

          <ul className="space-y-2">
            {links.map((link) => (
              <li
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`cursor-pointer p-2 rounded-md transition-all hover:bg-purple-900 ${
                  pathname === link.path ? "bg-purple-800 font-semibold" : ""
                }`}
              >
                {link.label}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={logout}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
