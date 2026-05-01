"use client";

import { useEffect, useState } from "react";

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/cases")
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Cases</h1>

      {cases.map((c) => (
        <div
          key={c.id}
          className="border p-4 rounded mb-3 cursor-pointer hover:bg-gray-100"
          onClick={() => (window.location.href = `/cases/${c.id}`)}
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