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
  <aside className="sidebar">
    <h2 className="sidebar-title">
      {role === "gestor" ? "Painel Gestor" : "Painel Cliente"}
    </h2>

    <ul className="sidebar-links">
      {links.map((link) => (
        <li
          key={link.path}
          onClick={() => router.push(link.path)}
          className={`sidebar-link ${pathname === link.path ? "active" : ""}`}
        >
          {link.label}
        </li>
      ))}
    </ul>

    <button onClick={logout} className="btn btn-logout">
      Sair
    </button>
  </aside>

  <main className="main-content">
    {children}
  </main>
</div>
  );
}
