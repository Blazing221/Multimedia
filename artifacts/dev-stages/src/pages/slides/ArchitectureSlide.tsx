export default function ArchitectureSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#080c0a" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 55%)" }} />

      <div className="relative flex h-full flex-col" style={{ padding: "6vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <div style={{ color: "#d4af37", fontFamily: "Inter, sans-serif", fontSize: "1.1vw", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, marginBottom: "1.2vh" }}>
            Code Architecture
          </div>
          <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "4vw", fontWeight: 900, color: "#f0ede6", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}>
            Before vs After
          </h2>
        </div>

        <div style={{ flex: 1, display: "flex", gap: "4vw", alignItems: "stretch" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "3.5vh 3vw", display: "flex", flexDirection: "column", gap: "1.5vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.4vw", color: "rgba(240,237,230,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Before</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.2vw", color: "rgba(212,175,55,0.7)", fontWeight: 500 }}>9 files</span>
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: "1.4vw", color: "rgba(240,237,230,0.55)", lineHeight: 2 }}>
              <div>src/components/SnookerGame.tsx</div>
              <div>src/components/Scoreboard.tsx</div>
              <div>src/components/StatsPanel.tsx</div>
              <div>src/game/constants.ts</div>
              <div>src/game/initialState.ts</div>
              <div>src/game/physics.ts</div>
              <div>src/game/renderer.ts</div>
              <div>src/game/rules.ts</div>
              <div>src/game/types.ts</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1vh" }}>
            <div style={{ fontSize: "2.5vw", color: "#d4af37" }}>—</div>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: "5vw", fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>72%</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.15vw", color: "rgba(240,237,230,0.45)", textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>less code</div>
          </div>

          <div style={{ flex: 1, background: "rgba(45,106,63,0.12)", border: "1px solid rgba(45,106,63,0.35)", borderRadius: "8px", padding: "3.5vh 3vw", display: "flex", flexDirection: "column", gap: "1.5vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.4vw", color: "rgba(240,237,230,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>After</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.2vw", color: "#2d6a3f", fontWeight: 500 }}>2 files</span>
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: "1.4vw", color: "rgba(240,237,230,0.85)", lineHeight: 2 }}>
              <div style={{ color: "#d4af37" }}>src/App.tsx</div>
              <div style={{ color: "#d4af37" }}>src/game.css</div>
            </div>
            <div style={{ marginTop: "1vh", fontFamily: "Inter, sans-serif", fontSize: "1.4vw", color: "rgba(240,237,230,0.5)", lineHeight: 1.6, fontStyle: "italic" }}>
              Physics, rules, rendering, and UI all in one place. Same full gameplay.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
