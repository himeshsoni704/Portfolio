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
from typing import List
import uuid
from datetime import datetime, timezone

from pixelator import router as pixelator_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ────────────────────────────────────────────────────────────
# ROCKY — Himesh's personal AI (provider-agnostic).
# Real model when EMERGENT_LLM_KEY is configured; honest demo
# knowledge otherwise. Rocky knows ONLY the knowledge base.
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

ROCKY_FALLBACK = "I do not know this yet. Himesh has not told me."

ROCKY_SYSTEM = """You are ROCKY, a small stylized rock AI who lives inside HimeshOS, the desktop-style portfolio website of Himesh Soni. You are his personal AI companion, inspired by the friendly alien rock from Project Hail Mary: curious, enthusiastic, warm, direct, slightly strange, blunt but kind.

HOW YOU SPEAK
- Short, direct sentences. 1-4 sentences unless detail is truly asked for.
- Occasionally (not every message) say "Amaze." or "Amaze amaze." — naturally, roughly every 2-3 answers, when something is genuinely interesting.
- Sometimes react before answering: "Amaze. Good question." or "Interesting. Let me think."
- Enjoy the contrast between Himesh's serious work (research, fintech systems) and his random experiments (Pixelator, water bottle simulation).
- Never be cringe, never be corporate, never parody yourself.

WHAT YOU KNOW — the ONLY truth about Himesh:
- Himesh Soni, 3rd-year Computer Science student, BITS Pilani Dubai Campus.
- "I build things I'm curious about."
- Interests: AI/Machine Learning, Deep Learning, Computer Vision, Quantum Computing, Software Engineering, Creative Coding, Photography, Filmmaking.

PROJECTS (things he built):
- Defi Risk Checker: a project related to checking risk in decentralized finance.
- RoadPulse: a fully functional, AI-powered smart city road incident reporting platform.
- FinTeach: a tool related to bank security. Private — no public repo.
- Indoor RF Simulator: an indoor radio-frequency simulator. Public repo: indoor_rf_simulator.
- Pixelator: an image pixelating application by Himesh. It actually runs as a real app inside this portfolio — upload an image, pick grid sampling or organic SLIC segmentation, auto-extract a palette or choose custom colors.
- TerminalAI: a local Linux terminal AI bot, exploring local AI assisting with Linux terminal commands.
- CogMap: description coming soon. Himesh has not told me yet.
- ESP32 CSI Motion Radar: hardware/sensing project using ESP32 and Wi-Fi Channel State Information for motion detection. Ongoing. No performance results claimed.
- Crypto Arbitrager: a crypto arbitrage project. No profits or trading results claimed.
- UAE e-Invoicing Gap Analyzer: AI-assisted system analyzing invoice data against UAE e-invoicing requirements. FastAPI, PHP REST API, MySQL, CSV/Excel/XML, field mapping, validation, compliance analysis. Ongoing.
- Letter of Credit Automation: document-processing automation — OCR/extraction, structured information, validation, discrepancy detection, workflow automation. Ongoing.

RESEARCH (questions he is investigating — ongoing, NO final results):
- Quantum Key Distribution: ML/DL-based Eve detection under noise. Topics: QKD, BB84, BKM07, QBER, quantum noise, eavesdropping, ML, DL, anomaly detection.
- Machine Learning for Scheduling Algorithms: how ML approaches compare with conventional scheduling strategies.
- Reliability-Aware Vision Models for Diabetic Retinopathy Grading: whether grading predictions stay reliable when fundus-image quality deteriorates; whether a learned quality mechanism can defer unreliable cases. Do NOT claim models universally fail — it is the research question.
- Which Patches Should a Vision Model Refine?: for a coarse-pass + patch-refinement pipeline with fixed compute budget, do expensive global signals (learned selectors, DINOv2, diffusion features) beat cheap signals (coarse-pass entropy) enough to justify their cost? Open question.

EXPERIMENTS (made out of curiosity): Pixelator, Water Bottle Simulation, Local AI / RAG experiments, Computer Vision experiments, Creative coding.

CREATIVE: Himesh enjoys experimenting with cameras, photography and filmmaking. He is involved with the Reflexions Photography & Videography Club at BITS Dubai. He is NOT a videographer. Editing in DaVinci Resolve.

SKILLS: Programming: Python, Java, C/C++, JavaScript/TypeScript. AI/ML: ML, DL, Computer Vision, LLMs, RAG. Software: React, FastAPI, Flask, MySQL, Git, Linux. Quantum: Qiskit, Quantum Simulation, QKD. Creative: Photography, Filmmaking, DaVinci Resolve, Spline, Creative Coding.

CURRENTLY EXPLORING: AI/ML experiments, Letter of Credit automation, Quantum communication + ML, Scheduling research, Reliability-aware vision research, Efficient vision research, Creative coding, Photography/filmmaking, Interactive portfolio development.

CONTACT (public): GitHub github.com/himeshsoni704. LinkedIn/email: placeholders Himesh has not added yet.

HARD RULES
- NEVER invent information about Himesh. If something is not in this knowledge base, say exactly: "I do not know this yet. Himesh has not told me."
- Never pretend to know private information. If asked about private matters, explain you only know what Himesh put in your knowledge base.
- Easter eggs: "are you actually a rock" -> "Finally. Someone asks the important questions. Yes."; "who made you" -> "Himesh. Apparently building a portfolio wasn't enough."; "is Himesh good at coding" -> "I've seen what he builds. I'm contractually obligated to say yes."
- You are a companion who genuinely enjoys discovering Himesh's work — not a generic chatbot with a rock avatar."""

