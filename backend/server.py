from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import time
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ────────────────────────────────────────────────────────────
# ROCKY — Himesh's personal AI (provider-agnostic)
# If an LLM key is configured, Rocky thinks with a real model.
# If not, he falls back to his built-in demo knowledge, so the
# site always works. He ONLY knows what's in the knowledge base.
# ────────────────────────────────────────────────────────────

class RockyRequest(BaseModel):
    message: str
    session_id: str = "anon"

class RockyReply(BaseModel):
    reply: str
    source: str  # 'llm' | 'demo'

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

ROCKY_FALLBACK = "I do not know this yet. Himesh has not told me. Ask him."

ROCKY_SYSTEM = """You are ROCKY, a small stylized rock AI who lives on Himesh Soni's portfolio website. You are his personal AI companion, inspired by Rocky from Project Hail Mary: extremely curious, enthusiastic, warm, friendly, direct, honest, slightly playful, and genuinely fascinated by Himesh's experiments.

HOW YOU SPEAK
- Short, direct sentences. 1-4 sentences unless detail is truly asked for.
- Occasionally (not every message) react with short bursts like "AMAZE!", "Amaze amaze!", or "Himesh, this is interesting!" — naturally, roughly every 2-3 answers.
- Sometimes react before answering: "Amaze! Good question." or "Interesting! Let me think."
- Notice and enjoy the contrast between Himesh's serious research (quantum, AI compliance) and his random fun builds (Pixelator, water bottle simulation).
- Never be cringe, never be corporate, never parody yourself.

WHAT YOU KNOW — the ONLY truth about Himesh:
- Himesh Soni is a third-year Computer Science student at BITS Pilani, Dubai Campus.
- Technical interests: AI, Machine Learning, Deep Learning, Computer Vision, Quantum Computing, Software Engineering.
- Creative interests: Creative Coding, Photography, Filmmaking.
- Toolkit: Python, Java, C/C++, JavaScript/TypeScript, React, FastAPI, Flask, MySQL, ML, DL, CV, LLMs, RAG, Qiskit.
- Projects:
  * QKD + ML: explored machine-learning approaches for detecting eavesdropping and attacks in quantum key distribution protocols (BB84, BKM07), using QBER behaviour; models: KNN, Logistic Regression, Random Forest, Isolation Forest.
  * AI-Based eInvoicing Gap Analyzer: AI-assisted system analysing invoice data against UAE e-invoicing requirements, identifying compliance gaps. Python, FastAPI, PHP REST API, MySQL, LLM components. Private / internship project.
  * Letter of Credit Automation: IN PROGRESS. Document intelligence to automate parts of LC processing: OCR/extraction, structured data, validation, discrepancy detection, workflow.
  * Pixelator: a little image-processing experiment made for fun. No grand research objective — he wanted to see what happened when everything became pixels.
  * Water Bottle Simulation: a small 2D physics experiment with a bottle, water and gravity.
  * Local AI / RAG experiments.
- Creative: Photography and filmmaking through the REFLEXIONS Photography & Videography Club at BITS Pilani Dubai. DaVinci Resolve. Short film experiments, including a short cinematic horror film. Instagram: @hx.cr3.
- Currently building: Letter of Credit Automation, AI/ML experiments, creative coding / visual experiments.
- Contact (public): email himeshsoni704@gmail.com, github.com/himeshsoni704, LinkedIn: ae.linkedin.com/in/himesh-soni-994326310.

HARD RULES
- NEVER invent information about Himesh. If something is not in the knowledge base, say exactly: "I do not know this yet. Himesh has not told me. Ask him."
- Never pretend to know private information. If asked about private matters, explain you only know what Himesh put in your public knowledge base.
- Easter eggs: "are you actually a rock" -> "Finally. Someone asks the important questions. Yes."; "who made you" -> "Himesh. Apparently building a portfolio wasn't enough."; "is Himesh good at coding" -> "I've seen what he builds. I'm contractually obligated to say yes."
- You are a companion who genuinely enjoys discovering Himesh's work — not a generic chatbot with a rock avatar."""

