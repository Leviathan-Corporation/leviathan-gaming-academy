import Link from "next/link";

const games=[
 {name:"FREE FIRE",short:"FF",cls:"ff",image:"/assets/ff-banner.jpg",desc:"Sharpen your aim, movement, rotations and ranked-match decision making.",level:"ALL SKILL LEVELS"},
 {name:"BGMI / PUBG",short:"BATTLE ROYALE",cls:"bgmi",image:"/assets/bgmi-banner.jpg",desc:"Master recoil, gyro, map awareness, team communication and competitive tactics.",level:"SQUAD & SOLO"},
 {name:"MINECRAFT",short:"MC",cls:"mc",image:"/assets/mc-banner.webp",desc:"Build smarter, survive longer and improve at PvP, redstone and speedrunning.",level:"CREATIVE & SURVIVAL"}
];
export default function Home(){return <>
 <main>
  <section className="hero"><div className="container hero-grid">
   <div><div className="eyebrow">THE NEXT LEVEL STARTS HERE</div><h1>PLAY SMART.<br/><em>RISE</em> HIGHER.</h1><p className="lead">Turn game time into skill. Learn from dedicated coaches, follow structured training and build the confidence to compete at your best.</p><div style={{display:"flex",gap:12,flexWrap:"wrap"}}><Link className="btn" href="/signup">Start training <span>↗</span></Link><Link className="btn secondary" href="/courses">Explore coaching</Link></div>
    <div className="stats"><div className="stat"><strong>03</strong><span>GAME WORLDS</span></div><div className="stat"><strong>1:1</strong><span>COACHING READY</span></div><div className="stat"><strong>24/7</strong><span>LEARN AT YOUR PACE</span></div></div>
   </div>
   <div className="hero-art"><div className="monogram">Λ</div><div className="art-caption">LEVIATHAN GAMING ACADEMY · EST. 2026</div></div>
  </div></section>
  <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">CHOOSE YOUR ARENA</div><h2>YOUR GAME. YOUR GRIND.</h2><p className="section-sub">Focused coaching paths for the games you love.</p></div><Link className="muted-link" href="/games">View all games ↗</Link></div>
   <div className="cards">{games.map(g=><article className="game-card" key={g.name}><div className={`game-cover ${g.cls}`}><img className="game-image" src={g.image} alt={`${g.name} game artwork`} loading="lazy" decoding="async" width="1280" height="800"/><div className="game-image-shade" aria-hidden="true"/><b>{g.name}</b></div><div className="game-body"><span className="tag">{g.level}</span><p>{g.desc}</p><Link href="/courses" className="muted-link" style={{fontSize:12,fontWeight:700}}>Explore training →</Link></div></article>)}</div>
  </div></section>
  <section className="section" id="features"><div className="container"><div className="eyebrow">BUILT FOR THE CLIMB</div><h2>MORE THAN JUST PLAYING.</h2><p className="section-sub" style={{marginBottom:25}}>A clear path from where you are to where you want to be.</p><div className="feature-grid">
   {[["◎","Personalised training","Build a plan around your role, goals and current skill."],["♜","Expert guidance","Learn game sense and practical techniques from coaches."],["↗","Track progress","Keep your learning organised and see what to work on next."],["✦","Player community","Connect with other learners and grow together."]].map(x=><div className="feature" key={x[1]}><div className="feature-icon">{x[0]}</div><h3>{x[1]}</h3><p>{x[2]}</p></div>)}
  </div></div></section>
  <section className="section"><div className="container panel" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:25,flexWrap:"wrap",background:"linear-gradient(110deg,#171326,#111b25)"}}><div><div className="eyebrow">YOUR NEXT MATCH STARTS NOW</div><h2 style={{marginTop:10}}>READY TO LEVEL UP?</h2><p className="section-sub">Create your free player account and start your journey.</p></div><Link className="btn" href="/signup">Join LEVIATHAN ↗</Link></div></section>
 </main></>}
