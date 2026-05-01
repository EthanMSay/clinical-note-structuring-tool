"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CaseDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${id}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) return <p className="p-6">Loading...</p>;

  const output = data.edited_output;

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <button
        onClick={() => router.push("/cases")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Back to Saved Cases
      </button>

      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Original Inputs</h2>

      <p>
        <b>ER Note:</b>
      </p>
      <p className="whitespace-pre-wrap border p-3 rounded mb-3">
        {data.er_note || "No ER note provided."}
      </p>

      <p>
        <b>H&P Note:</b>
      </p>
      <p className="whitespace-pre-wrap border p-3 rounded mb-3">
        {data.hp_note || "No H&P note provided."}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Structured Output</h2>

      <p>
        <b>Chief Complaint:</b> {output.chiefComplaint}
      </p>

      <p>
        <b>HPI Summary:</b> {output.hpiSummary}
      </p>

      <div>
        <b>Key Findings:</b>
        <ul className="ml-5 list-disc">
          {output.keyFindings?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <b>Suspected Conditions:</b>
        <ul className="ml-5 list-disc">
          {output.suspectedConditions?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <p>
        <b>Disposition:</b> {output.dispositionRecommendation}
      </p>

      <div>
        <b>Uncertainties:</b>
        <ul className="ml-5 list-disc">
          {output.uncertainties?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <b>Guideline Support:</b>
        <ul className="ml-5 list-disc">
          {output.guidelineSupport?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <b>Source Facts Used:</b>
        <ul className="ml-5 list-disc">
          {output.sourceFactsUsed?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <b>Revised HPI:</b>
        <p className="mt-2 whitespace-pre-wrap">{output.revisedHPI}</p>
      </div>
    </div>
  );
}