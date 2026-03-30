import { useState, useEffect, useCallback, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg0:#040812; --bg1:#080f22; --bg2:#0d1530;
    --card:rgba(13,21,48,0.9); --card2:rgba(18,28,60,0.7);
    --b0:rgba(99,102,241,0.10); --b1:rgba(99,102,241,0.22); --b2:rgba(99,102,241,0.45);
    --ind:#6366f1; --vio:#8b5cf6; --cya:#22d3ee;
    --grn:#10b981; --amb:#f59e0b; --red:#f43f5e; --pnk:#ec4899;
    --t0:#f1f5f9; --t1:#cbd5e1; --t2:#94a3b8; --t3:#64748b; --t4:#475569;
    --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:24px;
  }
  html,body,#root { min-height:100%; font-family:'Inter',-apple-system,sans-serif; background:var(--bg0); color:var(--t0); font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased; }
  button { font-family:inherit; cursor:pointer; border:none; background:none; }
  input,textarea,select { font-family:inherit; color:var(--t0); }
  textarea { resize:none; }
  input[type="range"] { accent-color:var(--ind); cursor:pointer; }
  ::placeholder { color:var(--t4); }
  :focus-visible { outline:2px solid var(--ind); outline-offset:2px; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--bg2); border-radius:4px; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes spin   { to{transform:rotate(360deg)} }

  .aU { animation:fadeUp .38s cubic-bezier(.16,1,.3,1) both; }
  .aI { animation:fadeIn .28s ease both; }

  .blob { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }
  .glass { background:var(--card); border:1px solid var(--b0); backdrop-filter:blur(20px); }
  .lxs { font-size:10px; font-weight:600; letter-spacing:.09em; text-transform:uppercase; color:var(--t2); }
  .grad { background:linear-gradient(135deg,var(--ind) 0%,var(--vio) 45%,var(--cya) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .badge { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:100px; font-size:10px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap; }
  .bi { background:rgba(99,102,241,.14); color:var(--ind); }
  .bg { background:rgba(16,185,129,.14);  color:var(--grn); }
  .ba { background:rgba(245,158,11,.14);  color:var(--amb); }
  .br { background:rgba(244,63,94,.14);   color:var(--red); }
  .bc { background:rgba(34,211,238,.14);  color:var(--cya); }
  .bv { background:rgba(139,92,246,.14);  color:var(--vio); }

  .btn-p {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    padding:9px 20px; border-radius:var(--r-md); font-weight:700; font-size:13px;
    color:#fff; border:none; background:linear-gradient(135deg,var(--ind),var(--vio));
    box-shadow:0 0 24px rgba(99,102,241,.28); transition:opacity .14s,transform .14s; white-space:nowrap;
  }
  .btn-p:hover { opacity:.88; transform:translateY(-1px); }
  .btn-p:active { transform:none; opacity:.8; }
  .btn-p:disabled { opacity:.4; cursor:not-allowed; transform:none; }

  .btn-s {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    padding:8px 18px; border-radius:var(--r-md); font-weight:600; font-size:13px;
    color:var(--t2); border:1px solid var(--b1); background:var(--card2);
    transition:border-color .14s,color .14s; white-space:nowrap;
  }
  .btn-s:hover { border-color:var(--b2); color:var(--t0); }

  .inp {
    width:100%; padding:9px 13px; border-radius:var(--r-md);
    background:rgba(0,0,0,.25); border:1px solid rgba(255,255,255,.07);
    color:var(--t0); font-size:13px; transition:border-color .14s;
  }
  .inp:focus { outline:none; border-color:var(--ind); }

  .tab-b {
    padding:10px 16px; font-size:13px; font-weight:500; border:none;
    color:var(--t3); background:none; cursor:pointer;
    border-bottom:2px solid transparent; transition:color .14s,border-color .14s;
    display:flex; align-items:center; gap:6px; white-space:nowrap;
  }
  .tab-b.on { color:var(--ind); border-bottom-color:var(--ind); }
  .tab-b:hover:not(.on) { color:var(--t1); }

  .nav-i {
    display:flex; align-items:center; gap:9px; padding:8px 11px;
    border-radius:var(--r-sm); font-size:13px; color:var(--t3);
    transition:background .13s,color .13s; border:none; cursor:pointer;
    width:100%; text-align:left;
  }
  .nav-i:hover { background:rgba(99,102,241,.08); color:var(--t1); }
  .nav-i.on { background:rgba(99,102,241,.14); color:var(--ind); font-weight:600; }

  .sbar-bg { flex:1; height:5px; border-radius:3px; background:rgba(255,255,255,.06); overflow:hidden; }
  .sbar-fill { height:100%; border-radius:3px; transition:width .7s cubic-bezier(.16,1,.3,1); }

  .pip-row { display:flex; align-items:center; gap:10px; padding:7px 0; font-size:13px; border-bottom:1px solid rgba(255,255,255,.03); transition:color .28s; }
  .pip-row:last-child { border-bottom:none; }
  .pip-done { color:var(--grn); }
  .pip-run  { color:var(--t0); }
  .pip-pend { color:var(--t4); }

  .twrap { position:relative; width:36px; height:20px; flex-shrink:0; }
  .twrap input { opacity:0; width:0; height:0; position:absolute; }
  .ttrack { position:absolute; inset:0; border-radius:10px; background:rgba(255,255,255,.1); cursor:pointer; transition:background .18s; }
  .ttrack::before { content:''; position:absolute; width:14px; height:14px; border-radius:50%; background:#fff; top:3px; left:3px; transition:transform .18s; }
  .twrap input:checked + .ttrack { background:var(--ind); }
  .twrap input:checked + .ttrack::before { transform:translateX(16px); }

  @media (max-width:860px) {
    .hide-m { display:none !important; }
    .sb { width:52px !important; }
    .sb .nlabel,.sb .sc-block { display:none !important; }
    .sb .nav-i { justify-content:center; padding:10px; }
  }
  @media (max-width:600px) {
    .g2 { grid-template-columns:1fr !important; }
    .g4 { grid-template-columns:repeat(2,1fr) !important; }
    .hbtns { flex-direction:column !important; }
    .sstrip { flex-wrap:wrap; }
    .sstrip > div { min-width:120px; }
    .tnlinks { display:none !important; }
  }
`;

// ─── constants ─────────────────────────────────────────────────────────────
const STEPS = [
  "Ingesting inputs","Parsing content","Extracting structured facts",
  "Normalizing fields & units","Retrieving evidence snippets",
  "Building comparison matrix","Running contradiction check",
  "Scoring entities","Generating recommendation","Building final report",
];
const PERSONAS = [
  {id:"developer",icon:"💻",lbl:"Developer"},
  {id:"investor",icon:"💹",lbl:"Investor"},
  {id:"student",icon:"🎓",lbl:"Student"},
  {id:"traveler",icon:"✈️",lbl:"Traveler"},
  {id:"business",icon:"🏢",lbl:"Business"},
  {id:"procurement",icon:"📋",lbl:"Procurement"},
];
const MODES = ["buy","migrate","apply","shortlist","validate","choose vendor"];
const ITYPES = [
  {id:"text",icon:"T",lbl:"Text"},
  {id:"url",icon:"🔗",lbl:"URL"},
  {id:"pdf",icon:"📄",lbl:"PDF"},
  {id:"image",icon:"🖼",lbl:"Img"},
  {id:"audio",icon:"🎙",lbl:"Audio"},
];
const NAV = [
  {id:"dashboard",icon:"⊞",lbl:"Dashboard"},
  {id:"compare",icon:"⊕",lbl:"New Comparison"},
  {id:"results",icon:"◳",lbl:"Results"},
  {id:"monitoring",icon:"◎",lbl:"Monitoring"},
  {id:"settings",icon:"⚙",lbl:"Settings"},
];

// ─── tiny helpers ─────────────────────────────────────────────────────────
function Dot({color="var(--grn)",size=7,pulse=true}) {
  return <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:color,flexShrink:0,animation:pulse?"pulse 2s infinite":"none"}} />;
}
function Spin({size=14,color="var(--ind)"}) {
  return <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",border:"2px solid rgba(255,255,255,.15)",borderTopColor:color,animation:"spin .6s linear infinite"}} />;
}
function barClr(s) { return s>=85?"var(--grn)":s>=68?"var(--ind)":"var(--amb)"; }

// ─── Logo ──────────────────────────────────────────────────────────────────
function Logo({onClick}) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:8,border:"none",background:"none"}}>
      <span style={{fontSize:20,color:"var(--ind)"}}>◈</span>
      <span style={{fontWeight:800,fontSize:15,color:"var(--t0)"}}>CompareIQ</span>
      <span style={{fontSize:9,fontWeight:800,letterSpacing:".1em",background:"linear-gradient(135deg,var(--ind),var(--cya))",padding:"2px 6px",borderRadius:4,color:"#fff"}}>AI</span>
    </button>
  );
}

// ─── TopNav ────────────────────────────────────────────────────────────────
function TopNav({page,setPage}) {
  return (
    <nav style={{position:"sticky",top:0,zIndex:200,height:54,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",background:"rgba(4,8,18,.93)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b0)"}}>
      <Logo onClick={()=>setPage("landing")} />
      <div className="tnlinks" style={{display:"flex",gap:2}}>
        {[["landing","Home"],["dashboard","Dashboard"],["compare","Compare"],["results","Results"],["monitoring","Monitor"]].map(([p,l])=>(
          <button key={p} onClick={()=>setPage(p)} style={{padding:"6px 12px",borderRadius:"var(--r-sm)",border:"none",fontSize:13,fontWeight:page===p?600:400,background:page===p?"rgba(99,102,241,.14)":"none",color:page===p?"var(--ind)":"var(--t3)",transition:"all .13s"}}>{l}</button>
        ))}
      </div>
      <button className="btn-p" style={{padding:"7px 16px",fontSize:12}} onClick={()=>setPage("compare")}>+ Compare</button>
    </nav>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({page,setPage}) {
  return (
    <aside className="sb" style={{width:210,flexShrink:0,background:"rgba(8,15,34,.95)",borderRight:"1px solid var(--b0)",display:"flex",flexDirection:"column",padding:"12px 8px 16px",height:"calc(100vh - 54px)",position:"sticky",top:54}}>
      <div style={{display:"flex",flexDirection:"column",gap:2,flex:1}}>
        {NAV.map(({id,icon,lbl})=>(
          <button key={id} className={`nav-i${page===id?" on":""}`} onClick={()=>setPage(id)}>
            <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{icon}</span>
            <span className="nlabel">{lbl}</span>
          </button>
        ))}
      </div>
      <div className="sc-block" style={{padding:"12px 10px",borderTop:"1px solid var(--b0)"}}>
        <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"var(--t4)"}}>Created by</div>
        <div style={{fontSize:12,fontWeight:700,color:"var(--ind)",marginTop:4}}>Raja Abimanyu N</div>
        <div style={{fontSize:10,color:"var(--t4)",marginTop:2}}>Data Scientist · AI/ML</div>
      </div>
    </aside>
  );
}

function Layout({page,setPage,children}) {
  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 54px)"}}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>{children}</main>
    </div>
  );
}

// ─── LivePipelineCard ─────────────────────────────────────────────────────
function LivePipelineCard() {
  const [step,setStep] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setStep(s=>(s+1)%STEPS.length),860);
    return ()=>clearInterval(t);
  },[]);
  return (
    <div className="glass" style={{borderRadius:"var(--r-xl)",overflow:"hidden",maxWidth:500,width:"100%",boxShadow:"0 20px 70px rgba(0,0,0,.45)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:"1px solid var(--b0)",background:"rgba(99,102,241,.05)"}}>
        <div style={{display:"flex",gap:5}}>{["#f43f5e","#f59e0b","#10b981"].map(c=><span key={c} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}</div>
        <span style={{fontSize:11,color:"var(--t3)"}}>Live Pipeline — MacBook Pro M4 vs Dell XPS 15</span>
      </div>
      <div style={{padding:"14px 18px"}}>
        {STEPS.map((s,i)=>{
          const st = i<step?"done":i===step?"run":"pend";
          return (
            <div key={s} className={`pip-row pip-${st}`}>
              <span style={{width:14,fontSize:11,textAlign:"center",flexShrink:0,color:st==="done"?"var(--grn)":st==="run"?"var(--ind)":undefined}}>
                {st==="done"?"✓":st==="run"?"◉":"○"}
              </span>
              <span style={{flex:1}}>{s}</span>
              {st==="run"&&<span style={{display:"flex",gap:3}}>{[0,1,2].map(d=><span key={d} style={{width:5,height:5,borderRadius:"50%",background:"var(--ind)",display:"inline-block",animation:`pulse 1s ${d*.18}s infinite`}}/>)}</span>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:10,padding:"11px 16px",borderTop:"1px solid var(--b0)",background:"rgba(16,185,129,.04)"}}>
        {[["🏆 Winner","MacBook Pro M4","92","rgba(16,185,129,.3)","rgba(16,185,129,.07)","var(--grn)"],["Contender","Dell XPS 15","78","var(--b0)","rgba(255,255,255,.02)","var(--t3)"]].map(([lbl,name,score,bc,bg,tc])=>(
          <div key={name} style={{flex:1,padding:"9px 12px",borderRadius:"var(--r-sm)",border:`1px solid ${bc}`,background:bg}}>
            <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".08em",color:tc}}>{lbl}</div>
            <div style={{fontSize:13,fontWeight:700,marginTop:3}}>{name}</div>
            <div style={{fontSize:12,color:tc,fontWeight:700}}>{score} / 100</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LandingPage ──────────────────────────────────────────────────────────
function LandingPage({setPage}) {
  const feats = [
    ["⚡","Real-Time Pipeline","10 AI agents stream live — ingest, extract, score, recommend."],
    ["📎","5 Input Types","Text, PDF, URL, image, audio — any format, unified analysis."],
    ["⚖️","Weighted Scoring","Define what matters. Criteria weights shape every result."],
    ["🧠","Contradiction Detection","Conflicting claims across sources flagged with severity ratings."],
    ["🎭","Persona-Aware","Developer, investor, student — persona adjusts the lens."],
    ["📡","Live Monitoring","Alerts when prices, content, or policies shift."],
  ];
  const cases = [
    ["MacBook Pro M4 vs Dell XPS 15","Product"],
    ["Canada vs Germany — Data Scientists","Country"],
    ["Contract A vs Contract B","Document"],
    ["Audio pitch vs Investor Deck","Cross-Modal"],
    ["Resume vs Job Description","Fit Analysis"],
    ["OpenAI vs Groq API","Vendor"],
  ];
  return (
    <div style={{minHeight:"100vh",overflowX:"hidden"}}>
      {/* Hero */}
      <section style={{position:"relative",overflow:"hidden",minHeight:"88vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 24px 60px",gap:40}}>
        <div className="blob" style={{width:560,height:400,top:"5%",left:"12%",background:"radial-gradient(ellipse,rgba(99,102,241,.18),transparent 70%)"}}/>
        <div className="blob" style={{width:400,height:380,top:"35%",right:"8%",background:"radial-gradient(ellipse,rgba(139,92,246,.14),transparent 70%)"}}/>
        <div className="blob" style={{width:480,height:280,bottom:"10%",left:"28%",background:"radial-gradient(ellipse,rgba(34,211,238,.1),transparent 70%)"}}/>

        <div className="aU" style={{maxWidth:720,position:"relative",zIndex:2}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:100,border:"1px solid rgba(99,102,241,.3)",background:"rgba(99,102,241,.08)",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--ind)",marginBottom:24}}>
            <Dot color="var(--ind)" size={6}/> Real-Time · Multimodal · Explainable AI
          </div>
          <h1 style={{fontSize:"clamp(2.6rem,6vw,5rem)",fontWeight:900,lineHeight:1.06,letterSpacing:"-.03em",marginBottom:20}}>
            <span style={{display:"block"}}>Compare anything.</span>
            <span className="grad">Decide faster.</span>
          </h1>
          <p style={{fontSize:16,color:"var(--t2)",lineHeight:1.75,maxWidth:560,margin:"0 auto 28px"}}>
            CompareIQ AI ingests PDFs, URLs, audio, and images — then applies a 10-node LangGraph agent pipeline to extract, score, and recommend with full evidence grounding.
          </p>
          <div className="hbtns" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn-p" style={{padding:"12px 28px",fontSize:14}} onClick={()=>setPage("compare")}>Start Comparing →</button>
            <button className="btn-s" style={{padding:"12px 24px",fontSize:14}} onClick={()=>setPage("dashboard")}>View Dashboard</button>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginTop:22,flexWrap:"wrap"}}>
            {[["var(--grn)","Groq fast extraction"],["var(--cya)","OpenAI deep reasoning"],["var(--vio)","LangGraph orchestration"]].map(([c,l])=>(
              <span key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--t4)"}}>
                <Dot color={c} size={5}/>{l}
              </span>
            ))}
          </div>
        </div>

        <div style={{position:"relative",zIndex:2,width:"100%",display:"flex",justifyContent:"center"}}>
          <LivePipelineCard/>
        </div>
      </section>

      {/* Stats */}
      <div className="sstrip" style={{display:"flex",borderTop:"1px solid var(--b0)",borderBottom:"1px solid var(--b0)",background:"rgba(99,102,241,.03)"}}>
        {[["10","AI Agents"],["5","Input Types"],["8","Domains"],["100%","Evidence-Grounded"]].map(([n,l])=>(
          <div key={l} style={{flex:1,padding:"26px 20px",textAlign:"center",borderRight:"1px solid var(--b0)"}}>
            <div className="grad" style={{fontSize:"2.1rem",fontWeight:900}}>{n}</div>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Use cases */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"70px 24px 40px"}}>
        <div className="lxs" style={{marginBottom:10}}>What you can compare</div>
        <h2 style={{fontSize:"clamp(1.6rem,3.5vw,2.5rem)",fontWeight:800,letterSpacing:"-.02em",marginBottom:26}}>Any input. Any domain.</h2>
        <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:9}}>
          {cases.map(([lbl,tag])=>(
            <button key={lbl} onClick={()=>setPage("compare")} className="glass" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderRadius:"var(--r-md)",color:"var(--t0)",textAlign:"left",transition:"border-color .14s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--b2)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b0)"}>
              <span className="badge bi">{tag}</span>
              <span style={{fontSize:13,fontWeight:500,flex:1,padding:"0 12px"}}>{lbl}</span>
              <span style={{color:"var(--t4)"}}>↗</span>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 70px"}}>
        <div className="lxs" style={{marginBottom:10}}>Core capabilities</div>
        <h2 style={{fontSize:"clamp(1.6rem,3.5vw,2.5rem)",fontWeight:800,letterSpacing:"-.02em",marginBottom:26}}>Decision intelligence, built for depth.</h2>
        <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:12}}>
          {feats.map(([icon,title,desc])=>(
            <div key={title} className="glass" style={{padding:24,borderRadius:"var(--r-lg)",transition:"border-color .14s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--b2)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b0)"}>
              <span style={{fontSize:24,display:"block",marginBottom:13}}>{icon}</span>
              <div style={{fontSize:14,fontWeight:700,marginBottom:7}}>{title}</div>
              <div style={{fontSize:13,color:"var(--t2)",lineHeight:1.65}}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{textAlign:"center",padding:"70px 24px",borderTop:"1px solid var(--b0)",position:"relative",overflow:"hidden"}}>
        <div className="blob" style={{width:600,height:300,top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"radial-gradient(ellipse,rgba(99,102,241,.15),transparent 70%)"}}/>
        <div style={{position:"relative",zIndex:2}}>
          <h2 style={{fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,letterSpacing:"-.03em",marginBottom:16}}>Stop guessing.<br/>Start comparing.</h2>
          <p style={{fontSize:15,color:"var(--t2)",maxWidth:420,margin:"0 auto 26px",lineHeight:1.75}}>Upload any two things. Get a structured, evidence-grounded AI decision in seconds.</p>
          <button className="btn-p" style={{fontSize:15,padding:"14px 36px"}} onClick={()=>setPage("compare")}>Launch CompareIQ AI →</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,padding:"16px 24px",borderTop:"1px solid var(--b0)",background:"rgba(4,8,18,.9)",fontSize:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:800}}><span style={{color:"var(--ind)"}}>◈</span> CompareIQ AI</div>
        <div style={{textAlign:"center",color:"var(--t4)"}}>
          Created by <span style={{color:"var(--ind)",fontWeight:600}}>Raja Abimanyu N</span>
          <span style={{display:"block",fontSize:10,marginTop:2}}>Data Scientist | AI & Applied Machine Learning</span>
        </div>
        <div style={{color:"var(--t4)"}}>Compare anything. Decide faster.</div>
      </footer>
    </div>
  );
}

// ─── DashboardPage ────────────────────────────────────────────────────────
function DashboardPage({setPage}) {
  const recent = [
    {title:"MacBook Pro M4 vs Dell XPS 15",tags:["Product","Tech"],winner:"MacBook Pro M4",score:92,ago:"2h ago",status:"done"},
    {title:"Canada vs Germany — Data Scientists",tags:["Country","Career"],winner:"Germany",score:88,ago:"1d ago",status:"done"},
    {title:"Contract A vs Contract B",tags:["Document","Legal"],winner:null,score:null,ago:"5m ago",status:"running"},
    {title:"OpenAI vs Groq API Pricing",tags:["Vendor","API"],winner:"Groq",score:79,ago:"3d ago",status:"done"},
  ];
  const quick = [{icon:"📦",lbl:"Compare Products",desc:"URLs, specs, images"},{icon:"🌍",lbl:"Compare Countries",desc:"Relocation & career"},{icon:"📄",lbl:"Compare Documents",desc:"PDFs, contracts"},{icon:"🎙️",lbl:"Audio vs Document",desc:"Cross-modal validation"}];
  return (
    <div style={{padding:"26px 24px",maxWidth:900}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <p style={{fontSize:12,color:"var(--t3)",marginBottom:4}}>Good afternoon, Raja 👋</p>
          <h1 style={{fontSize:23,fontWeight:900,letterSpacing:"-.02em"}}>Your Decision Hub</h1>
        </div>
        <button className="btn-p" onClick={()=>setPage("compare")}>+ New Comparison</button>
      </div>

      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
        {[["4","var(--ind)","Comparisons"],["1","var(--amb)","In Progress"],["2","var(--cya)","Monitored"],["12","var(--grn)","Evidence Sources"]].map(([n,c,l])=>(
          <div key={l} className="glass" style={{padding:"16px 15px",borderRadius:"var(--r-md)"}}>
            <div style={{fontSize:"1.9rem",fontWeight:900,color:c}}>{n}</div>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      <section style={{marginBottom:24}}>
        <h2 style={{fontSize:13,fontWeight:700,marginBottom:11}}>Start a comparison</h2>
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {quick.map(({icon,lbl,desc})=>(
            <button key={lbl} onClick={()=>setPage("compare")} className="glass" style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:"var(--r-md)",color:"var(--t0)",textAlign:"left",transition:"border-color .13s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--b2)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b0)"}>
              <span style={{fontSize:20,flexShrink:0}}>{icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lbl}</div>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{desc}</div>
              </div>
              <span style={{color:"var(--t4)",flexShrink:0}}>→</span>
            </button>
          ))}
        </div>
      </section>

      <section style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
          <h2 style={{fontSize:13,fontWeight:700}}>Recent comparisons</h2>
          <button style={{fontSize:12,color:"var(--ind)"}}>See all →</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {recent.map(r=>(
            <button key={r.title} onClick={()=>setPage("results")} className="glass" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderRadius:"var(--r-md)",color:"var(--t0)",textAlign:"left",width:"100%",gap:12,transition:"border-color .13s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--b2)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b0)"}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:5,marginBottom:5,flexWrap:"wrap"}}>
                  {r.tags.map(t=><span key={t} className="badge bi">{t}</span>)}
                </div>
                <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title}</div>
                <div style={{fontSize:11,color:"var(--t4)",marginTop:3}}>{r.ago}</div>
              </div>
              <div style={{flexShrink:0}}>
                {r.status==="running"
                  ? <span style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--amb)",fontWeight:600}}><Dot color="var(--amb)" size={6}/>Processing</span>
                  : <div style={{textAlign:"right"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"var(--grn)"}}>🏆 {r.winner}</div>
                      <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{r.score}/100</div>
                    </div>
                }
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
          <h2 style={{fontSize:13,fontWeight:700}}>Live monitoring</h2>
          <button onClick={()=>setPage("monitoring")} style={{fontSize:12,color:"var(--ind)"}}>Manage →</button>
        </div>
        {[{name:"iPhone 16 vs Pixel 9 Pro",last:"1h ago",changes:2},{name:"AWS vs Azure Enterprise",last:"3h ago",changes:0}].map(m=>(
          <div key={m.name} className="glass" style={{display:"flex",alignItems:"center",gap:12,padding:"12px 15px",borderRadius:"var(--r-md)",marginBottom:7}}>
            <Dot color="var(--cya)" size={7}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
              <div style={{fontSize:11,color:"var(--t4)",marginTop:2}}>Last checked {m.last}</div>
            </div>
            {m.changes>0?<span className="badge ba">{m.changes} changes</span>:<span className="badge bg">No changes</span>}
          </div>
        ))}
      </section>
    </div>
  );
}

// ─── EntityCard ───────────────────────────────────────────────────────────
function EntityCard({idx,label,setLabel,itype,setItype,content,setContent,canRemove,onRemove}) {
  const alpha = String.fromCharCode(65+idx);
  return (
    <div className="glass" style={{padding:16,borderRadius:"var(--r-lg)",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:26,height:26,borderRadius:7,flexShrink:0,background:"rgba(99,102,241,.18)",color:"var(--ind)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{alpha}</span>
        <input className="inp" style={{background:"none",border:"none",padding:0,fontWeight:600,flex:1}} placeholder={`Option ${alpha}`} value={label} onChange={e=>setLabel(e.target.value)}/>
        {canRemove&&<button onClick={onRemove} style={{width:24,height:24,borderRadius:6,border:"1px solid var(--b0)",color:"var(--t4)",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"color .13s,border-color .13s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="var(--red)";e.currentTarget.style.borderColor="var(--red)"}}
          onMouseLeave={e=>{e.currentTarget.style.color="var(--t4)";e.currentTarget.style.borderColor="var(--b0)"}}>✕</button>}
      </div>
      <div style={{display:"flex",gap:4}}>
        {ITYPES.map(({id,icon,lbl})=>(
          <button key={id} onClick={()=>setItype(id)} style={{flex:1,padding:"5px 2px",borderRadius:6,border:"1px solid",fontSize:10,display:"flex",flexDirection:"column",alignItems:"center",gap:2,borderColor:itype===id?"var(--ind)":"var(--b0)",background:itype===id?"rgba(99,102,241,.14)":"none",color:itype===id?"var(--ind)":"var(--t4)",transition:"all .13s"}}>
            <span style={{fontSize:12}}>{icon}</span>{lbl}
          </button>
        ))}
      </div>
      {(itype==="text"||itype==="url")
        ? <textarea className="inp" rows={3} placeholder={itype==="url"?"https://example.com":"Paste or type content here…"} value={content} onChange={e=>setContent(e.target.value)}/>
        : <div style={{border:"1px dashed rgba(99,102,241,.3)",borderRadius:"var(--r-sm)",padding:"20px 12px",textAlign:"center",cursor:"pointer",background:"rgba(99,102,241,.04)",transition:"border-color .13s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--ind)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(99,102,241,.3)"}>
            <div style={{fontSize:22,marginBottom:6}}>{itype==="pdf"?"📄":itype==="image"?"🖼":"🎙"}</div>
            <div style={{fontSize:12,color:"var(--t3)"}}>Click to upload {itype.toUpperCase()}</div>
            <div style={{fontSize:10,color:"var(--t4)",marginTop:3}}>or drag and drop</div>
          </div>
      }
    </div>
  );
}

// ─── ComparePage ──────────────────────────────────────────────────────────
function ComparePage({setPage}) {
  const [tab,setTab] = useState("setup");
  const [entities,setEntities] = useState([
    {id:1,label:"MacBook Pro M4",itype:"url",content:"https://apple.com/macbook-pro"},
    {id:2,label:"Dell XPS 15",itype:"url",content:"https://dell.com/xps-15"},
  ]);
  const [persona,setPersona] = useState("developer");
  const [mode,setMode] = useState("buy");
  const [weights,setWeights] = useState({Performance:40,Price:30,"Build Quality":20,"Battery Life":10});
  const [intent,setIntent] = useState("I want to buy a laptop for ML development under ₹1.5 lakh with good battery life.");
  const [stepIdx,setStepIdx] = useState(-1);
  const [running,setRunning] = useState(false);
  const [done,setDone] = useState(false);
  const nxt = useRef(3);
  const tmr = useRef(null);

  const addEntity = () => {
    if(entities.length>=5) return;
    setEntities(p=>[...p,{id:nxt.current++,label:"",itype:"text",content:""}]);
  };
  const updEntity = useCallback((id,k,v)=>setEntities(p=>p.map(e=>e.id===id?{...e,[k]:v}:e)),[]);
  const delEntity = useCallback(id=>setEntities(p=>p.filter(e=>e.id!==id)),[]);

  const run = () => {
    if(running) return;
    clearInterval(tmr.current);
    setRunning(true); setDone(false); setStepIdx(0); setTab("pipeline");
    let i=0;
    tmr.current = setInterval(()=>{
      i++;
      setStepIdx(i);
      if(i>=STEPS.length-1){
        clearInterval(tmr.current);
        setDone(true); setRunning(false);
        setTimeout(()=>setTab("results"),600);
      }
    },700);
  };
  useEffect(()=>()=>clearInterval(tmr.current),[]);

  const totalW = Object.values(weights).reduce((a,b)=>a+b,0);

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"calc(100vh - 54px)"}}>
      <div style={{display:"flex",borderBottom:"1px solid var(--b0)",padding:"0 24px",background:"rgba(8,15,34,.6)",flexShrink:0,overflowX:"auto"}}>
        {[{id:"setup",lbl:"Setup"},{id:"pipeline",lbl:"Pipeline",dot:running},{id:"results",lbl:"Results",dot:done,dotColor:"var(--grn)"}].map(({id,lbl,dot,dotColor})=>(
          <button key={id} className={`tab-b${tab===id?" on":""}`} onClick={()=>setTab(id)}>
            {lbl}{dot&&<Dot color={dotColor||"var(--amb)"} size={6}/>}
          </button>
        ))}
      </div>

      <div style={{flex:1,padding:24,overflowY:"auto"}}>
        {/* SETUP */}
        {tab==="setup"&&(
          <div className="aU" style={{display:"flex",flexDirection:"column",gap:20,maxWidth:900}}>
            <div>
              <div className="lxs" style={{marginBottom:7}}>What are you trying to decide?</div>
              <textarea className="inp" rows={2} value={intent} onChange={e=>setIntent(e.target.value)} placeholder="e.g. I want to choose the best laptop for ML work under ₹1.5 lakh"/>
            </div>

            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                <div className="lxs">Entities to compare ({entities.length} / 5)</div>
                <button onClick={addEntity} disabled={entities.length>=5} style={{fontSize:11,fontWeight:700,color:"var(--ind)",background:"rgba(99,102,241,.12)",border:"1px solid var(--b1)",padding:"4px 10px",borderRadius:6,opacity:entities.length>=5?.4:1,cursor:entities.length>=5?"not-allowed":"pointer"}}>+ Add Entity</button>
              </div>
              <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
                {entities.map((e,i)=>(
                  <EntityCard key={e.id} idx={i} label={e.label} setLabel={v=>updEntity(e.id,"label",v)}
                    itype={e.itype} setItype={v=>updEntity(e.id,"itype",v)}
                    content={e.content} setContent={v=>updEntity(e.id,"content",v)}
                    canRemove={entities.length>2} onRemove={()=>delEntity(e.id)}/>
                ))}
              </div>
            </div>

            <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr auto",gap:18,alignItems:"start"}}>
              <div>
                <div className="lxs" style={{marginBottom:9}}>Your persona</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {PERSONAS.map(({id,icon,lbl})=>(
                    <button key={id} onClick={()=>setPersona(id)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:"var(--r-sm)",fontSize:12,border:"1px solid",borderColor:persona===id?"var(--ind)":"var(--b0)",background:persona===id?"rgba(99,102,241,.14)":"var(--card2)",color:persona===id?"var(--ind)":"var(--t3)",fontWeight:persona===id?600:400,transition:"all .13s"}}>
                      <span>{icon}</span>{lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{minWidth:155}}>
                <div className="lxs" style={{marginBottom:9}}>Decision mode</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {MODES.map(m=>(
                    <button key={m} onClick={()=>setMode(m)} style={{padding:"7px 13px",borderRadius:"var(--r-sm)",fontSize:12,textAlign:"left",border:"1px solid",borderColor:mode===m?"var(--ind)":"var(--b0)",background:mode===m?"rgba(99,102,241,.14)":"var(--card2)",color:mode===m?"var(--ind)":"var(--t3)",fontWeight:mode===m?600:400,transition:"all .13s"}}>{m}</button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                <div className="lxs">Scoring weights</div>
                <span style={{fontSize:11,color:totalW===100?"var(--grn)":"var(--amb)"}}>Total: {totalW}%</span>
              </div>
              <div className="glass" style={{padding:16,borderRadius:"var(--r-md)",display:"flex",flexDirection:"column",gap:11}}>
                {Object.entries(weights).map(([k,v])=>(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{width:110,fontSize:13,color:"var(--t1)",flexShrink:0}}>{k}</span>
                    <input type="range" min={0} max={100} step={5} value={v} onChange={e=>setWeights(w=>({...w,[k]:+e.target.value}))} style={{flex:1}}/>
                    <span style={{width:34,fontSize:12,color:"var(--t3)",textAlign:"right",fontFamily:"'JetBrains Mono',monospace"}}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-p" onClick={run} disabled={running} style={{padding:"12px 32px",fontSize:14,alignSelf:"flex-start"}}>
              {running?<><Spin size={14}/> Comparing…</>:"⚡ Run Comparison"}
            </button>
          </div>
        )}

        {/* PIPELINE */}
        {tab==="pipeline"&&(
          <div className="aI">
            <div className="glass" style={{maxWidth:560,borderRadius:"var(--r-lg)",padding:22}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,fontSize:13,fontWeight:700,color:"var(--ind)"}}>
                {running?<Spin size={14}/>:<span style={{color:"var(--grn)"}}>✓</span>}
                AI Pipeline {running?"— Running":"— Complete"}
              </div>
              {STEPS.map((s,i)=>{
                const st=i<stepIdx?"done":i===stepIdx?"run":"pend";
                return (
                  <div key={s} className={`pip-row pip-${st}`}>
                    <span style={{width:14,fontSize:11,textAlign:"center",flexShrink:0,color:st==="done"?"var(--grn)":st==="run"?"var(--ind)":undefined}}>
                      {st==="done"?"✓":st==="run"?"◉":"○"}
                    </span>
                    <span style={{flex:1}}>{s}</span>
                    {st==="run"&&<span style={{display:"flex",gap:3}}>{[0,1,2].map(d=><span key={d} style={{width:5,height:5,borderRadius:"50%",background:"var(--ind)",display:"inline-block",animation:`pulse 1s ${d*.18}s infinite`}}/>)}</span>}
                  </div>
                );
              })}
              {done&&<div style={{marginTop:16,padding:"11px 14px",borderRadius:"var(--r-sm)",background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.25)",fontSize:13,color:"var(--grn)",fontWeight:600}}>✓ Analysis complete — switching to results…</div>}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {tab==="results"&&(
          <div className="aI" style={{maxWidth:900}}>
            {!done
              ? <div style={{textAlign:"center",padding:"4rem 0",color:"var(--t3)"}}>
                  <p style={{marginBottom:16}}>Run a comparison first to see results.</p>
                  <button className="btn-s" onClick={()=>setTab("setup")}>← Go to Setup</button>
                </div>
              : <>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:12}}>
                    <div>
                      <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"var(--grn)",marginBottom:4}}>Analysis complete</div>
                      <h2 style={{fontSize:21,fontWeight:900,letterSpacing:"-.02em"}}>Comparison Results</h2>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn-s" style={{fontSize:12}}>📄 PDF</button>
                      <button className="btn-s" style={{fontSize:12}}>📝 MD</button>
                      <button className="btn-p" style={{fontSize:12}} onClick={()=>setPage("results")}>Full View →</button>
                    </div>
                  </div>

                  <div className="glass" style={{display:"flex",alignItems:"center",gap:18,padding:"18px 20px",borderRadius:"var(--r-lg)",marginBottom:14,border:"1px solid rgba(16,185,129,.25)",background:"rgba(16,185,129,.05)"}}>
                    <span style={{fontSize:34,flexShrink:0}}>🏆</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"var(--grn)"}}>Recommended Choice</div>
                      <div style={{fontSize:19,fontWeight:900,margin:"4px 0"}}>{entities[0]?.label||"Option A"}</div>
                      <div style={{fontSize:12,color:"var(--t2)"}}>Best overall for {persona} persona in {mode} mode.</div>
                    </div>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:"2.5rem",fontWeight:900,color:"var(--grn)",lineHeight:1}}>92</div>
                      <div style={{fontSize:11,color:"var(--t3)"}}>/ 100</div>
                    </div>
                  </div>

                  <div className="glass" style={{borderRadius:"var(--r-lg)",overflow:"hidden",marginBottom:14}}>
                    <div style={{display:"grid",gridTemplateColumns:`120px repeat(${entities.length},1fr)`,padding:"10px 16px",background:"rgba(99,102,241,.08)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"var(--t3)"}}>
                      <span>Criterion</span>
                      {entities.map((e,i)=><span key={e.id}>{e.label||`Option ${String.fromCharCode(65+i)}`}</span>)}
                    </div>
                    {Object.keys(weights).map((k,ri)=>{
                      const scores=entities.map(()=>Math.floor(55+Math.random()*45));
                      return (
                        <div key={k} style={{display:"grid",gridTemplateColumns:`120px repeat(${entities.length},1fr)`,padding:"11px 16px",borderTop:"1px solid var(--b0)",alignItems:"center"}}>
                          <span style={{fontSize:13}}>{k}</span>
                          {scores.map((s,i)=>(
                            <span key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                              <span className="sbar-bg"><span className="sbar-fill" style={{width:`${s}%`,background:barClr(s)}}/></span>
                              <span style={{fontSize:12,fontWeight:700,width:24,textAlign:"right"}}>{s}</span>
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:18}}>
                    {[["Confidence","87%","var(--grn)"],["Completeness","74%","var(--ind)"],["Freshness","91%","var(--cya)"],["Contradictions","1","var(--amb)"]].map(([l,v,c])=>(
                      <div key={l} className="glass" style={{padding:"11px 16px",borderRadius:"var(--r-md)"}}>
                        <div style={{fontSize:"1.4rem",fontWeight:900,color:c}}>{v}</div>
                        <div style={{fontSize:10,color:"var(--t4)",marginTop:3}}>{l}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="lxs" style={{marginBottom:9}}>Follow-up questions</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {["Why did Option A win?","Re-rank by price only","Compare for India market","Summarize for executives"].map(q=>(
                        <button key={q} style={{padding:"7px 14px",borderRadius:100,fontSize:12,background:"var(--card2)",border:"1px solid var(--b0)",color:"var(--t3)",transition:"all .13s"}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--b2)";e.currentTarget.style.color="var(--ind)"}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b0)";e.currentTarget.style.color="var(--t3)"}}>{q}</button>
                      ))}
                    </div>
                  </div>
                </>
            }
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ResultsPage ──────────────────────────────────────────────────────────
function ResultsPage({setPage}) {
  const [tab,setTab] = useState("summary");
  const criteria=[["ML Performance",92,74],["Price Value",65,88],["Build Quality",95,80],["Battery Life",88,62],["Software",90,72],["Support",85,78]];
  const evidence=[
    {txt:"Apple M4 chip delivers up to 38% faster performance in ML workloads.",src:"apple.com",type:"URL",conf:92},
    {txt:"MacBook Pro battery life rated at 24 hours under standard video playback.",src:"apple.com",type:"URL",conf:95},
    {txt:"Dell XPS 15 starts at $1,299 with Intel Core Ultra 7 and optional OLED display.",src:"dell.com",type:"URL",conf:88},
    {txt:"Review recorded average 11.5-hour real-world battery in mixed workloads.",src:"Uploaded PDF",type:"PDF",conf:84},
  ];
  const RTABS=[{id:"summary",lbl:"Summary"},{id:"scoring",lbl:"Scoring"},{id:"evidence",lbl:"Evidence"},{id:"contradictions",lbl:"Contradictions"},{id:"recommendation",lbl:"Recommendation"}];

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"calc(100vh - 54px)"}}>
      <div style={{background:"rgba(16,185,129,.05)",borderBottom:"1px solid rgba(16,185,129,.15)",padding:"0 24px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:16,padding:"13px 0",flexWrap:"wrap"}}>
          <span style={{fontSize:26}}>🏆</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"var(--grn)"}}>Recommended · Developer · Buy Mode</div>
            <div style={{fontSize:17,fontWeight:900}}>MacBook Pro M4</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["MacBook Pro M4","92",true],["Dell XPS 15","78",false]].map(([name,score,win])=>(
              <div key={name} style={{padding:"7px 13px",borderRadius:"var(--r-md)",textAlign:"center",border:`1px solid ${win?"rgba(16,185,129,.4)":"var(--b0)"}`,background:win?"rgba(16,185,129,.07)":"var(--card2)"}}>
                <div style={{fontSize:10,color:win?"var(--grn)":"var(--t3)"}}>{name}</div>
                <div style={{fontSize:19,fontWeight:900,color:win?"var(--grn)":"var(--t0)"}}>{score}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:7,flexShrink:0}}>
            <button className="btn-s" style={{fontSize:11}}>📄 PDF</button>
            <button className="btn-s" style={{fontSize:11}}>📝 MD</button>
          </div>
        </div>
      </div>

      <div style={{display:"flex",borderBottom:"1px solid var(--b0)",padding:"0 24px",background:"rgba(8,15,34,.5)",flexShrink:0,overflowX:"auto"}}>
        {RTABS.map(({id,lbl})=>(
          <button key={id} className={`tab-b${tab===id?" on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>

      <div style={{flex:1,padding:24,overflowY:"auto"}}>
        {/* SUMMARY */}
        {tab==="summary"&&(
          <div className="aI" style={{display:"flex",flexDirection:"column",gap:14,maxWidth:900}}>
            <div className="glass" style={{padding:20,borderRadius:"var(--r-lg)"}}>
              <div className="lxs" style={{marginBottom:9}}>Executive Summary</div>
              <p style={{fontSize:14,lineHeight:1.8,color:"var(--t1)"}}>
                Based on analysis across <strong style={{color:"var(--t0)"}}>6 weighted criteria</strong> using 8 evidence sources, the <strong style={{color:"var(--t0)"}}>MacBook Pro M4</strong> is the clear recommendation for a developer in buy mode. It leads in ML performance (92 vs 74), build quality (95 vs 80), battery life (88 vs 62), and software ecosystem (90 vs 72). The Dell XPS 15 holds an advantage on price (88 vs 65). <span style={{color:"var(--amb)"}}>1 contradiction was detected</span> — around battery life claims.
              </p>
            </div>
            <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{padding:17,borderRadius:"var(--r-md)",background:"rgba(16,185,129,.06)",border:"1px solid rgba(16,185,129,.2)"}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--grn)",marginBottom:9}}>✅ Pros</div>
                {["Best-in-class M4 performance","Industry-leading battery life","Unified memory architecture","Excellent macOS ecosystem","Premium build quality"].map(p=>(
                  <div key={p} style={{fontSize:12,color:"var(--grn)",padding:"3px 0"}}>✓ {p}</div>
                ))}
              </div>
              <div style={{padding:17,borderRadius:"var(--r-md)",background:"rgba(244,63,94,.04)",border:"1px solid rgba(244,63,94,.15)"}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--red)",marginBottom:9}}>⚠ Cons</div>
                {["Premium price point","Limited port selection","No touchscreen support","Locked Apple ecosystem"].map(c=>(
                  <div key={c} style={{fontSize:12,color:"var(--red)",padding:"3px 0"}}>✗ {c}</div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[["Confidence","87%","var(--grn)"],["Completeness","74%","var(--ind)"],["Freshness","91%","var(--cya)"],["Contradictions","1","var(--amb)"],["Sources","8","var(--vio)"]].map(([l,v,c])=>(
                <div key={l} className="glass" style={{padding:"11px 16px",borderRadius:"var(--r-md)"}}>
                  <div style={{fontSize:"1.4rem",fontWeight:900,color:c}}>{v}</div>
                  <div style={{fontSize:10,color:"var(--t4)",marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCORING */}
        {tab==="scoring"&&(
          <div className="aI" style={{maxWidth:900}}>
            <div className="glass" style={{borderRadius:"var(--r-lg)",overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"130px 1fr 1fr 70px",padding:"10px 16px",background:"rgba(99,102,241,.08)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"var(--t3)"}}>
                <span>Criterion</span><span>MacBook Pro M4</span><span>Dell XPS 15</span><span>Edge</span>
              </div>
              {criteria.map(([c,a,b])=>(
                <div key={c} style={{display:"grid",gridTemplateColumns:"130px 1fr 1fr 70px",padding:"12px 16px",borderTop:"1px solid var(--b0)",alignItems:"center"}}>
                  <span style={{fontSize:13}}>{c}</span>
                  {[a,b].map((s,i)=>(
                    <span key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span className="sbar-bg"><span className="sbar-fill" style={{width:`${s}%`,background:barClr(s)}}/></span>
                      <span style={{fontSize:12,fontWeight:700,width:24,textAlign:"right"}}>{s}</span>
                    </span>
                  ))}
                  <span style={{padding:"3px 7px",borderRadius:6,fontSize:11,fontWeight:800,display:"inline-block",background:a>b?"rgba(16,185,129,.14)":"rgba(99,102,241,.14)",color:a>b?"var(--grn)":"var(--ind)"}}>{a>b?"A":"B"}</span>
                </div>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"130px 1fr 1fr 70px",padding:"12px 16px",borderTop:"2px solid var(--b1)",background:"rgba(99,102,241,.04)",fontWeight:700}}>
                <span style={{fontSize:12,color:"var(--t3)"}}>TOTAL</span>
                <span style={{fontSize:21,color:"var(--grn)"}}>92</span>
                <span style={{fontSize:21}}>78</span>
                <span>🏆 A</span>
              </div>
            </div>
          </div>
        )}

        {/* EVIDENCE */}
        {tab==="evidence"&&(
          <div className="aI" style={{display:"flex",flexDirection:"column",gap:9,maxWidth:900}}>
            {evidence.map((ev,i)=>(
              <div key={i} className="glass" style={{padding:"15px 17px",borderRadius:"var(--r-md)"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9,flexWrap:"wrap"}}>
                  <span className={`badge ${ev.type==="URL"?"bc":"bi"}`}>{ev.type}</span>
                  <span style={{fontSize:12,color:"var(--t3)"}}>{ev.src}</span>
                  <span style={{marginLeft:"auto",fontSize:11,color:"var(--t4)",display:"flex",alignItems:"center",gap:5}}>
                    <Dot color={ev.conf>90?"var(--grn)":"var(--amb)"} size={5} pulse={false}/>{ev.conf}% confidence
                  </span>
                </div>
                <p style={{fontSize:13,color:"var(--t1)",lineHeight:1.65,fontStyle:"italic"}}>"{ev.txt}"</p>
              </div>
            ))}
          </div>
        )}

        {/* CONTRADICTIONS */}
        {tab==="contradictions"&&(
          <div className="aI" style={{maxWidth:900}}>
            <div style={{padding:"18px 20px",borderRadius:"var(--r-lg)",background:"rgba(245,158,11,.05)",border:"1px solid rgba(245,158,11,.3)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--amb)",marginBottom:13}}>⚠️ MEDIUM — 1 contradiction detected</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"start"}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"var(--t3)",marginBottom:5}}>apple.com</div>
                  <div style={{fontSize:13,fontStyle:"italic",color:"var(--t0)",lineHeight:1.6}}>"MacBook Pro battery life rated at 24 hours"</div>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--t4)",paddingTop:20}}>vs</div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"var(--t3)",marginBottom:5}}>Uploaded PDF Review</div>
                  <div style={{fontSize:13,fontStyle:"italic",color:"var(--t0)",lineHeight:1.6}}>"Real-world average recorded as 11.5 hours in mixed workloads"</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECOMMENDATION */}
        {tab==="recommendation"&&(
          <div className="aI" style={{display:"flex",flexDirection:"column",gap:14,maxWidth:900}}>
            <div style={{display:"flex",alignItems:"center",gap:18,padding:"20px 22px",borderRadius:"var(--r-lg)",background:"rgba(16,185,129,.06)",border:"1px solid rgba(16,185,129,.25)"}}>
              <span style={{fontSize:34}}>🏆</span>
              <div>
                <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"var(--grn)"}}>Final Recommendation</div>
                <div style={{fontSize:21,fontWeight:900,margin:"4px 0"}}>MacBook Pro M4</div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--grn)"}}>92 / 100 weighted score</div>
              </div>
            </div>
            <div className="glass" style={{padding:"20px 22px",borderRadius:"var(--r-lg)"}}>
              <p style={{fontSize:14,lineHeight:1.8,color:"var(--t1)"}}>
                For a developer in buy mode, the MacBook Pro M4 is the definitive choice. The M4 chip's neural engine and unified memory architecture provide class-leading performance for ML workloads, compilation, and IDE usage. The 24-hour rated battery eliminates power anxiety during travel. While the premium price is real, the total cost of ownership advantage — longevity, resale value, lower peripheral spend — offsets the initial gap vs. the Dell XPS 15.
              </p>
            </div>
            <div style={{padding:"16px 18px",borderRadius:"var(--r-md)",background:"rgba(99,102,241,.06)",border:"1px solid var(--b1)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--ind)",marginBottom:8}}>🔄 When to choose Dell XPS 15 instead</div>
              <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.65}}>If you are Windows-dependent, need a touchscreen, prefer upgradeable RAM/storage, or have a hard budget ceiling — the XPS 15 offers strong performance and more port flexibility.</p>
            </div>
            <div>
              <div className="lxs" style={{marginBottom:9}}>Suggested follow-up questions</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {["Re-rank by price only","Compare for India market","What if battery matters 50%?","Summarize for executives","Debate mode"].map(q=>(
                  <button key={q} style={{padding:"7px 14px",borderRadius:100,fontSize:12,background:"var(--card2)",border:"1px solid var(--b0)",color:"var(--t3)",transition:"all .13s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--b2)";e.currentTarget.style.color="var(--ind)"}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b0)";e.currentTarget.style.color="var(--t3)"}}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MonitoringPage ───────────────────────────────────────────────────────
function MonitoringPage({setPage}) {
  const mons=[
    {name:"MacBook Pro M4 vs Dell XPS 15",domain:"Product",last:"2h ago",next:"22h",changes:0,shifted:false},
    {name:"Canada vs Germany — Dev Jobs",domain:"Country",last:"1d ago",next:"2h",changes:1,shifted:true},
    {name:"OpenAI vs Groq API Pricing",domain:"Vendor",last:"3h ago",next:"21h",changes:0,shifted:false},
    {name:"iPhone 16 vs Pixel 9 Pro",domain:"Product",last:"5h ago",next:"19h",changes:2,shifted:false},
  ];
  return (
    <div style={{padding:"26px 24px",maxWidth:900}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:23,fontWeight:900,letterSpacing:"-.02em"}}>Live Monitoring</h1>
          <p style={{fontSize:13,color:"var(--t3)",marginTop:5}}>Track changes in saved comparisons — price shifts, content updates, policy diffs.</p>
        </div>
        <button className="btn-p" onClick={()=>setPage("compare")}>+ New Comparison</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {mons.map(m=>(
          <div key={m.name} className="glass" style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:"var(--r-md)",flexWrap:"wrap"}}>
            <Dot color="var(--cya)" size={7}/>
            <div style={{flex:1,minWidth:150}}>
              <div style={{fontSize:13,fontWeight:700}}>{m.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
                <span className="badge bi">{m.domain}</span>
                <span style={{fontSize:11,color:"var(--t4)"}}>Checked {m.last} · Next in {m.next}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              {m.shifted&&<span className="badge br">⚡ Recommendation shifted</span>}
              {m.changes>0?<span className="badge ba">{m.changes} change{m.changes>1?"s":""}</span>:<span className="badge bg">No changes</span>}
              <button onClick={()=>setPage("results")} style={{padding:"6px 12px",borderRadius:"var(--r-sm)",fontSize:12,fontWeight:600,border:"1px solid var(--b1)",color:"var(--ind)",transition:"background .13s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>View →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────
function SettingsPage() {
  const [stab,setStab] = useState("api");
  const [saved,setSaved] = useState(false);
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const STABS=[{id:"api",lbl:"API & Providers"},{id:"notifications",lbl:"Notifications"},{id:"appearance",lbl:"Appearance"},{id:"account",lbl:"Account"}];
  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 54px)"}}>
      <div style={{width:190,flexShrink:0,borderRight:"1px solid var(--b0)",padding:"14px 8px"}}>
        {STABS.map(({id,lbl})=>(
          <button key={id} className={`nav-i${stab===id?" on":""}`} onClick={()=>setStab(id)} style={{marginBottom:2}}>{lbl}</button>
        ))}
      </div>
      <div style={{flex:1,padding:"26px 26px",overflowY:"auto",maxWidth:680}}>
        {stab==="api"&&(
          <div className="aI" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <h2 style={{fontSize:17,fontWeight:800}}>API & LLM Providers</h2>
              <p style={{fontSize:13,color:"var(--t3)",marginTop:5}}>Configure your AI provider keys. Stored securely and never logged.</p>
            </div>
            {[{title:"Groq — Fast Extraction Engine",color:"var(--grn)",icon:"⚡",desc:"Extraction, summarization, normalization, scoring drafts"},{title:"OpenAI — Deep Reasoning Engine",color:"var(--ind)",icon:"🧠",desc:"Contradiction analysis, final recommendations, report writing"}].map(({title,color,icon,desc})=>(
              <div key={title} className="glass" style={{padding:19,borderRadius:"var(--r-lg)"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
                  <span style={{fontSize:15,padding:"4px 7px",borderRadius:6,background:`${color}20`}}>{icon}</span>
                  <div style={{fontSize:14,fontWeight:700}}>{title}</div>
                </div>
                <p style={{fontSize:11,color:"var(--t3)",marginBottom:13,paddingLeft:42}}>{desc}</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div><div className="lxs" style={{marginBottom:6}}>API Key</div><input className="inp" type="password" defaultValue="••••••••••••••••••••"/></div>
                  <div><div className="lxs" style={{marginBottom:6}}>Model</div>
                    <select className="inp" style={{cursor:"pointer"}}>
                      <option>{title.includes("Groq")?"llama3-70b-8192 (recommended)":"gpt-4o (recommended)"}</option>
                      <option>{title.includes("Groq")?"llama3-8b-8192 (faster)":"gpt-4o-mini (cheaper)"}</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {stab==="notifications"&&(
          <div className="aI" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><h2 style={{fontSize:17,fontWeight:800}}>Notifications</h2><p style={{fontSize:13,color:"var(--t3)",marginTop:5}}>Control when CompareIQ alerts you to changes.</p></div>
            <div className="glass" style={{padding:18,borderRadius:"var(--r-lg)"}}>
              {[["Price changes detected","Alert when monitored product prices change"],["Content changes","Alert when source URLs or documents update"],["Recommendation shifted","Alert when the winner changes after re-analysis"],["New contradictions","Alert when new source conflicts emerge"]].map(([l,d],i,arr)=>(
                <div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,padding:"12px 0",borderBottom:i<arr.length-1?"1px solid var(--b0)":"none"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{l}</div>
                    <div style={{fontSize:11,color:"var(--t4)",marginTop:2}}>{d}</div>
                  </div>
                  <label className="twrap"><input type="checkbox" defaultChecked/><span className="ttrack"/></label>
                </div>
              ))}
            </div>
          </div>
        )}
        {stab==="appearance"&&(
          <div className="aI" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><h2 style={{fontSize:17,fontWeight:800}}>Appearance</h2></div>
            <div className="glass" style={{padding:18,borderRadius:"var(--r-lg)"}}>
              <div className="lxs" style={{marginBottom:11}}>Theme</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {[{name:"Midnight (default)",colors:["#040812","#6366f1","#22d3ee"]},{name:"Deep Violet",colors:["#0d032a","#a855f7","#ec4899"]},{name:"Ocean Teal",colors:["#021820","#14b8a6","#38bdf8"]}].map((t,i)=>(
                  <div key={t.name} style={{padding:12,borderRadius:"var(--r-md)",cursor:"pointer",border:`1px solid ${i===0?"var(--ind)":"var(--b0)"}`,background:i===0?"rgba(99,102,241,.1)":"var(--card2)"}}>
                    <div style={{display:"flex",gap:5,marginBottom:7}}>{t.colors.map(c=><span key={c} style={{width:17,height:17,borderRadius:4,background:c}}/>)}</div>
                    <div style={{fontSize:11,color:"var(--t3)"}}>{t.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {stab==="account"&&(
          <div className="aI" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><h2 style={{fontSize:17,fontWeight:800}}>Account</h2></div>
            <div className="glass" style={{padding:18,borderRadius:"var(--r-lg)",display:"flex",flexDirection:"column",gap:12}}>
              {[["Full name","text","Raja Abimanyu N"],["Email","email","raja@compareiq.ai"],["New password","password",""]].map(([l,t,def])=>(
                <div key={l}><div className="lxs" style={{marginBottom:7}}>{l}</div><input className="inp" type={t} defaultValue={def} placeholder={t==="password"?"••••••••":undefined}/></div>
              ))}
            </div>
          </div>
        )}
        <div style={{marginTop:22}}>
          <button className="btn-p" onClick={save} style={{padding:"11px 28px",fontSize:14}}>
            {saved?"✓ Saved!":"Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage] = useState("landing");

  const inner = () => {
    switch(page) {
      case "landing":    return <LandingPage setPage={setPage}/>;
      case "dashboard":  return <Layout page={page} setPage={setPage}><DashboardPage setPage={setPage}/></Layout>;
      case "compare":    return <Layout page={page} setPage={setPage}><ComparePage setPage={setPage}/></Layout>;
      case "results":    return <Layout page={page} setPage={setPage}><ResultsPage setPage={setPage}/></Layout>;
      case "monitoring": return <Layout page={page} setPage={setPage}><MonitoringPage setPage={setPage}/></Layout>;
      case "settings":   return <Layout page={page} setPage={setPage}><SettingsPage/></Layout>;
      default:           return <LandingPage setPage={setPage}/>;
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div key={page} className="aU" style={{minHeight:"100vh",background:"var(--bg0)"}}>
        <TopNav page={page} setPage={setPage}/>
        {inner()}
      </div>
    </>
  );
}
