"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
<main className="page-home">
  <h1 className="page-title">ZapChatBR</h1>
  <button onClick={() => router.push("/login")} className="btn">
    Acessar Dashboard
  </button>
</main>
  );
}
