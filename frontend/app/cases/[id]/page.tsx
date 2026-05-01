"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CaseDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/cases/${id}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) return <p className="p-6">Loading...</p>;

  const output = data.edited_output;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      <p><b>Chief Complaint:</b> {output.chiefComplaint}</p>
      <p><b>HPI Summary:</b> {output.hpiSummary}</p>

      <div>
        <b>Key Findings:</b>
        <ul className="ml-5 list-disc">
          {output.keyFindings?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <p><b>Disposition:</b> {output.dispositionRecommendation}</p>

      <div>
        <b>Revised HPI:</b>
        <p className="mt-2">{output.revisedHPI}</p>
      </div>
    </div>
  );
}