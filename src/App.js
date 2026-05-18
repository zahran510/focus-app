import React, { useState, useEffect, useMemo } from "react";

export default function App(){

  // ===== USER =====
  const [user,setUser]=useState(localStorage.getItem("user")||"");
  const [name,setName]=useState("");

  // ===== DATA =====
  const [tasks,setTasks]=useState(JSON.parse(localStorage.getItem("tasks"))||[]);
  const [input,setInput]=useState("");

  const [time,setTime]=useState(1500);
  const [running,setRunning]=useState(false);

  const [xp,setXp]=useState(Number(localStorage.getItem("xp"))||0);
  const level=Math.floor(xp/100)+1;

  const [sessions,setSessions]=useState(Number(localStorage.getItem("sessions"))||0);
  const [focusTime,setFocusTime]=useState(Number(localStorage.getItem("focusTime"))||0);
  const [streak,setStreak]=useState(Number(localStorage.getItem("streak"))||0);
  const [distractions,setDistractions]=useState(Number(localStorage.getItem("distractions"))||0);

  const [mood,setMood]=useState(localStorage.getItem("mood")||"");

  // ===== SAVE =====
  useEffect(()=>{
    localStorage.setItem("user",user);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    localStorage.setItem("xp",xp);
    localStorage.setItem("sessions",sessions);
    localStorage.setItem("focusTime",focusTime);
    localStorage.setItem("streak",streak);
    localStorage.setItem("distractions",distractions);
    localStorage.setItem("mood",mood);
  },[user,tasks,xp,sessions,focusTime,streak,distractions,mood]);

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

  // ===== AI COACH (REAL BEHAVIOR) =====
  const aiCoach = useMemo(()=>{

    if(sessions===0){
      return "🚀 لم تبدأ جلسة اليوم بعد — ابدأ الآن.";
    }

    if(tasks.length >= 5){
      return `📚 لديك ${tasks.length} مهام، ابدأ بالأصعب أولًا.`;
    }

    if(distractions > sessions){
      return "😵 التشتت مرتفع، ابدأ جلسة قصيرة (15 دقيقة).";
    }

    if(sessions >= 3){
      return `🔥 أنجزت ${sessions} جلسات، استمر بنفس الأداء.`;
    }

    if(mood==="😴"){
      return "💤 ابدأ بمراجعة خفيفة بدل الضغط.";
    }

    return "✅ استمر — أدائك مستقر.";
  },[tasks.length,sessions,distractions,mood]);

  // ===== ADD TASK =====
  const addTask=()=>{
    if(!input) return;

    setTasks([
      ...tasks,
      {
        id:Date.now(),
        text:input,
        progress:0,
        priority:"Medium"
      }
    ]);

    setInput("");
  };

  // ===== PROGRESS TASK =====
  const updateProgress=(id)=>{
    setTasks(tasks.map(t =>
      t.id===id ? {...t,progress: Math.min(t.progress+20,100)} : t
    ));
  };

  // ===== DELETE TASK =====
  const deleteTask=(id)=>{
    setTasks(tasks.filter(t=>t.id!==id));
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

  // ===== TIMER PROGRESS =====
  const progress = ((1500-time)/1500)*100;

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
        <div style={{...ui.card,gridColumn:"span 2"}}>
          <h3>⏱ Focus Timer</h3>

          <div style={ui.circle}>
            <div style={{
              ...ui.progressCircle,
              background:`conic-gradient(#22c55e ${progress}%, #111 ${progress}%)`
            }}>
              <span>{Math.floor(time/60)}:{String(time%60).padStart(2,"0")}</span>
            </div>
          </div>

          <button style={ui.btn} onClick={()=>setRunning(!running)}>
            {running?"Pause":"Start"}
          </button>
        </div>

        {/* AI */}
        <div style={ui.card}>
          <h3>🤖 AI Coach</h3>
          <p>{aiCoach}</p>
        </div>

        {/* STATS */}
        <div style={ui.card}>
          <p>Sessions: {sessions}</p>
          <p>Focus: {focusTime} min</p>
          <p>Distractions: {distractions}</p>
        </div>

        {/* TASKS */}
        <div style={{...ui.card,gridColumn:"span 2"}}>
          <h3>🎯 Tasks</h3>

          <input style={ui.input} value={input} onChange={(e)=>setInput(e.target.value)} placeholder="أضف مهمة"/>

          <button style={ui.btn} onClick={addTask}>إضافة</button>

          {tasks.length===0 && (
            <div style={{opacity:0.7}}>
              📚 لا توجد مهام بعد — ابدأ بإضافة أول مهمة
            </div>
          )}

          <div style={ui.tasksGrid}>
            {tasks.map(t=>(
              <div key={t.id} style={ui.taskCard}>

                <h4>{t.text}</h4>

                <p>Priority: {t.priority}</p>

                <div style={ui.progressBar}>
                  <div style={{
                    ...ui.progressFill,
                    width:t.progress+"%"
                  }}></div>
                </div>

                <p>{t.progress}%</p>

                <button style={ui.smallBtn} onClick={()=>updateProgress(t.id)}>+ Progress</button>
                <button style={ui.smallBtn} onClick={()=>deleteTask(t.id)}>Delete</button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ===== UI =====
const ui={
  app:{background:"#020617",minHeight:"100vh",color:"#fff"},
  nav:{display:"flex",justifyContent:"space-between",padding:"15px",background:"#064e3b"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"15px",padding:"20px"},
  card:{background:"rgba(255,255,255,0.05)",borderRadius:"15px",padding:"20px"},
  input:{padding:"10px",width:"100%",marginBottom:"10px",borderRadius:"10px"},
  btn:{padding:"10px 15px",borderRadius:"20px",background:"linear-gradient(45deg,#22c55e,#facc15)",border:"none"},
  smallBtn:{padding:"5px 10px",margin:"5px",borderRadius:"10px"},
  center:{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",background:"#020617"},
  logo:{color:"#22c55e"},
  circle:{display:"flex",justifyContent:"center"},
  progressCircle:{width:"140px",height:"140px",borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center"},
  tasksGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"10px"},
  taskCard:{background:"#0f172a",padding:"15px",borderRadius:"12px"},
  progressBar:{height:"6px",background:"#222",borderRadius:"5px"},
  progressFill:{height:"6px",background:"#22c55e"}
};