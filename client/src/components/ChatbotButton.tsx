import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../services/api";

export default function ChatbotButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // init + react to route changes (covers same-tab login redirect) and storage (cross-tab)
  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        setVisible(true);
      } else {
        setAuthToken();
        setVisible(false);
        setOpen(false);
      }
    };

    check();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <>
      {open && <ChatWidget onClose={() => setOpen(false)} onRequireLogin={() => navigate("/login")} />}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open PetPal Assistant"
        className="fixed right-5 bottom-5 z-50 w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg"
      >
        🐶
      </button>
    </>
  );
}

function ChatWidget({ onClose, onRequireLogin }: { onClose: () => void; onRequireLogin: () => void }) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsgs((m) => [...m, { from: "bot", text: "Please log in to use the assistant." }]);
      // optional: redirect to login after a short delay
      setTimeout(() => onRequireLogin(), 800);
      return;
    }

    if (!text.trim()) return;
    const t = text.trim();
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setText("");
    setLoading(true);
    try {
      const res = await api.post("/chatbot", { text: t });
      const answer = res.data?.answer ?? "No answer returned.";
      setMsgs((m) => [...m, { from: "bot", text: answer }]);
    } catch (err: unknown) {
      let msg = "Service error. Please try again later.";
      if (err && typeof err === "object") {
        if ("message" in err && typeof (err as any).message === "string") {
          msg = (err as any).message;
        } else if ("response" in err && typeof (err as any).response?.data?.message === "string") {
          msg = (err as any).response.data.message;
        } else if ("response" in err && typeof (err as any).response?.data?.answer === "string") {
          msg = (err as any).response.data.answer;
        }
      }
      setMsgs((m) => [...m, { from: "bot", text: `Error: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-5 bottom-24 z-50 w-80 max-w-[90vw] bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="font-semibold">PetPal Assistant</div>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="p-3 h-56 overflow-y-auto">
        {msgs.map((m, i) => (
          <div key={i} className={`${m.from === "user" ? "text-right" : "text-left"} mb-2`}>
            <div className={`${m.from === "user" ? "inline-block bg-blue-50" : "inline-block bg-gray-100"} p-2 rounded`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Ask about this pet..."
        />
        <button onClick={send} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}