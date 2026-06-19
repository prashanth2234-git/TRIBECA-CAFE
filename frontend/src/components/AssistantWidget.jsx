import { Bot, Send } from "lucide-react";
import { useState } from "react";
import api from "../services/api";

export default function AssistantWidget() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Ask about clinic timings, services, appointments, or queue flow.");
  const [loading, setLoading] = useState(false);

  async function ask(event) {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/ai/ask", { question });
      setAnswer(data.answer);
      setQuestion("");
    } catch (error) {
      setAnswer(error.response?.data?.message || "Assistant is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <Bot className="h-5 w-5 text-clinic-teal" />
        <h3 className="font-semibold text-clinic-navy">AI Clinic Assistant</h3>
      </div>
      <p className="min-h-16 rounded-md bg-clinic-mint/60 p-3 text-sm text-slate-700">{answer}</p>
      <form onSubmit={ask} className="mt-3 flex gap-2">
        <input className="field" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a clinic FAQ" />
        <button className="btn-primary" disabled={loading} title="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-2 text-xs text-slate-500">Information only. No medical diagnosis or treatment advice.</p>
    </div>
  );
}
