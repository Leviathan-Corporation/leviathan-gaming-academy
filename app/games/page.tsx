import Link from "next/link";

const games = [
  { name: "Free Fire", short: "FF", image: "/assets/ff-banner.jpg", alt: "Free Fire game artwork", desc: "Aim, movement, character ability combinations, rotations and ranked strategy." },
  { name: "BGMI / PUBG", short: "BATTLE ROYALE", image: "/assets/bgmi-banner.jpg", alt: "BGMI and PUBG game artwork", desc: "Gyroscope setup, recoil control, positioning, squad roles and map strategy." },
  { name: "Minecraft", short: "MC", image: "/assets/mc-banner.webp", alt: "Minecraft game artwork", desc: "Survival, building, PvP fundamentals, redstone and speedrunning." },
];

export default function Games() {
  return (
    <main className="container page">
      <div className="eyebrow">PICK YOUR ARENA</div>
      <h1 className="page-title">GAME PATHS</h1>
      <p className="muted">Choose a game to explore the skills you can develop.</p>
      <div className="cards game-path-grid" style={{ marginTop: 28 }}>
        {games.map((game) => (
          <article className="game-card" key={game.name}>
            <div className="game-cover game-cover-image">
              <img className="game-image" src={game.image} alt={game.alt} loading="lazy" decoding="async" />
              <div className="game-image-shade" aria-hidden="true" />
              <b>{game.short}</b>
            </div>
            <div className="game-body">
              <h2 style={{ fontSize: 28 }}>{game.name}</h2>
              <p>{game.desc}</p>
              <Link className="btn secondary" href="/courses">Explore coaching</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
