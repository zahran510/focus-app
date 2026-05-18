import React, { useState, useEffect, useCallback } from "react";

export default function App() {

  // ================= USER =================
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [name, setName] = useState("");

  // ================= DATA =================
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks")) || []);
  const [input, setInput] = useState("");

  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  const [xp, setXp] = useState(Number(localStorage.getItem("xp")) || 0);
  const level = Math.floor(xp / 100) + 1;

  const [streak, setStreak] = useState(Number(localStorage.getItem("streak")) || 0);
  const [focusTime, setFocusTime] = useState(Number(localStorage.getItem("focusTime")) || 0);
  const [sessions, setSessions] = useState(Number(localStorage.getItem("sessions")) || 0);

  const [distractions, setDistractions] = useState(Number(localStorage.getItem("distractions")) || 0);
  const [mood, setMood] = useState(localStorage.getItem("mood") || "");

  const [aiInput, setAiInput] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  const [focusMode, setFocusMode] = useState(false);

  // ================= SAVE =================
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("user", user);
    localStorage.setItem("focusTime", focusTime);
    localStorage.setItem("sessions", sessions);
    localStorage.setItem("distractions", distractions);
    localStorage.setItem("mood", mood);
  }, [tasks, xp, streak, user, focusTime, sessions, distractions, mood]);

  // ================= TIMER =================
  useEffect(() => {
    if (running && time > 0) {
      const i = setInterval(() => setTime(t => t - 1), 1000);
      return () => clearInterval(i);
    }

    if (time === 0) {
      setRunning(false);
      setTime(1500);

      setXp(x => x + 60);
      setFocusTime(f => f + 25);
      setStreak(s => s + 1);
      setSessions(s => s + 1);
    }
  }, [running, time]);

  // ================= AI COACH =================
  const generateAdvice = useCallback(() => {

    let msg = "";

    if (distractions > sessions) {
      msg = "😵 أنت مشتت اليوم، ابدأ جلسة 15 دقيقة.";
    } else if (sessions >= 3) {
      msg = "🔥 أنت في Flow عالي!";
    } else if (tasks.length === 0) {
      msg = "ابدأ بمهمة صغيرة.";
    } else if (mood === "😴") {
      msg = "جرب جلسة خفيفة، أنت مرهق.";
    } else {
      msg = "أفضل وقت لك للتركيز مساءً.";
    }

    setAiMessage(msg);

  }, [tasks, distractions, sessions, mood]);

  useEffect(() => {
    generateAdvice();
  }, [generateAdvice]);

  // ================= TASK =================
  const addTask = () => {
    if (!input) return;
    setTasks([...tasks, { text: input }]);
    setInput("");
  };

  // ================= AI SPLIT =================
  const smartSplit = () => {
    if (!aiInput) return;

    const words = aiInput.split(" ");

    const newTasks = words.slice(0, 4).map(w => ({
      text: `${w} — 20 min`
    }));

    setTasks([...tasks, ...newTasks]);
  };

  // ================= EMERGENCY =================
  const emergencyFocus = () => {
    setTasks([...tasks, { text: "🚨 ركّز الآن" }]);
    setTime(900);
    setRunning(true);
  };

  // ================= LOGIN =================
  if (!user) {
    return (
      <div style={styles.center}>
        <h1>Focus Pro 👑</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" />
        <button onClick={() => setUser(name)}>Start</button>
      </div>
    );
  }

  // ================= FOCUS MODE =================
  if (focusMode) {
    return (
      <div style={styles.focus}>
        <h1>{Math.floor(time / 60)}:{time % 60}</h1>

        <button onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>

        <button onClick={() => {
          setFocusMode(false);
          setDistractions(d => d + 1);
        }}>
          Exit
        </button>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div style={styles.app}>

      {/* NAV */}
      <div style={styles.nav}>
        <span>👤 {user}</span>
        <span>🔥 {streak}</span>
        <span>⭐ Lv.{level}</span>
      </div>

      {/* GRID */}
      <div style={styles.grid}>

        {/* TIMER */}
        <div style={styles.card}>
          <h3>⏱ Timer</h3>
          <h1>{Math.floor(time / 60)}:{time % 60}</h1>

          <button onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>

          <button onClick={() => setFocusMode(true)}>
            Monk Mode
          </button>
        </div>

        {/* AI */}
        <div style={styles.card}>
          <h3>🤖 AI Coach</h3>
          <p>{aiMessage}</p>
        </div>

        {/* TASKS */}
        <div style={styles.card}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Task" />
          <button onClick={addTask}>Add</button>

          <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Split task" />
          <button onClick={smartSplit}>AI Split</button>

          {tasks.map((t, i) => <div key={i}>{t.text}</div>)}
        </div>

        {/* STATS */}
        <div style={styles.card}>
          <p>Focus: {focusTime}</p>
          <p>Sessions: {sessions}</p>
          <p>Distractions: {distractions}</p>
        </div>

        {/* MOOD */}
        <div style={styles.card}>
          <h3>{mood || "Mood"}</h3>
          <button onClick={() => setMood("😊")}>😊</button>
          <button onClick={() => setMood("😐")}>😐</button>
          <button onClick={() => setMood("😴")}>😴</button>
        </div>

        {/* EMERGENCY */}
        <div style={styles.card}>
          <button onClick={emergencyFocus}>🚨 أنقذني</button>
        </div>

      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {
  app: { background: "#020617", color: "white", minHeight: "100vh" },
  nav: { display: "flex", justifyContent: "space-between", padding: "10px", background: "#064e3b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "15px", padding: "20px" },
  card: { padding: "20px", background: "#111", borderRadius: "10px" },
  center: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  focus: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: "#000" }
};