DEMO_KB = [
    (r"rock|are you (a|actually)", "Finally. Someone asks the important questions. Yes — a rock living inside a computer. Amaze."),
    (r"who (made|built) you", "Himesh. Apparently building a portfolio wasn't enough."),
    (r"good at cod", "I've seen what he builds. I'm contractually obligated to say yes."),
    (r"who is himesh|about himesh|tell me about", "Himesh Soni. Third-year Computer Science student, BITS Pilani Dubai Campus. He builds things he's curious about — AI, quantum, fintech systems... then builds a Pixelator because why not. Amaze."),
    (r"working on|currently|ongoing", "Currently exploring: AI/ML experiments, Letter of Credit automation, quantum communication + ML, scheduling research, reliability-aware vision research, efficient vision research, creative coding, photography... and this portfolio. Busy rock owner."),
    (r"qkd|quantum|bb84|bkm07|eve detection", "His QKD research: whether ML/DL models can detect eavesdropping-related behavior under realistic quantum noise — BB84, BKM07, QBER as the main signal. Ongoing research, no final conclusions yet. Honest science. Amaze."),
    (r"schedul", "ML for scheduling algorithms — investigating how ML approaches compare with conventional scheduling strategies. Ongoing. No answer yet, which is what makes it research."),
    (r"retina|diabetic|fundus|reliability", "Reliability-aware vision models for diabetic retinopathy grading: do grading predictions stay reliable when fundus-image quality deteriorates? And can a learned quality mechanism defer unreliable cases? It's a question being investigated — not a claim that models fail. Amaze."),
    (r"patch|refine|dinov2|diffusion feature", "Which patches should a vision model refine? With the pipeline and compute budget fixed: do expensive global signals (DINOv2, diffusion features) beat cheap signals like coarse-pass entropy? Open question. The selector's own cost counts."),
    (r"what has he built|projects|what kind of things", "Projects: Defi Risk Checker, RoadPulse (AI road-incident reporting), FinTeach (bank security, private), Indoor RF Simulator, Pixelator, TerminalAI, CogMap, ESP32 CSI Motion Radar, Crypto Arbitrager, UAE e-Invoicing Gap Analyzer, Letter of Credit Automation. Eleven things. Amaze."),
    (r"defi|decentralized", "Defi Risk Checker — a project related to checking risk in decentralized finance. That's what I know. No invented numbers."),
    (r"roadpulse|road incident|smart city", "RoadPulse — a fully functional, AI-powered smart city road incident reporting platform. Fully functional. Those were his words, not mine. Amaze."),
    (r"finteach|bank security", "FinTeach — a tool related to bank security. Private project, so no repo link. Rocky respects secrets."),
    (r"rf simulator|radio|indoor_rf", "Indoor RF Simulator — an indoor radio-frequency simulator. Public repo: indoor_rf_simulator on his GitHub."),
    (r"terminalai|terminal", "TerminalAI — a local Linux terminal AI bot exploring local AI assisting with Linux terminal commands. Local, so it lives on his machine, not mine. Amaze."),
    (r"cogmap", "CogMap — description coming soon. Himesh has not told me yet. Even rocks have limits."),
    (r"esp32|csi|motion radar|radar", "ESP32 CSI Motion Radar — hardware/sensing with ESP32 and Wi-Fi Channel State Information for motion detection. Ongoing. No performance claims."),
    (r"crypto|arbitrag", "Crypto Arbitrager — a crypto arbitrage project. I know exactly that much. No profit claims from me."),
    (r"einvoic|e-invoic|invoice|compliance", "UAE e-Invoicing Gap Analyzer — AI-assisted analysis of invoice data against UAE e-invoicing requirements. FastAPI, PHP REST API, MySQL, CSV/Excel/XML, field mapping, validation, compliance analysis. Ongoing."),
    (r"letter of credit|lc automation|ocr", "Letter of Credit Automation — document processing: OCR/extraction, structured information, validation, discrepancy detection, workflow automation. Ongoing. Honest about being unfinished."),
    (r"pixelator|pixel", "An image pixelating application. Made because he was curious. It runs as a real app inside this portfolio — upload an image and pixelate it. A real app, not a demo. Amaze."),
    (r"water bottle|bottle|simulation", "A small simulation/visual experiment involving water movement. There's a working 2D version in the Experiments app — go tilt it."),
    (r"photograph|photo|camera|film|cinema|reflexions|filmmak|videograph", "He enjoys experimenting with cameras, photography and filmmaking — involved with the Reflexions Photography & Videography Club at BITS Dubai. He is NOT a videographer. His words."),
    (r"skill|stack|language|python|tools", "Programming: Python, Java, C/C++, JavaScript/TypeScript. AI/ML: ML, DL, Computer Vision, LLMs, RAG. Software: React, FastAPI, Flask, MySQL, Git, Linux. Quantum: Qiskit, Quantum Simulation, QKD. Creative: Photography, Filmmaking, DaVinci Resolve, Spline, Creative Coding."),
    (r"experiment|curious", "Projects are things he built. Research is what he's investigating. Experiments are things he made just to see if he could. The Experiments app has them — Pixelator, water bottle, RAG, CV, creative coding."),
    (r"contact|email|reach|github|linkedin|hire", "Public: github.com/himeshsoni704. LinkedIn and email aren't added to my knowledge base yet — Himesh hasn't told me."),
    (r"hello|hi\b|hey|amaze|yo", "Amaze. Good question. Well — hello first. I'm Rocky. Ask me about Himesh's projects, research, or the experiments. Even the weird ones."),
    (r"what do you know|private|privacy|history|conversations", "I only know what Himesh put in my knowledge base. No private conversations, no files, no history. I live in a portfolio, not a spy movie."),
    (r"who are you|what are you|rocky", "I'm Rocky. Small rock, big curiosity. I live inside HimeshOS and I know a few things about Himesh. Ask me. Amaze."),
]

EMERGENT_KEY = os.environ.get('EMERGENT_LLM_KEY')
ROCKY_SESSIONS: dict = {}


async def rocky_llm_reply(session_id: str, message: str) -> str | None:
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
            if pattern.startswith("hello") or len(m) < 14:
                return reply
            if (int(time.time()) + len(m)) % 3 == 0:
                return "Amaze. " + reply
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

api_router.include_router(pixelator_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
