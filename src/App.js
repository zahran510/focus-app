import React, { useState, useEffect } from "react";

export default function App(){

  // ✅ USER
  const [user,setUser]=useState(localStorage.getItem("user")||"");
  const [inputUser,setInputUser]=useState("");

  // ✅ TASKS
  const [tasks,setTasks]=useState(JSON.parse(localStorage.getItem("tasks"))||[]);
  const [taskInput,setTaskInput]=useState("");

  // ✅ TIMER
  const [time,setTime]=useState(1500);
  const [running,setRunning]=useState(false);

  // ✅ XP SYSTEM
  const [xp,setXp]=useState(Number(localStorage.getItem("xp"))||0);
  const [level,setLevel]=useState(1);
  const [streak,setStreak]=useState(Number(localStorage.getItem("streak"))||0);

  // ✅ AI
  const [aiInput,setAiInput]=useState("");

  // ✅ MODES
  const [focusMode,setFocusMode]=useState(false);

  // ✅ TRACKERS
  const [distractions,setDistractions]=useState(0);

  // ✅ AZKAR
  const [zekr,setZekr]=useState("");

  // ✅ SAVE DATA
  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
    localStorage.setItem("xp",xp);
    localStorage.setItem("streak",streak);
    localStorage.setItem("user",user);
  },[tasks,xp,streak,user]);

  // ✅ LEVEL SYSTEM
  useEffect(()=>{
    setLevel(Math.floor(xp/100)+1);
  },[xp]);

  // ✅ TIMER
  useEffect(()=>{
    if(running && time>0){
      const t=setInterval(()=>setTime(t=>t-1),1000);
      return ()=>clearInterval(t);
    }

    if(time===0){
      setRunning(false);
      setTime(1500);

      setXp(x=>x+50);
      setStreak(s=>s+1);

      alert("🔥 Session done +50 XP");
    }

  },[running,time]);

  // ✅ AZKAR
  useEffect(()=>{
    const list=[
      "سبحان الله",
      "الحمد لله",
      "الله أكبر",
      "لا إله إلا الله",
      "استغفر الله",
      "اللهم صل على محمد"
    ];

    const i=setInterval(()=>{
      const r=list[Math.floor(Math.random()*list.length)];
      setZekr(r);
    },5000);

    return ()=>clearInterval(i);
  },[]);

  // ✅ LOGIN
  if(!user){
    return(
      <div style={styles.center}>
        <h2>👋 Welcome</h2>
        <input value={inputUser} onChange={(e)=>setInputUser(e.target.value)} placeholder="Name"/>
        <button onClick={()=>setUser(inputUser)}>Start</button>
      </div>
    );
  }

  // ✅ ADD TASK
  const addTask=()=>{
    if(!taskInput) return;
    setTasks([...tasks,{text:taskInput}]);
    setTaskInput("");
  };

  // ✅ AI SMART (محسن ومتغير)
  const smartAI=()=>{
    const text=aiInput.toLowerCase();

    let plans=[];

    if(text.includes("امتحان")){
      plans=[
        "📖 Chapter 1",
        "☕ Break",
        "📘 Chapter 2",
        "🧠 Review",
        "✅ Practice"
      ];
    } else if(text.includes("3")){
      plans=[
        "📖 Study 1 (50 min)",
        "☕ Break",
        "📘 Study 2 (50 min)",
        "🧠 Review"
      ];
    } else {
      const randomPlans=[
        ["📚 Start","🧠 Review","✅ Finish"],
        ["📖 Read","🎯 Focus","✅ Done"]
      ];
      plans=randomPlans[Math.floor(Math.random()*randomPlans.length)];
    }

    setTasks([...tasks,...plans.map(p=>({text:p}))]);
  };

  // ✅ MONK MODE
  if(focusMode){
    return(
      <div style={styles.focus}>
        <h2>🧘 Monk Mode</h2>

        <h1>{Math.floor(time/60)}:{time%60}</h1>

        <button onClick={()=>setRunning(!running)}>
          {running?"Pause":"Start"}
        </button>

        <button onClick={()=>{
          setFocusMode(false);
          setDistractions(d=>d+1);
        }}>
          Exit
        </button>

        <p>🚫 Distractions: {distractions}</p>
      </div>
    );
  }

  return(
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>🔥 Focus System</h3>

        <p>👤 {user}</p>
        <p>🏆 Level {level}</p>
        <p>🔥 Streak {streak}</p>
        <p>⚡ XP {xp}</p>

        <button onClick={()=>setUser("")}>Logout</button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        <h1>👑 Dashboard</h1>

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

        {/* AZKAR */}
        <div style={styles.card}>
          <h3>🕌 ذكر</h3>
          <p>{zekr}</p>
        </div>

        {/* TASKS */}
        <div style={styles.card}>

          <input value={taskInput} onChange={(e)=>setTaskInput(e.target.value)} placeholder="Task"/>
          <button onClick={addTask}>Add</button>

          <br/><br/>

          <input value={aiInput} onChange={(e)=>setAiInput(e.target.value)} placeholder="AI plan"/>
          <button onClick={smartAI}>🤖 AI</button>

          {tasks.map((t,i)=>(
            <div key={i} style={styles.task}>{t.text}</div>
          ))}

        </div>

        {/* STATS */}
        <div style={styles.card}>
          <h3>📊 Stats</h3>
          <p>Distractions: {distractions}</p>
        </div>

      </div>
    </div>
  );
}

const styles={
  container:{display:"flex",height:"100vh",background:"#0f172a",color:"white"},
  sidebar:{width:"220px",background:"#020617",padding:"20px"},
  main:{flex:1,padding:"20px"},
  card:{background:"#1e293b",padding:"20px",marginBottom:"15px",borderRadius:"10px"},
  focus:{
    height:"100vh",
    background:"#000",
    color:"white",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center"
  },
  center:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column"
  },
  task:{marginTop:"5px"}
};