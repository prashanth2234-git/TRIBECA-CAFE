import OpenAI from "openai";

const fallback = {
  answer:
    "ClinicFlow AI can help with clinic timings, services, appointment booking steps, and queue guidance. I cannot provide medical diagnosis. Please consult a qualified doctor for medical concerns.",
  disclaimer: "This assistant provides clinic information only and does not provide medical diagnosis or treatment advice."
};

export async function askClinicAssistant(question) {
  if (!process.env.OPENAI_API_KEY) return fallback;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are ClinicFlow AI, a clinic information assistant. Answer only questions about clinic timings, services, appointment booking, queue process, documents to carry, and FAQs. Do not diagnose, prescribe, triage, or provide medical treatment advice. Always include a brief medical disclaimer when health symptoms are mentioned."
      },
      { role: "user", content: question }
    ],
    temperature: 0.2,
    max_tokens: 350
  });

  return {
    answer: response.choices?.[0]?.message?.content || fallback.answer,
    disclaimer: fallback.disclaimer
  };
}
