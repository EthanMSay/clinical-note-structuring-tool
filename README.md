# Clinical Note Structuring Tool

## Overview
This is a full-stack clinical documentation tool that converts unstructured medical notes into structured clinical summaries using AI.

The application accepts ER notes, H&P notes, and optional admission guidelines, and generates a structured output including:
- Chief Complaint
- HPI Summary
- Key Findings
- Suspected Conditions
- Disposition
- Uncertainties
- Guideline Support
- Source Facts Used
- Revised HPI

Users can edit the generated output and save cases for later viewing.

---

## Features
- Multi-input clinical note processing (ER + H&P + optional guideline)
- AI-powered structured output generation
- Editable output before saving
- Case persistence using SQLite
- View saved cases and reopen them
- Clean UI built with Next.js

---

## 🛠 Tech Stack
**Frontend**
- Next.js (React)
- TypeScript
- Tailwind CSS

**Backend**
- Python
- FastAPI

**Database**
- SQLite

**AI**
- OpenAI API

---

## Example Test Cases

### Case A (Diverticulitis)
- Fever + abdominal pain
- CT findings
- Failed outpatient antibiotics
- → Admission recommended

### Case B (DKA)
- Severe metabolic acidosis
- Hyperglycemia / euglycemic DKA
- ICU-level care required
- → Admission recommended

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/clinical-note-structuring-tool.git
cd clinical-note-structuring-tool
