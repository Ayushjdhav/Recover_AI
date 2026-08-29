markdown
# RecoverAI

**AI-powered revenue recovery for online merchants using Razorpay**

🔗 **Live app:** [recover-ai-one.vercel.app](https://recover-ai-one.vercel.app/)
📦 **Repository:** [github.com/Ayushjdhav/Recover_AI](https://github.com/Ayushjdhav/Recover_AI)

---

## The Problem

Online merchants lose real revenue when payments fail — insufficient funds, bank declines, timeouts, network blips. Many of these customers were still willing to pay; the payment just didn't succeed on the first attempt. Left alone, that revenue is simply gone.

## What RecoverAI Does

RecoverAI isn't a chatbot bolted onto a payments dashboard. It's a **bounded AI agent**: an LLM reasons about each failed payment and recommends a recovery strategy, but it never acts unsupervised. Every recommendation passes through a deterministic policy engine before anything executes — the AI can *suggest*, but the system *decides*.

### Core flow

Failed payment (webhook or seed data)
↓
Recovery Engine — rule-based, explainable score (0-100)
↓
AI Agent (Groq/Llama) — recommends RETRY / REMIND / ESCALATE / STOP
↓
Policy Engine — validates against retry limits, high-value thresholds, case status
↓
ALLOWED → executes | REQUIRES_APPROVAL → held for merchant | BLOCKED → rejected
↓
Recorded in recovery_actions, visible on the Audit Logs page


## Why the AI is Bounded, Not Autonomous

This is the core design decision of the project. The AI is only permitted to return one of exactly four actions: `RETRY`, `REMIND`, `ESCALATE`, `STOP`. Every AI response is validated server-side — action must exactly match the allowed set, confidence must be a number 0-100, reason must be a non-empty string. If the AI ever returns anything malformed or outside the schema, the response is discarded rather than trusted.

Even a validated AI recommendation isn't final. The **Policy Engine** independently checks it against hard business rules:

- Retry count ≥ 3 → forces `STOP`, overriding the AI's recommendation
- Amount > ₹10,000 → held for merchant approval regardless of the AI's confidence
- Case already closed → blocks any further action
- Any invalid action → blocked as a safety net, even though the AI layer already filters this

This two-layer structure — AI reasoning + deterministic policy validation — is demonstrated live in the Recovery Center: a ₹12,500 case where the AI recommends RETRY is held for approval, not executed, because it crosses the high-value threshold.

## Failure Recovery & Graceful Degradation

The system is built to fail safely, not silently break:

- If the AI API is unreachable or rate-limited, the call returns `null` and no bad data is written
- If the AI returns malformed JSON, parsing is wrapped in try/catch and treated the same as a failure
- Duplicate webhook deliveries (which Razorpay explicitly warns can happen) are detected via `razorpay_payment_id` before insert, preventing duplicate recovery cases
- The Razorpay webhook verifies every request's HMAC-SHA256 signature against the raw request body before processing anything — unsigned or forged requests are rejected outright

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| AI | Groq API (`openai/gpt-oss-120b`) |
| Payments | Razorpay Test Mode + Webhooks |
| Icons | Lucide React |
| Deployment | Vercel |

Single Next.js app — frontend, API routes, webhook receiver, AI agent, and policy engine all live in one deployable unit. No microservices, no queues, no unnecessary infrastructure.

## Database Schema

- `customers` — payment history per customer
- `payments` — individual payment attempts, including failure reason
- `recovery_cases` — one per failed payment, holds the recovery score
- `recovery_actions` — the AI's decision, confidence, and reasoning per case
- Audit trail is derived live from `recovery_actions` joined with `recovery_cases` and `payments` — every entry is a real, traceable event, not synthetic data

## Simulation Mode

Real production data is intentionally small (a handful of seeded + webhook-triggered cases) so that every single record is end-to-end genuine — real AI call, real policy check, real signature verification. To demonstrate business impact at merchant scale, the **Simulation** page generates up to 1,000 synthetic payments and runs each failed one through the *same real scoring engine* powering production cases. Recovery success probability is tied directly to the calculated score — no hardcoded outcome numbers anywhere in the codebase.

## What's Deliberately Out of Scope (for now)

- Authentication / multi-tenant merchant accounts (single demo merchant for now)
- Row-Level Security policies (disabled for development speed; would be required before real merchant data)
- Real retry execution via Razorpay (RETRY is simulated/scheduled, since actually re-charging a card requires the customer to re-enter payment details)
- Automated test coverage
- Queue-based processing for AI calls at high webhook volume

## Getting Started Locally

```bash
git clone https://github.com/Ayushjdhav/Recover_AI.git
cd Recover_AI
npm install
```

Create a `.env.local` with:

NEXT_PUBLIC_SUPABASE_URL="your key"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your key"
GROQ_API_KEY="your key"
RAZORPAY_WEBHOOK_SECRET="your key"


```bash
npm run dev
```

## Author

Built by Ayush Jadhav.
