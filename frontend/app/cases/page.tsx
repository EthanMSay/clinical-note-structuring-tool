"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const router = useRouter();

  const loadCases = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`)
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCases();

    const handleFocus = () => {
      loadCases();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Saved Cases</h1>

      <button
        onClick={() => router.push("/")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Back to Generator
      </button>

      {cases.length === 0 && (
        <p className="text-gray-500">No saved cases yet.</p>
      )}

      {cases.map((c) => (
        <div
          key={c.id}
          className="border p-4 rounded mb-3 cursor-pointer hover:bg-gray-100"
          onClick={() => router.push(`/cases/${c.id}`)}
        >
          <p className="font-semibold">{c.title}</p>
          <p className="text-sm text-gray-500">
            {new Date(c.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}