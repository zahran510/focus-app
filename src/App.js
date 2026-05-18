import React, { useState, useEffect, useMemo } from "react";

export default function App(){

  // ===== USER =====
  const [user,setUser]=useState(localStorage.getItem("user")||"");
  const [name,setName]=useState("");

  // ===== CORE DATA =====
  const [tasks,setTasks]=useState(JSON.parse(localStorage.getItem("tasks"))||[]);
  const [input,setInput]=useState("");

  const [time,setTime]=useState(1500);
  const [running,setRunning]=useState(false);

  const [xp,setXp]=useState(Number(localStorage.getItem("xp"))||0);
  const level=Math.floor(xp/100)+1;

  const [streak,setStreak]=useState(Number(localStorage.getItem("streak"))||0);
  const [focusTime,setFocusTime]=useState(Number(localStorage.getItem("focusTime"))||0);
  const [sessions,setSessions]=useState(Number(localStorage.getItem("sessions"))||0);

  const [distractions,setDistractions]=useState(Number(localStorage.getItem("distractions"))||0);
  const [mood,setMood]=useState(localStorage.getItem("mood")||"");

  const [focusMode,setFocusMode]=useState(false);

  // ===== SAVE =====
  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
    localStorage.setItem("xp",xp);
    localStorage.setItem("streak",streak);
    localStorage.setItem("focusTime",focusTime);
    localStorage.setItem("sessions",sessions);
    localStorage.setItem("distractions",distractions);
    localStorage.setItem("mood",mood);
    localStorage.setItem("user",user);
  },[tasks,xp,streak,focusTime,sessions,distractions,mood,user]);

  // ===== TIMER =====
  useEffect(()=>{
    if(running && time>0){
      const i=setInterval(()=>setTime(t=>t-1),1000);
      return ()=>clearInterval(i);
    }

    if(time===0){
      setRunning(false);
      setTime(1500);
      setXp(x=>x+50);
      setFocusTime(f=>f+25);
      setSessions(s=>s+1);
      setStreak(s=>s+1);
    }
  },[running,time]);

  // ===== REAL AI ENGINE (BEHAVIORAL ANALYSIS) =====
  const aiCoach = useMemo(()=>{

    const avgSession = sessions > 0 ? focusTime / sessions : 0;
    const distractionRate = sessions > 0 ? distractions / sessions : 0;

    if(distractionRate > 1){
      return "لاحظت ارتفاع التشتت. جرب جلسة قصيرة جدًا (15 دقيقة) مع إزالة كل المشتتات.";
    }

    if(avgSession >= 25 && avgSession < 45){
      return "ممتاز، المدة المثالية لك حاليًا 25‑30 دقيقة. استمر بهذا النمط.";
    }

    if(avgSession >= 45){
      return "🔥 أنت تتحمل جلسات طويلة. جرب 45-60 دقيقة بتركيز عميق.";
    }

    if(tasks.length === 0){
      return "ابدأ بأصغر مهمة ممكنة لكسر المقاومة الذهنية.";
    }

    if(mood === "😴"){
      return "المزاج منخفض، تقليل الحمل المعرفي أفضل من التوقف.";
    }

    return "استمر، نمطك يتحسن تدريجيًا.";
  },[sessions,focusTime,distractions,tasks,mood]);

  // ===== SMART TASK SPLITTING =====
  const splitTask = ()=>{
    if(!input) return;

    const words = input.split(" ").filter(w=>w.length>2);

    const parts = words.map((w,i)=>({
      text: `${w} — ${20 + (i*5)} min`
    }));

    setTasks([...tasks,...parts]);
    setInput("");
  };

  // ===== EMERGENCY MODE =====
  const emergency = ()=>{
    const nextTask = tasks[0]?.text || "ابدأ بمهمة سهلة";
    setTasks([...tasks,{text:"🚨 "+nextTask}]);
    setTime(900);
    setRunning(true);
  };

  // ===== LOGIN =====
  if(!user){
    return(
      <div style={ui.center}>
        <h1 style={ui.logo}>Focus Pro 👑</h1>
        <input style={ui.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="اسمك"/>
        <button style={ui.btn} onClick={()=>setUser(name)}>ابدأ</button>
      </div>
    );
  }

  // ===== FOCUS MODE =====
  if(focusMode){
    return(
      <div style={ui.focus}>
        <h1 style={{fontSize:"80px"}}>{Math.floor(time/60)}:{String(time%60).padStart(2,'0')}</h1>

        <button style={ui.bigBtn} onClick={()=>setRunning(!running)}>
          {running?"Pause":"Start"}
        </button>

        <button style={ui.btn} onClick={()=>{
          setFocusMode(false);
          setDistractions(d=>d+1);
        }}>
          Exit
        </button>
      </div>
    );
  }

  // ===== MAIN =====
  return(
    <div style={ui.app}>

      {/* NAV */}
      <div style={ui.nav}>
        <span>{user}</span>
        <span>🔥 {streak}</span>
        <span>⭐ {level}</span>
      </div>

      {/* GRID */}
      <div style={ui.grid}>

        {/* TIMER */}
        <div style={ui.card}>
          <h3>⏱ Focus</h3>

          <div style={ui.circle}>
            {Math.floor(time/60)}:{String(time%60).padStart(2,'0')}
          </div>

          <button style={ui.btn} onClick={()=>setRunning(!running)}>
            {running?"Pause":"Start"}
          </button>

          <button style={ui.btn} onClick={()=>setFocusMode(true)}>
            Fullscreen
          </button>
        </div>

        {/* AI COACH */}
        <div style={ui.card}>
          <h3>🤖 Smart AI Coach</h3>
          <p>{aiCoach}</p>
        </div>

        {/* TASKS */}
        <div style={ui.card}>
          <input style={ui.input} value={input} onChange={(e)=>setInput(e.target.value)} placeholder="مهمة"/>
          <button style={ui.btn} onClick={()=>setTasks([...tasks,{text:input}])}>Add</button>
          <button style={ui.btn} onClick={splitTask}>AI Split</button>

          {tasks.map((t,i)=><div key={i}>{t.text}</div>)}
        </div>

        {/* STATS */}
        <div style={ui.card}>
          <p>Focus: {focusTime}</p>
          <p>Sessions: {sessions}</p>
          <p>Distractions: {distractions}</p>
        </div>

        {/* MOOD */}
        <div style={ui.card}>
          <h3>{mood || "Mood"}</h3>
          <button style={ui.btn} onClick={()=>setMood("😊")}>😊</button>
          <button style={ui.btn} onClick={()=>setMood("😐")}>😐</button>
          <button style={ui.btn} onClick={()=>setMood("😴")}>😴</button>
        </div>

        {/* EMERGENCY */}
        <div style={ui.card}>
          <button style={ui.btn} onClick={emergency}>🚨 أنقذني</button>
        </div>

      </div>

    </div>
  );
}

// ===== UI =====
const ui={
  app:{background:"#020617",minHeight:"100vh",color:"#fff"},
  nav:{display:"flex",justifyContent:"space-between",padding:"15px",background:"#064e3b"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"15px",padding:"20px"},
  card:{background:"rgba(255,255,255,0.05)",padding:"20px",borderRadius:"15px",backdropFilter:"blur(10px)"},
  input:{padding:"12px",borderRadius:"10px",width:"100%",marginBottom:"10px"},
  btn:{padding:"10px 15px",borderRadius:"20px",margin:"5px",border:"none",background:"linear-gradient(45deg,#10b981,#facc15)",color:"#000",cursor:"pointer"},
  bigBtn:{padding:"25px",borderRadius:"30px",background:"#10b981"},
  center:{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",height:"100vh",background:"#020617"},
  focus:{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",height:"100vh",background:"#000"},
  circle:{border:"6px solid #10b981",borderRadius:"50%",padding:"30px",fontSize:"30px"},
  logo:{color:"#10b981"}
};