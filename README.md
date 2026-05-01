# Clinical Note Structuring Tool

## Overview
This is a full-stack clinical documentation tool that converts unstructured medical notes into structured clinical summaries using AI.

- The frontend (Next.js) handles user input, displays structured output, and manages UI interactions.
- The backend (FastAPI) processes requests, interacts with the OpenAI API, structures clinical data, and stores cases.
- A SQLite database is used for persistent storage of saved cases.

Data Flow:
```
User Input → Next.js Frontend → FastAPI Backend → OpenAI API
→ Structured JSON Output → Stored in SQLite → Displayed in UI
```

---

## Features
- Multi-input clinical note processing (ER + H&P + optional guideline)
- AI-powered structured output generation
- Editable output before saving
- Case persistence using SQLite
- View saved cases and reopen them
- Clean UI built with Next.js

---

## Tech Stack
**Frontend**
- Next.js (React), TypeScript, and Tailwind CSS
- I am currently working on a project using Next.js, TypeScript, and TailwindCSS, so I am most familiar with using these.

**Backend**
- Python and FastAPI
- I am very familiar in using python for AI applications, and FastAPI allows the python to connect to the frontend
  while also handling data processing and storage.

**Database**
- SQLite
- I have used SQLite before; it is the most simple database for handling a few inputs, and does not require setup.

**AI**
- OpenAI API
- I recently learned how to use the OpenAI API in my AI classes at university, and wanted to test it out in practice.

---

## Clinical Note Structure
The input is converted into a structured JSON format by the model with the following fields:
- Chief Complaint
- HPI Summary
- Key Findings
- Suspected Conditions
- Disposition Recommendation
- Uncertainties
- Guideline Support
- Source Facts Used
- Revised HPI

---

## Project Structure

```
clinical-note-structuring-tool/
  backend/
    main.py
    cases.db
  frontend/
    app/
      page.tsx
      cases/
        page.tsx
        [id]/page.tsx
```

---

## Generating the Revised HPI

- The model extracts key facts from the ER note or H&P note
- It identifies the Symptoms, Timeline, Lab findings, and Diagnosis
- The model then combines structured facts, avoids hallucinations, and produces a clean, professional clinical output

---

## Handling Uncertainty / Missing Information

- The prompt for the model explicitly places missing or unclear data in an "Uncertainties" field.

---

## Local Setup Instructions
This is on a Windows Laptop

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/clinical-note-structuring-tool.git
cd clinical-note-structuring-tool
```

2. Backend Setup
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn openai python-dotenv
```
Create a .env file in backend/:
```
OPENAI_API_KEY=your_api_key_here
```
Run backend:
```
uvicorn main:app --reload
```

3. Frontend Setup
```
cd frontend
npm install
npm run dev
```

Open:
http://localhost:3000

---

## Deployment Link

https://clinical-note-structuring-tool-fatw.onrender.com
https://clinical-note-structuring-tool-bte9ze37m-emsay-7690s-projects.vercel.app/

---

## AI Usage and How

- I used ChatGPT for basic UI design and prompt detailing.
- I also used it for debugging a routing issue.

---

## Possible Improvements

1. I would use a more clinically inclined model over OpenAI in order to decrease the chances of error.
2. I would implement the feature that would allow someone to edit a saved case.
3. I would implement file upload or download support.

