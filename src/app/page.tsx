"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Evolution Dashboard</h1>
      <button
        onClick={() => router.push("/login")}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Acessar Dashboard
      </button>
    </main>
  );
}