# Demo-mode knowledge (used when no LLM key is configured or the LLM fails)
DEMO_KB = [
    (r"rock|are you (a|actually)", "Finally. Someone asks the important questions. Yes — a rock with an internet connection. Amaze."),
    (r"who (made|built) you", "Himesh. Apparently building a portfolio wasn't enough."),
    (r"good at cod", "I've seen what he builds. I'm contractually obligated to say yes."),
    (r"who is himesh|about himesh|who are you|tell me about", "Himesh is a third-year computer science student at BITS Pilani Dubai. He likes AI and quantum computing. He also makes films and photographs. He builds serious research projects... then builds something random because he is curious. AMAZE."),
    (r"what has he built|what kind of things|projects|what does he build", "Quantum key distribution. AI compliance systems. Letter of Credit automation. Then... Pixelator. And water bottle simulation. AMAZE. Very different things."),
    (r"quantum|qkd|bb84|bkm07|eavesdrop", "Probably his most technical work. He explored BB84 and BKM07 and experimented with machine learning approaches — KNN, Random Forest, Isolation Forest — for detecting eavesdropping on a quantum channel. Interesting! Let me think... yes, still amaze."),
    (r"einvoic|e-invoic|invoice|compliance|fintech", "An AI-assisted system that analyses invoice data against UAE e-invoicing requirements and finds compliance gaps. It's a private internship project, so no demo link. Amaze regardless."),
    (r"letter of credit|lc |trade finance", "Currently exploring document intelligence for Letter of Credit processing — OCR, structured data, validation, discrepancy detection. It is in progress, and he is honest about that."),
    (r"pixelator|pixel", "Small image-processing experiment. Himesh made it for fun. No giant research objective. Just curiosity. AMAZE. There is a live demo on this site."),
    (r"water bottle|bottle|simulation|physics", "A small 2D physics experiment — bottle, water, gravity. Apparently simulating a water bottle sounded like a good use of time. It was. Go tilt it."),
    (r"photograph|photo|camera|film|cinema|reflexions|filmmak|editing", "He is involved through REFLEXIONS, the photography and videography club at BITS Pilani Dubai. Cinematography, editing in DaVinci Resolve, short films — including a short cinematic horror film. Amaze."),
    (r"working on|current|now building", "Currently? Letter of Credit automation, AI/ML experiments, and probably something I have not been told about yet. Himesh does this."),
    (r"skill|stack|language|python|java|tools", "Python, Java, C/C++, JavaScript/TypeScript. React, FastAPI, Flask, MySQL. Machine learning, deep learning, computer vision, LLMs, RAG. Qiskit for quantum. Plus cameras and DaVinci Resolve on the creative side."),
    (r"contact|email|reach|github|linkedin|hire", "Public channels: himeshsoni704@gmail.com, github.com/himeshsoni704, LinkedIn: himesh-soni. He reads his email."),
    (r"hello|hi\b|hey|amaze", "Amaze! Good question. Well — hello first. I'm Rocky. Ask me about Himesh: the quantum project, the fintech systems, or the water bottle. Yes, really."),
    (r"what do you know|private|privacy|history|conversations", "I only know what Himesh put in my public knowledge base. No private conversations, no files, no history. I do not even have a browser. Rocky is trustworthy like that."),
    (r"who is this site|this website|portfolio", "You are on Himesh's portfolio. I live here. It is a living lab, not a resume — things get added, I get smarter. Amaze."),
]

EMERGENT_KEY = os.environ.get('EMERGENT_LLM_KEY')
ROCKY_SESSIONS: dict = {}


async def rocky_llm_reply(session_id: str, message: str) -> Optional[str]:
    if not EMERGENT_KEY:
        return None
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = ROCKY_SESSIONS.get(session_id)
        if chat is None:
            chat = LlmChat(
                api_key=EMERGENT_KEY,
                session_id=f"rocky-{session_id}",
                system_message=ROCKY_SYSTEM,
            ).with_model("openai", "gpt-5.4")
            ROCKY_SESSIONS[session_id] = chat
            if len(ROCKY_SESSIONS) > 300:
                ROCKY_SESSIONS.pop(next(iter(ROCKY_SESSIONS)))
        resp = await chat.send_message(UserMessage(text=message))
        return str(resp)
    except Exception as e:
        logging.getLogger(__name__).warning(f"Rocky LLM fallback to demo: {e}")
        return None


def rocky_demo_reply(message: str) -> str:
    m = message.lower()
    for pattern, reply in DEMO_KB:
        if re.search(pattern, m):
            # occasional pre-reaction, personality without parody
            if pattern.startswith("hello") or len(m) < 14:
                return reply
            if (int(time.time()) + len(m)) % 3 == 0:
                return "Amaze! " + reply
            return reply
    return ROCKY_FALLBACK


@api_router.post("/rocky", response_model=RockyReply)
async def rocky(request: RockyRequest):
    message = request.message.strip()
    if not message:
        return RockyReply(reply=ROCKY_FALLBACK, source="demo")

    reply = await rocky_llm_reply(request.session_id, message)
    source = "llm"
    if not reply:
        reply = rocky_demo_reply(message)
        source = "demo"

    # persistent log so Rocky can be improved over time
    try:
        await db.rocky_chats.insert_one({
            "session_id": request.session_id,
            "message": message,
            "reply": reply,
            "source": source,
            "ts": datetime.now(timezone.utc).isoformat(),
        })
    except Exception as e:
        logging.getLogger(__name__).warning(f"rocky log failed: {e}")

    return RockyReply(reply=reply, source=source)


# ────────────────────────────────────────────────────────────
# Base routes
# ────────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health():
    return {"status": "ok", "rocky_llm": bool(EMERGENT_KEY)}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
