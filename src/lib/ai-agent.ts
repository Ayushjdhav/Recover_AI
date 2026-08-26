export interface AIAgentInput {
  amount: number;
  failureReason: string;
  successfulPayments: number;
  failedPayments: number;
  retryCount: number;
  recoveryScore: number;
}

export interface AIAgentDecision {
  action: string;
  confidence: number;
  reason: string;
}

const VALID_ACTIONS = ["RETRY", "REMIND", "ESCALATE", "STOP"];

export async function getAIRecoveryDecision(
  input: AIAgentInput
): Promise<AIAgentDecision | null> {
  const systemPrompt = `You are a payment recovery strategy assistant. You analyze failed payment data and recommend ONE recovery action.

You must respond with ONLY valid JSON, no other text, in exactly this format:
{"action": "RETRY", "confidence": 82, "reason": "short explanation here"}

The "action" field must be EXACTLY one of these four strings: RETRY, REMIND, ESCALATE, STOP
- RETRY: the payment is likely to succeed if attempted again soon
- REMIND: the customer should be sent a gentle payment reminder
- ESCALATE: this case needs human/merchant review before any action
- STOP: no further recovery attempts should be made

The "confidence" field must be a number from 0 to 100.
The "reason" field must be a short, one-sentence explanation in plain English.

Do not include any text outside the JSON object.`;

  const userPrompt = `Analyze this failed payment and recommend an action:
Amount: ₹${input.amount}
Failure reason: ${input.failureReason}
Customer's successful payments: ${input.successfulPayments}
Customer's failed payments: ${input.failedPayments}
Retry attempts so far: ${input.retryCount}
Calculated recovery score: ${input.recoveryScore}/100`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;

    if (!rawText) {
      console.error("No content in Groq response");
      return null;
    }

    const parsed = JSON.parse(rawText);

    // Validate the response before trusting it
    if (!VALID_ACTIONS.includes(parsed.action)) {
      console.error("AI returned invalid action:", parsed.action);
      return null;
    }

    if (
      typeof parsed.confidence !== "number" ||
      parsed.confidence < 0 ||
      parsed.confidence > 100
    ) {
      console.error("AI returned invalid confidence:", parsed.confidence);
      return null;
    }

    if (typeof parsed.reason !== "string" || parsed.reason.length === 0) {
      console.error("AI returned invalid reason:", parsed.reason);
      return null;
    }

    return {
      action: parsed.action,
      confidence: parsed.confidence,
      reason: parsed.reason,
    };
  } catch (err) {
    console.error("Error calling AI agent:", err);
    return null;
  }
}