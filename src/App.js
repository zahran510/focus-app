import React, { useState, useEffect, useRef } from "react";

export default function App(){

  // ================= USER =================
  const [user,setUser]=useState(localStorage.getItem("user")||"");
  const [name,setName]=useState("");

  // ================= DATA =================
  const [tasks,setTasks]=useState(JSON.parse(localStorage.getItem("tasks"))||[]);
  const [input,setInput]=useState("");

  const [time,setTime]=useState(1500);
  const [running,setRunning]=useState(false);

  const [xp,setXp]=useState(Number(localStorage.getItem("xp"))||0);
  const level = Math.floor(xp/100)+1;

  const [streak,setStreak]=useState(Number(localStorage.getItem("streak"))||0);
  const [distractions,setDistractions]=useState(Number(localStorage.getItem("distractions"))||0);
  const [mood,setMood]=useState(localStorage.getItem("mood")||"");

  const [focusTime,setFocusTime]=useState(Number(localStorage.getItem("focusTime"))||0);
  const sessionsRef = useRef(Number(localStorage.getItem("sessions"))||0);

  const [aiInput,setAiInput]=useState("");
  const [aiMessage,setAiMessage]=useState("");

  const [focusMode,setFocusMode]=useState(false);

  // ================= SAVE =================
  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
    localStorage.setItem("xp",xp);
    localStorage.setItem("streak",streak);
    localStorage.setItem("user",user);
    localStorage.setItem("distractions",distractions);
    localStorage.setItem("mood",mood);
    localStorage.setItem("focusTime",focusTime);
    localStorage.setItem("sessions",sessionsRef.current);
  },[tasks,xp,streak,user,distractions,mood,focusTime]);

  // ================= TIMER =================
  useEffect(()=>{
    if(running && time>0){
      const i=setInterval(()=>setTime(t=>t-1),1000);
      return ()=>clearInterval(i);
    }

    if(time===0){
      setRunning(false);
      setTime(1500);
      setXp(x=>x+60);
      setFocusTime(f=>f+25);
      setStreak(s=>s+1);
      sessionsRef.current +=1;
    }
  },[running,time]);

  // ================= AI COACH =================
  const generateAdvice=()=>{
    let msg="";

    if(distractions > sessionsRef.current){
      msg="لاحظت أنك مشتت اليوم 😵 جرب جلسة 15 دقيقة فقط.";
    }
    else if(sessionsRef.current>=3){
      msg="🔥 رائع! أنت في Flow، استمر!";
    }
    else if(tasks.length===0){
      msg="ابدأ بمهمة صغيرة ولا تفكر كثيرًا.";
    }
    else if(mood==="😴"){
      msg="يبدو أنك متعب، جرب جلسة خفيفة.";
    }
    else{
      msg="استمر، أفضل وقت لك عادة بعد 8 مساء.";
    }

    setAiMessage(msg);
  };

  useEffect(()=>{
    generateAdvice();
  },[tasks,distractions,mood]);

  // ================= SMART AI =================
  const smartTaskBreak=()=>{
    const text = aiInput.toLowerCase();

    let newTasks=[];

    if(text.includes("operating systems") || text.includes("os")){
      newTasks=[
        "Processes — 25 min",
        "Scheduling — 25 min",
        "Deadlock — 20 min",
        "Revision — 20 min"
      ];
    } else {
      const words=text.split(" ");
      newTasks = words.slice(0,4).map(w=>w+" — 20 min");
    }

    setTasks([...tasks,...newTasks.map(t=>({text:t}))]);
  };

  // ================= EMERGENCY =================
  const emergencyFocus=()=>{
    let task = tasks.length ? tasks[0].text : "ابدأ بمذاكرة بسيطة";
    
    setTasks([...tasks,{text:"🚨 "+task}]);

    setTime(900);
    setRunning(true);
  };

  // ================= LOGIN =================
  if(!user){
    return(
      <div style={styles.center}>
        <h1 style={styles.logo}>Focus Pro</h1>
        <input style={styles.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your Name"/>
        <button style={styles.btn} onClick={()=>setUser(name)}>Start</button>
      </div>
    );
  }

  // ================= FOCUS MODE =================
  if(focusMode){
    return(
      <div style={styles.focus}>
        <h1 style={{fontSize:"80px"}}>{Math.floor(time/60)}:{time%60}</h1>
        <button style={styles.bigBtn} onClick={()=>setRunning(!running)}>
          {running?"Pause":"Start"}
        </button>
        <button style={styles.btn} onClick={()=>setFocusMode(false)}>Exit</button>
      </div>
    );
  }

  // ================= MAIN =================
  return(
    <div style={styles.app}>

      {/* NAVBAR */}
      <div style={styles.nav}>
        <div>👑 {user}</div>
        <div>🔥 {streak}</div>
        <div>⭐ Lv.{level}</div>
      </div>

      {/* DASHBOARD GRID */}
      <div style={styles.grid}>

        {/* TIMER */}
        <div style={styles.card}>
          <h3>⏱ Focus</h3>
          <h1>{Math.floor(time/60)}:{time%60}</h1>

          <button style={styles.btn} onClick={()=>setRunning(!running)}>
            {running?"Pause":"Start"}
          </button>

          <button style={styles.btn} onClick={()=>setFocusMode(true)}>Fullscreen</button>
        </div>

        {/* AI COACH */}
        <div style={styles.card}>
          <h3>🤖 Smart AI Coach</h3>
          <p>{aiMessage}</p>
        </div>

        {/* TASKS */}
        <div style={styles.card}>
          <h3>🎯 Tasks</h3>

          <input style={styles.input} value={input} onChange={(e)=>setInput(e.target.value)} />
          <button style={styles.btn} onClick={()=>setTasks([...tasks,{text:input}])}>Add</button>

          <input style={styles.input} value={aiInput} onChange={(e)=>setAiInput(e.target.value)} placeholder="AI break task"/>
          <button style={styles.btn} onClick={smartTaskBreak}>🤖 Split</button>

          {tasks.map((t,i)=>(<div key={i}>{t.text}</div>))}
        </div>

        {/* STATS */}
        <div style={styles.card}>
          <h3>📊 Stats</h3>
          <p>Focus: {focusTime}</p>
          <p>Sessions: {sessionsRef.current}</p>
          <p>Distractions: {distractions}</p>
        </div>

        {/* MOOD */}
        <div style={styles.card}>
          <h3>😊 Mood: {mood}</h3>
          <button style={styles.btn} onClick={()=>setMood("😊")}>😊</button>
          <button style={styles.btn} onClick={()=>setMood("😐")}>😐</button>
          <button style={styles.btn} onClick={()=>setMood("😴")}>😴</button>
        </div>

        {/* EMERGENCY */}
        <div style={styles.card}>
          <h3>🚨 Emergency Focus</h3>
          <button style={styles.btn} onClick={emergencyFocus}>Start Now</button>
        </div>

      </div>

    </div>
  );
}

// ================= STYLES =================
const styles={
  app:{background:"#020617",color:"#fff",minHeight:"100vh"},
  nav:{display:"flex",justifyContent:"space-between",padding:"10px",background:"#064e3b"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"15px",padding:"20px"},
  card:{padding:"20px",borderRadius:"15px",background:"rgba(255,255,255,0.05)",backdropFilter:"blur(10px)"},
  input:{padding:"10px",margin:"5px",width:"100%",borderRadius:"8px"},
  btn:{padding:"10px",margin:"5px",borderRadius:"12px",background:"linear-gradient(45deg,#10b981,#ffd700)",border:"none"},
  bigBtn:{padding:"20px",borderRadius:"20px",background:"#10b981"},
  focus:{background:"#000",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"},
  center:{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#020617"},
  logo:{color:"#10b981"}
};