"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon, CubeIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface ResponsiveSidebarProps {
  children: ReactNode;
  role: "gestor" | "cliente";
}

export default function ResponsiveSidebar({ children, role }: ResponsiveSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const linksGestor = [
    { label: "Dashboard", path: "/gestor", icon: HomeIcon },
    { label: "Instâncias", path: "/gestor/instancias", icon: CubeIcon },
  ];

  const linksCliente = [
    { label: "Minha Instância", path: "/cliente", icon: CubeIcon }
  ];

  const links = role === "gestor" ? linksGestor : linksCliente;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-black/80 border-r border-white/10 p-6 flex-col justify-between">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ZapChatBR
            </h2>
            <p className="text-sm text-gray-400 text-center mt-1">
              {role === "gestor" ? "Painel Gestor" : "Painel Cliente"}
            </p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => router.push(link.path)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-purple-900/50 ${
                    pathname === link.path 
                      ? "bg-purple-800 shadow-lg shadow-purple-800/20" 
                      : "hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25"
        >
          Sair
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleMobileMenu}
            className="p-2 bg-purple-700/80 text-white rounded-lg transition-all hover:bg-purple-600"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ZapChatBR
          </h1>
          
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="fixed left-0 top-0 h-full w-[280px] bg-black border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300">
            <div className="pt-16">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-center text-white">
                  {role === "gestor" ? "Painel Gestor" : "Painel Cliente"}
                </h2>
              </div>

              <nav className="space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleNavigation(link.path)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        pathname === link.path 
                          ? "bg-purple-800 shadow-lg" 
                          : "hover:bg-white/10"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium"
            >
              Sair
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${isMobileMenuOpen ? 'lg:ml-0' : ''} transition-all duration-300`}>
        <div className="lg:p-6 p-4 pt-20 lg:pt-6 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}