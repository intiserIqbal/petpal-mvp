import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ChatbotButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then(() => setVisible(true)).catch(()=> setVisible(false));
  }, []);

  if (!visible) return null;

  return (
    <>
      {open && <ChatWidget onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open PetPal Assistant"
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1000, width:64, height:64, borderRadius:32, background:"#2563eb", color:"#fff" }}
      >
        🐶
      </button>
    </>
  );
}

function ChatWidget({ onClose }: { onClose: ()=>void }) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<{ from: "user"|"bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!text.trim()) return;
    const t = text.trim();
    setMsgs(m => [...m, { from: "user", text: t }]);
    setText("");
    setLoading(true);
    try {
      const res = await api.post("/chatbot", { text: t });
      setMsgs(m => [...m, { from: "bot", text: res.data.answer }]);
    } catch {
      setMsgs(m => [...m, { from: "bot", text: "Error: failed to get answer." }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", right:20, bottom:96, width:360, maxWidth:"90vw", zIndex:1000, background:"#fff", borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
      <div style={{padding:12, display:"flex", justifyContent:"space-between", fontWeight:700}}>PetPal Assistant <button onClick={onClose}>✕</button></div>
      <div style={{height:240, overflowY:"auto", padding:12}}>
        {msgs.map((m,i)=> <div key={i} style={{textAlign: m.from==="user" ? "right":"left", marginBottom:8}}><div style={{display:"inline-block", padding:"8px 10px", background:m.from==="user" ? "#e6f4ff":"#f1f5f9", borderRadius:6}}>{m.text}</div></div>)}
      </div>
      <div style={{display:"flex", gap:8, padding:12}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask about this pet or care..." style={{flex:1,padding:8}}/>
        <button onClick={send} disabled={loading} style={{background:"#2563eb",color:"#fff",padding:"8px 12px",borderRadius:6}}>{loading ? "..." : "Send"}</button>
      </div>
    </div>
  );
}