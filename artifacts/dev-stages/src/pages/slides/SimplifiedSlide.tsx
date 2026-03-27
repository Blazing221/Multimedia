const base = import.meta.env.BASE_URL;

export default function SimplifiedSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#080c0a" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(45,106,63,0.1) 0%, transparent 60%)" }} />

      <div className="relative flex h-full">
        <div style={{ width: "46%", padding: "7vh 4vw 7vh 8vw", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vh" }}>
          <div style={{ color: "#d4af37", fontFamily: "Inter, sans-serif", fontSize: "1.1vw", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
            Stage 03 — Current
          </div>
          <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "4.2vw", fontWeight: 900, color: "#f0ede6", lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>
            Simplified
          </h2>
          <div style={{ width: "3vw", height: "2px", background: "#d4af37" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "1.4vh" }}>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#2d6a3f", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>All logic merged into a single file</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#2d6a3f", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Removed shot angle display</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#2d6a3f", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>7 files collapsed into 2</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#2d6a3f", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Leaner CSS, cleaner layout</span>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", background: "#2d6a3f", flexShrink: 0, marginTop: "0.2vh" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65vw", color: "rgba(240,237,230,0.85)", fontWeight: 400, lineHeight: 1.4 }}>Stats panel kept, accessible via button</span>
            </div>
          </div>
        </div>

        <div style={{ width: "54%", padding: "6vh 6vw 6vh 2vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "100%", maxHeight: "76vh" }}>
            <div style={{ position: "absolute", inset: "-4px", border: "2px solid rgba(212,175,55,0.4)", borderRadius: "4px" }} />
            <img
              src={`${base}v3.jpg`}
              crossOrigin="anonymous"
              alt="v3 screenshot"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "2px", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "linear-gradient(transparent, rgba(8,12,10,0.8))", padding: "2vh 2vw 1.5vh", borderRadius: "0 0 2px 2px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.1vw", color: "rgba(212,175,55,0.9)", letterSpacing: "0.15em", textTransform: "uppercase" }}>v3 — Current Version</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
