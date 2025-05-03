# careSync_: AI-Powered Surgical Planning & Hospital Coordination

Welcome to **careSync_** — a complete AI-based system that leverages LLMs, intelligent agents, and full-stack infrastructure to automate surgical planning, team assignments, and hospital workflow management.

This repo contains both:
- **Backend** (FastAPI, MongoDB, LangChain agents, LLM integration)
- **Frontend** (React + Tailwind doctor interface)

---

## 🌐 Tech Stack

| Layer     | Stack                                  |
|-----------|-----------------------------------------|
| Frontend  | React, Tailwind CSS                     |
| Backend   | FastAPI, LangChain, MongoDB, Python     |
| LLM       | Fine-tuned Phi-2 with LoRA              |
| Agent System | LangChain Tools + MongoDB queries    |
| Hosting   | Locally served via Uvicorn / npm        |

---

## ⚙️ Backend Setup (Python)

### 1. Navigate to backend:
```bash
cd backend
```

### 2. Create virtual environment:
```bash
python -m venv venv
venv Scripts/Activate.ps1
```

### 3. Install dependencies:
```bash
pip install -r requirements.txt
pip install langchain-openai langchain-community python-dotenv
```

### 4. Configure your `.env`:
Create a `.env` file in `backend/`:
```
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hospital
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Run FastAPI server:
```bash
uvicorn main:app --reload --port 9000
```
Open Swagger UI: [http://localhost:9000/docs](http://localhost:9000/docs)

### ✨ APIs Available:
- `POST /availability` – Check availability of staff, nurses, equipment, OT, and test data based on a requested time window.
- `POST /publish` – Publish the surgical plan and send confirmation messages to all assigned personnel.
- `POST /tasks` – Create a new task assigned to a patient, such as "Schedule MRI" or "Collect reports".
- `GET /tasks?patient_id=...` – Fetch all tasks associated with a specific patient.
- `PUT /tasks/{task_id}` – Update a task's status or description by its ID.
- `DELETE /tasks/{task_id}` – Remove a task from the task list by its ID.

### 🗃️ Seed MongoDB with Sample Data:
Create a file named `seed_db.py` inside `backend/`:

```
For inserting dummy data in db.
```
Run this to populate your DB:
```bash
python seed_db.py
```

---

## 💻 Frontend Setup (React)

### 1. Navigate to frontend:
```bash
cd frontend
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start frontend server:
```bash
npm run dev
```

### 4. Environment Config (Optional)
If needed, create `.env` in `frontend/` for the backend base URL:
```
VITE_API_BASE=http://localhost:9000
```

---

## 🧠 Workflow Summary

1. Doctor logs in → clicks the AI Suggestions button
2. LLM (fine-tuned Phi-2) generates JSON surgical plan
3. Plan goes to backend → agent crew assigns staff depending on availibility, OR availibility, tests required/completed, and equipment available
4. Doctor sees plan on frontend → publishes → `/publish` sends confirmations
5. Doctor can manage tasks → CRUD via `/tasks`

---

## ✅ Dependencies Overview

### Backend:
- fastapi
- pymongo
- uvicorn
- python-dotenv
- langchain
- langchain-openai

### Frontend:
- react
- tailwindcss
- axios

---

## 🔗 Demo & Repo Links

| Component | Link                                  |
|----------|----------------------------------------|
| Backend  | `http://localhost:9000/docs`           |
| Frontend | `http://localhost:5173` (or your port) |

---

## ✍️ Contributors

- **Maulik Ghatala** — UI/UX & Frontend
- **Gaurav Patil** — Agents, MongoDB
- **Jayesh Shinde** — Backend, LLM Finetuning

---

_This project was developed as part of our commure codes hackathon submission. Powered by LangChain, FastAPI, React, and a custom fine-tuned LLM._