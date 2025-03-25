import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtecaoCliente from "@/components/ProtecaoCliente";

export const metadata: Metadata = {
  title: "Painel Evolution",
  description: "Administre instâncias e clientes com estilo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ProtecaoCliente />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
