const base = import.meta.env.BASE_URL;

export default function MathLayerSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#080c0a" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.07) 0%, transparent 60%)" }} />

      <div className="relative flex h-full">
        <div style={{ width: "52%", padding: "6vh 2vw 6vh 6vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "100%", maxHeight: "76vh" }}>
            <div style={{ position: "absolute", inset: "-4px", border: "2px solid rgba(212,175,55,0.4)", borderRadius: "4px" }} />
            <img
              src={`${base}v2.jpg`}
              crossOrigin="anonymous"
              alt="v2 screenshot"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "2px", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "linear-gradient(transparent, rgba(8,12,10,0.8))", padding: "2vh 2vw 1.5vh", borderRadius: "0 0 2px 2px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.1vw", color: "rgba(212,175,55,0.9)", letterSpacing: "0.15em", textTransform: "uppercase" }}>v2 — Stats Added</span>
            </div>
          </div>
        </div>

        <div style={{ width: "48%", padding: "7vh 8vw 7vh 4vw", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vh" }}>
          <div style={{ color: "#d4af37", fontFamily: "Inter, sans-serif", fontSize: "1.1vw", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
            Stage 02
          </div>
          <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "4.2vw", fontWeight: 900, color: "#f0ede6", lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>
            Stats &amp; Math Layer
          </h2>
          <div style={{ width: "3vw", height: "2px", background: "#d4af37" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "1.4vh" }}>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Live shot angle in degrees with compass</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Pot accuracy tracker per player</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Stats modal: shots, breaks, fouls</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Formula shown: pots divided by shots times 100</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Foul detection and colour respotting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
