"use client";

import { useEffect } from "react";

export default function ProtecaoCliente() {
  useEffect(() => {
    const bloquearAtalhos = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        alert("Inspeção bloqueada.");
      }
    };

    const detectarDevTools = () => {
      const inicio = new Date().getTime();
      debugger;
      const fim = new Date().getTime();
      if (fim - inicio > 100) {
        document.body.innerHTML = `
          <div style="font-size:24px;text-align:center;margin-top:20%;color:red;">
            🚫 Inspeção detectada<br/>Acesso bloqueado.
          </div>`;
      }
    };

    window.addEventListener("keydown", bloquearAtalhos);
    const intervalo = setInterval(detectarDevTools, 2000);

    return () => {
      window.removeEventListener("keydown", bloquearAtalhos);
      clearInterval(intervalo);
    };
  }, []);

  return null;
}
