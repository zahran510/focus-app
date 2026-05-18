import React, { useState, useEffect, useMemo } from "react";

export default function App(){

  const [user,setUser]=useState(localStorage.getItem("user")||"");
  const [name,setName]=useState("");

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

  const [focusMode,setFocusMode]=useState(false);

  // SAVE
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

  // TIMER
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

  // AI
  const aiCoach = useMemo(()=>{

    if(sessions===0){
      return "🚀 ابدأ أول جلسة تركيز";
    }

    if(tasks.length>=5){
      return `📚 عندك ${tasks.length} مهام — ابدأ بالأهم`;
    }

    if(distractions>sessions){
      return "😵 التشتت عالي — قلل الوقت";
    }

    if(sessions>=3){
      return `🔥 أنجزت ${sessions} جلسات`;
    }

    if(mood==="😴"){
      return "💤 راجع بدل المذاكرة الثقيلة";
    }

    return "✅ استمر بنفس الأداء";

  },[tasks.length,sessions,distractions,mood]);

  // TASKS
  const addTask=()=>{
    if(!input) return;

    setTasks([...tasks,{
      id:Date.now(),
      text:input,
      progress:0
    }]);

    setInput("");
  };

  const updateTask=(id)=>{
    setTasks(tasks.map(t=>t.id===id ? {...t,progress:Math.min(t.progress+20,100)} : t));
  };

  const deleteTask=(id)=>{
    setTasks(tasks.filter(t=>t.id!==id));
  };

  // LOGIN
  if(!user){
    return(
      <div style={ui.center}>
        <h1 style={ui.logo}>Focus Pro 👑</h1>

        <input
          style={ui.input}
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="اسمك"
        />

        <button style={ui.btn} onClick={()=>setUser(name)}>
          ابدأ
        </button>
      </div>
    );
  }

  const progress = ((1500-time)/1500)*100;

  // ✅ FOCUS MODE (بيستخدم setFocusMode + setDistractions)
  if(focusMode){
    return(
      <div style={ui.focus}>
        <h1>{Math.floor(time/60)}:{String(time%60).padStart(2,'0')}</h1>

        <button style={ui.btn} onClick={()=>setRunning(!running)}>
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

  return(
    <div style={ui.app}>

      {/* NAV */}
      <div style={ui.nav}>
        <span>{user}</span>
        <span>🔥 {streak}</span>
        <span>⭐ {level}</span>
      </div>

      <div style={ui.grid}>

        {/* TIMER */}
        <div style={{...ui.card,gridColumn:"span 2"}}>
          <h3>⏱ Focus</h3>

          <div style={ui.circle}>
            <div style={{
              ...ui.circleInner,
              background:`conic-gradient(#22c55e ${progress}%, #111 ${progress}%)`
            }}>
              {Math.floor(time/60)}:{String(time%60).padStart(2,"0")}
            </div>
          </div>

          <button style={ui.btn} onClick={()=>setRunning(!running)}>
            {running?"Pause":"Start"}
          </button>

          {/* ✅ ده اللي خلّى focusMode مستخدم */}
          <button style={ui.btn} onClick={()=>setFocusMode(true)}>
            Focus Mode
          </button>
        </div>

        {/* AI */}
        <div style={ui.card}>
          <h3>🤖 AI</h3>
          <p>{aiCoach}</p>
        </div>

        {/* STATS */}
        <div style={ui.card}>
          <p>Sessions: {sessions}</p>
          <p>Focus: {focusTime} min</p>
          <p>Distractions: {distractions}</p>
        </div>

        {/* MOOD */}
        <div style={ui.card}>
          <h3>😊 Mood</h3>
          <button style={ui.btn} onClick={()=>setMood("😊")}>😊</button>
          <button style={ui.btn} onClick={()=>setMood("😐")}>😐</button>
          <button style={ui.btn} onClick={()=>setMood("😴")}>😴</button>
        </div>

        {/* TASKS */}
        <div style={{...ui.card,gridColumn:"span 2"}}>
          <h3>📚 Tasks</h3>

          <input
            style={ui.input}
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="أضف مهمة"
          />

          <button style={ui.btn} onClick={addTask}>إضافة</button>

          {tasks.length===0 && <p>🚀 أضف أول مهمة</p>}

          <div style={ui.tasksGrid}>
            {tasks.map(t=>(
              <div key={t.id} style={ui.taskCard}>
                <h4>{t.text}</h4>

                <div style={ui.bar}>
                  <div style={{...ui.fill,width:t.progress+"%"}}/>
                </div>

                <button onClick={()=>updateTask(t.id)}>+ تقدم</button>
                <button onClick={()=>deleteTask(t.id)}>حذف</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// UI
const ui={
  app:{background:"#020617",minHeight:"100vh",color:"#fff"},
  nav:{display:"flex",justifyContent:"space-between",padding:"15px",background:"#064e3b"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"15px",padding:"20px"},
  card:{background:"#0f172a",padding:"20px",borderRadius:"15px"},
  input:{padding:"10px",width:"100%",borderRadius:"10px",marginBottom:"10px"},
  btn:{padding:"10px",borderRadius:"20px",background:"linear-gradient(45deg,#22c55e,#facc15)",border:"none"},
  center:{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",background:"#020617"},
  logo:{color:"#22c55e"},
  focus:{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",background:"#000"},
  circle:{display:"flex",justifyContent:"center"},
  circleInner:{width:"140px",height:"140px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"},
  tasksGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"10px"},
  taskCard:{background:"#020617",padding:"10px",borderRadius:"10px"},
  bar:{height:"6px",background:"#222",borderRadius:"6px"},
  fill:{height:"6px",background:"#22c55e"}
};