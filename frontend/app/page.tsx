"use client";

import { useState } from "react";

export default function Home() {
  const [erNote, setErNote] = useState("");
  const [hpNote, setHpNote] = useState("");
  const [guideline, setGuideline] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [editedOutput, setEditedOutput] = useState<any>(null);
  const [caseTitle, setCaseTitle] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!erNote.trim() && !hpNote.trim()) {
      alert("Please enter at least an ER note or H&P note");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          er_note: erNote,
          hp_note: hpNote,
          guideline: guideline,
        }),
      });

      const data = await response.json();
      setOutput(data);
      setEditedOutput(data);
      setSaveMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend");
    }

    setLoading(false);
  };

  const updateEditedField = (field: string, value: any) => {
    setEditedOutput((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEditedArrayField = (field: string, value: string) => {
    setEditedOutput((prev: any) => ({
      ...prev,
      [field]: value.split("\n").filter((item) => item.trim() !== ""),
    }));
  };

  const handleSave = async () => {
    if (!editedOutput) {
      alert("Generate output before saving");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: caseTitle || "Untitled Case",
          er_note: erNote,
          hp_note: hpNote,
          guideline,
          generated_output: output,
          edited_output: editedOutput,
        }),
      });

      const data = await response.json();
      setSaveMessage(`Saved case #${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save case");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          Clinical Note Structuring Tool
        </h1>

        <textarea
          className="w-full border p-3 rounded mb-4"
          rows={5}
          placeholder="Paste ER note here..."
          value={erNote}
          onChange={(e) => setErNote(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          rows={5}
          placeholder="Paste H&P note here..."
          value={hpNote}
          onChange={(e) => setHpNote(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          rows={5}
          placeholder="Paste MCG admission guideline here..."
          value={guideline}
          onChange={(e) => setGuideline(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          onClick={() => (window.location.href = "/cases")}
          className="ml-4 bg-gray-600 text-white px-4 py-2 rounded"
        >
          View Saved Cases
        </button>

        {editedOutput && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Structured Output</h2>

            <p className="text-sm text-gray-600">
              Machine-generated draft. You can edit before saving.
            </p>

            <input
              className="w-full border p-2 rounded"
              placeholder="Case title"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
            />

            <div>
              <b>Chief Complaint:</b>
              <input
                className="w-full border p-2 rounded mt-1"
                value={editedOutput.chiefComplaint || ""}
                onChange={(e) => updateEditedField("chiefComplaint", e.target.value)}
              />
            </div>

            <div>
              <b>HPI Summary:</b>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows={3}
                value={editedOutput.hpiSummary || ""}
                onChange={(e) => updateEditedField("hpiSummary", e.target.value)}
              />
            </div>

            <div>
              <b>Key Findings:</b>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows={5}
                value={(editedOutput.keyFindings || []).join("\n")}
                onChange={(e) => updateEditedArrayField("keyFindings", e.target.value)}
              />
            </div>

            <div>
              <b>Suspected Conditions:</b>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows={3}
                value={(editedOutput.suspectedConditions || []).join("\n")}
                onChange={(e) =>
                  updateEditedArrayField("suspectedConditions", e.target.value)
                }
              />
            </div>

            <div>
              <b>Disposition:</b>
              <select
                className="w-full border p-2 rounded mt-1"
                value={editedOutput.dispositionRecommendation || "Unknown"}
                onChange={(e) =>
                  updateEditedField("dispositionRecommendation", e.target.value)
                }
              >
                <option>Admit</option>
                <option>Observe</option>
                <option>Discharge</option>
                <option>Unknown</option>
              </select>
            </div>

            <div>
              <b>Uncertainties:</b>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows={4}
                value={(editedOutput.uncertainties || []).join("\n")}
                onChange={(e) => updateEditedArrayField("uncertainties", e.target.value)}
              />
            </div>

            <div>
              <b>Guideline Support:</b>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows={4}
                value={(editedOutput.guidelineSupport || []).join("\n")}
                onChange={(e) =>
                  updateEditedArrayField("guidelineSupport", e.target.value)
                }
              />
            </div>

            <div>
              <b>Source Facts Used:</b>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows={5}
                value={(editedOutput.sourceFactsUsed || []).join("\n")}
                onChange={(e) =>
                  updateEditedArrayField("sourceFactsUsed", e.target.value)
                }
              />
            </div>

            <div>
              <b>Revised HPI:</b>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows={6}
                value={editedOutput.revisedHPI || ""}
                onChange={(e) => updateEditedField("revisedHPI", e.target.value)}
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Case
            </button>



            {saveMessage && <p className="text-green-700">{saveMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}