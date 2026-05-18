import React, { useState, useEffect } from "react";

export default function App(){

  // ================= USER =================
  const [user,setUser]=useState(localStorage.getItem("user")||"");
  const [name,setName]=useState("");

  // ================= SYSTEM =================
  const [tasks,setTasks]=useState(JSON.parse(localStorage.getItem("tasks"))||[]);
  const [input,setInput]=useState("");
  const [aiInput,setAiInput]=useState("");

  const [xp,setXp]=useState(Number(localStorage.getItem("xp"))||0);
  const level=Math.floor(xp/100)+1;

  const [time,setTime]=useState(1500);
  const [running,setRunning]=useState(false);

  const [focus,setFocus]=useState(0);
  const [streak,setStreak]=useState(Number(localStorage.getItem("streak"))||0);

  const [focusMode,setFocusMode]=useState(false);

  const [mood,setMood]=useState(localStorage.getItem("mood")||"");
  const [distractions,setDistractions]=useState(0);

  const [zekr,setZekr]=useState("");

  // ================= SAVE =================
  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
    localStorage.setItem("xp",xp);
    localStorage.setItem("streak",streak);
    localStorage.setItem("user",user);
    localStorage.setItem("mood",mood);
  },[tasks,xp,streak,user,mood]);

  // ================= TIMER =================
  useEffect(()=>{
    if(running && time>0){
      const i=setInterval(()=>setTime(t=>t-1),1000);
      return ()=>clearInterval(i);
    }

    if(time===0){
      setRunning(false);
      setTime(1500);
      setXp(x=>x+50);
      setFocus(f=>f+25);
      setStreak(s=>s+1);

      alert("🔥 Session Done +50 XP");
    }
  },[running,time]);

  // ================= AZKAR =================
  useEffect(()=>{
    const azkar=[
      "سبحان الله",
      "الحمد لله",
      "الله أكبر",
      "لا إله إلا الله",
      "استغفر الله"
    ];

    const i=setInterval(()=>{
      setZekr(azkar[Math.floor(Math.random()*azkar.length)]);
    },6000);

    return ()=>clearInterval(i);
  },[]);

  // ================= LOGIN =================
  if(!user){
    return(
      <div style={styles.center}>
        <h1 style={styles.title}>👑 Focus Pro</h1>

        <input 
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={styles.input}
        />

        <button style={styles.btn} onClick={()=>setUser(name)}>
          Start
        </button>
      </div>
    );
  }

  // ================= AI =================
  const askAI=()=>{
    let plan=[];

    const text=aiInput.toLowerCase();

    if(text.includes("امتحان")){
      plan=[
        "📖 Chapter 1",
        "☕ Break",
        "📘 Chapter 2",
        "🧠 Review",
        "✅ Practice"
      ];
    }else if(text.includes("3")){
      plan=[
        "📖 50 min",
        "☕ Break",
        "📘 50 min",
        "🧠 Review"
      ];
    }else{
      const random=[
        ["📚 Start","🎯 Focus","✅ Done"],
        ["📖 Read","🧠 Review","✅ Finish"]
      ];
      plan=random[Math.floor(Math.random()*random.length)];
    }

    setTasks([...tasks,...plan.map(t=>({text:t,done:false}))]);
  };

  // ================= TASK =================
  const addTask=()=>{
    if(!input) return;
    setTasks([...tasks,{text:input}]);
    setInput("");
  };

  // ================= FOCUS MODE =================
  if(focusMode){
    return(
      <div style={styles.focus}>
        <h1>{Math.floor(time/60)}:{time%60}</h1>
        <button onClick={()=>setRunning(!running)}>
          {running?"Pause":"Start"}
        </button>
        <button onClick={()=>{setFocusMode(false); setDistractions(d=>d+1)}}>Exit</button>
      </div>
    );
  }

  // ================= MAIN =================
  return(
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>🔥 Focus</h3>
        <p>{user}</p>

        <p>Level {level}</p>
        <p>XP {xp}</p>

        <p>🔥 Streak {streak}</p>

        <button onClick={()=>setUser("")}>Logout</button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        <h1>👑 Dashboard</h1>

        {/* STATS */}
        <div style={styles.card}>
          <h3>📊 Overview</h3>
          <p>Focus Today: {focus} min</p>
          <p>Distractions: {distractions}</p>
        </div>

        {/* TIMER */}
        <div style={styles.card}>
          <h2>{Math.floor(time/60)}:{time%60}</h2>

          <button onClick={()=>setRunning(!running)}>
            {running?"Pause":"Start"}
          </button>

          <button onClick={()=>setFocusMode(true)}>
            🧘 Monk Mode
          </button>
        </div>

        {/* MOOD ✅ FIXED */}
        <div style={styles.card}>
          <h3>😊 Mood: {mood || "Not set"}</h3>

          <button onClick={()=>setMood("😊 Happy")}>😊</button>
          <button onClick={()=>setMood("😐 Normal")}>😐</button>
          <button onClick={()=>setMood("😴 Tired")}>😴</button>
        </div>

        {/* AZKAR */}
        <div style={styles.card}>
          <h3>🕌 ذكر</h3>
          <p>{zekr}</p>
        </div>

        {/* TASKS */}
        <div style={styles.card}>
          <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Task"/>
          <button onClick={addTask}>Add</button>

          <br/><br/>

          <input value={aiInput} onChange={(e)=>setAiInput(e.target.value)} placeholder="AI Plan"/>
          <button onClick={askAI}>🤖 AI</button>

          {tasks.map((t,i)=>(
            <div key={i}>{t.text}</div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ================= STYLES =================
const styles={
  container:{
    display:"flex",
    height:"100vh",
    background:"#020617",
    color:"white",
    fontFamily:"sans-serif"
  },
  sidebar:{
    width:"220px",
    background:"#052e2b",
    padding:"20px"
  },
  main:{
    flex:1,
    padding:"20px",
    background:"#020617"
  },
  card:{
    background:"rgba(255,255,255,0.05)",
    padding:"20px",
    marginBottom:"15px",
    borderRadius:"10px"
  },
  input:{
    padding:"10px",
    borderRadius:"6px",
    border:"none"
  },
  btn:{
    padding:"10px",
    background:"#10b981",
    border:"none",
    color:"white",
    borderRadius:"6px"
  },
  center:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column",
    background:"#020617",
    color:"white"
  },
  title:{color:"#10b981"},
  focus:{
    height:"100vh",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    background:"#000"
  }
};