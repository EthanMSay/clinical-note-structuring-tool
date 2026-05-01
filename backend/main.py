from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import json
import os
import sqlite3
from datetime import datetime
from typing import Any

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "cases.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            er_note TEXT,
            hp_note TEXT,
            guideline TEXT,
            reference_hpi TEXT,
            generated_output TEXT,
            edited_output TEXT,
            created_at TEXT,
            updated_at TEXT
        )
    """)

    conn.commit()
    conn.close()


init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    er_note: str
    hp_note: str
    guideline: str = ""
    reference_hpi: str = ""

class SaveCaseRequest(BaseModel):
    title: str
    er_note: str
    hp_note: str
    guideline: str = ""
    reference_hpi: str = ""
    generated_output: dict[str, Any]
    edited_output: dict[str, Any]

@app.get("/")
def root():
    return {"message": "Clinical Note Structuring Backend is running"}


@app.post("/generate")
def generate(data: GenerateRequest):
    er_note = data.er_note
    hp_note = data.hp_note
    guideline = data.guideline
    reference_hpi = data.reference_hpi

    prompt = f"""
You are a clinical documentation assistant.

You are given an ER note, an H&P note, an admission guideline, and optionally a reference revised HPI example.

Your task is to generate structured clinical output and a Revised HPI that supports the appropriate disposition.

Please follow these strict rules in order to avoid false information:
- Use only facts explicitly present in the ER note or H&P note.
- Do not invent symptoms, labs, treatments, diagnoses, or history.
- Consider both the ER note and H&P note as valid sources.
- Use the admission guideline only to support reasoning, not to create new patient facts.
- If clinically important information is missing, list it under uncertainties.
- Avoid repetition across fields.
- The Revised HPI should clearly explain why the disposition is appropriate.
- Return valid JSON only.
- keyFindings must be concise bullet-style clinical facts (not full sentences)
- guidelineSupport must explain how the patient meets admission criteria using the guideline
- sourceFactsUsed must list the exact facts from ER or H&P notes that support the reasoning
- Avoid repeating the same information across multiple fields

Return the valid JSON only in this format:

{{
  "chiefComplaint": "",
  "hpiSummary": "",
  "keyFindings": [],
  "suspectedConditions": [],
  "dispositionRecommendation": "Admit | Observe | Discharge | Unknown",
  "uncertainties": [],
  "guidelineSupport": [],
  "sourceFactsUsed": [],
  "revisedHPI": ""
}}

ER Note:
{er_note}

H&P Note:
{hp_note}

Admission Guideline:
{guideline}

Reference Revised HPI Example:
{reference_hpi}
"""

    response = client.responses.create(
        model="gpt-5.4-mini",
        input=prompt,
    )

    text = response.output_text

    try:
        structured = json.loads(text)
        return structured
    except:
        return {
            "error": "Failed to parse AI output",
            "raw": text
        }
    

@app.post("/cases")
def save_case(data: SaveCaseRequest):
    now = datetime.now().isoformat()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO cases (
            title,
            er_note,
            hp_note,
            guideline,
            reference_hpi,
            generated_output,
            edited_output,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            data.title,
            data.er_note,
            data.hp_note,
            data.guideline,
            data.reference_hpi,
            json.dumps(data.generated_output),
            json.dumps(data.edited_output),
            now,
            now,
        ),
    )

    case_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"id": case_id, "message": "Case saved successfully"}


@app.get("/cases")
def list_cases():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, title, created_at, updated_at
        FROM cases
        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "created_at": row[2],
            "updated_at": row[3],
        }
        for row in rows
    ]


@app.get("/cases/{case_id}")
def get_case(case_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, title, er_note, hp_note, guideline, reference_hpi,
               generated_output, edited_output, created_at, updated_at
        FROM cases
        WHERE id = ?
        """,
        (case_id,),
    )

    row = cursor.fetchone()
    conn.close()

    if row is None:
        return {"error": "Case not found"}

    return {
        "id": row[0],
        "title": row[1],
        "er_note": row[2],
        "hp_note": row[3],
        "guideline": row[4],
        "reference_hpi": row[5],
        "generated_output": json.loads(row[6]),
        "edited_output": json.loads(row[7]),
        "created_at": row[8],
        "updated_at": row[9],
    }