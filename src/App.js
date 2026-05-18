import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const API_KEY = process.env.REACT_APP_AI_KEY;

export default function App() {

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [aiInput, setAiInput] = useState("");

  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  const [zekr, setZekr] = useState("");

  // ✅ Login
  const loginGoogle = async () => {
    const res = await signInWithPopup(auth, provider);
    setUser(res.user.displayName);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ✅ Timer
  useEffect(() => {
    if (running && time > 0) {
      const t = setInterval(() => setTime(t => t - 1), 1000);
      return () => clearInterval(t);
    }

    if (time === 0) {
      setRunning(false);
      setTime(1500);
      alert("✅ خلصت السيشن!");
    }
  }, [running, time]);

  // ✅ Azkar
  useEffect(() => {
    const list = [
      "سبحان الله وبحمده",
      "الحمد لله",
      "الله أكبر",
      "لا إله إلا الله",
      "استغفر الله العظيم",
      "اللهم صل على محمد"
    ];

    const i = setInterval(() => {
      const r = list[Math.floor(Math.random() * list.length)];
      setZekr(r);
    }, 5000);

    return () => clearInterval(i);
  }, []);

  // ✅ Tasks
  const addTask = () => {
    if (!input) return;
    setTasks([...tasks, input]);
    setInput("");
  };

  // 🤖 AI (محسن + متنوع)
  const askAI = async () => {

    if (!aiInput) return alert("اكتب حاجة");

    try {

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
          "HTTP-Referer": "https://focus-app-eight-rouge.vercel.app",
          "X-Title": "Focus App"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "انت مساعد ذكي. اعمل خطة tasks مختلفة كل مرة ومنظمة."
            },
            {
              role: "user",
              content: aiInput + " اعملها بشكل جديد ومختلف"
            }
          ]
        })
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (!reply) throw new Error("AI fail");

      const lines = reply.split("\n").filter(l => l.trim() !== "");
      setTasks(prev => [...prev, ...lines]);

    } catch (e) {

      // ✅ fallback متنوع
      const randomPlans = [
        ["📖 ابدأ", "🧠 راجع", "✅ خلص"],
        ["📘 جزء 1", "☕ بريك", "📚 جزء 2"],
        ["🧠 مراجعة", "✍️ تدريب", "✅ اختبار"],
        ["📖 قراءة", "🎯 تركيز", "✅ إنهاء"]
      ];

      const random = randomPlans[Math.floor(Math.random() * randomPlans.length)];
      setTasks(prev => [...prev, ...random]);
    }
  };

  const format = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  };

  // ✅ Login screen
  if (!user) {
    return (
      <div style={styles.center}>
        <h2>👋 Welcome</h2>
        <button style={styles.btn} onClick={loginGoogle}>
          🔐 Login with Google
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3>🔥 Focus</h3>
        <p>👤 {user}</p>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>

      {/* Main */}
      <div style={styles.main}>

        <h1>👑 FINAL APP</h1>

        {/* Timer */}
        <div style={styles.card}>
          <h2>{format()}</h2>
          <button onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
        </div>

        {/* Azkar */}
        <div style={styles.card}>
          <h3>🕌 ذكر</h3>
          <p>{zekr}</p>
        </div>

        {/* Tasks */}
        <div style={styles.card}>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Task"
          />
          <button onClick={addTask}>Add</button>

          <br/><br/>

          <input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="اكتب للـ AI"
          />
          <button onClick={askAI}>🤖 AI</button>

          {tasks.map((t, i) => (
            <div key={i} style={styles.task}>{t}</div>
          ))}

        </div>

      </div>
    </div>
  );
}

// styles
const styles = {
  container:{display:"flex",height:"100vh",background:"#0f172a",color:"white"},
  sidebar:{width:"200px",background:"#020617",padding:"20px"},
  main:{flex:1,padding:"20px"},
  card:{background:"#1e293b",padding:"15px",marginBottom:"15px",borderRadius:"10px"},
  btn:{padding:"10px",background:"#22c55e",border:"none",color:"white"},
  logout:{marginTop:"10px",background:"red",color:"white"},
  center:{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"},
  task:{marginTop:"5px",padding:"6px",background:"#334155",borderRadius:"6px"}
};