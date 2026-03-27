export default function ClosingSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#080c0a" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(45,106,63,0.2) 0%, transparent 60%), radial-gradient(ellipse at 100% 0%, rgba(212,175,55,0.06) 0%, transparent 50%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30vh", background: "linear-gradient(transparent, rgba(45,106,63,0.08))" }} />

      <div className="relative flex h-full" style={{ padding: "7vh 0" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8vw" }}>
          <div style={{ color: "#d4af37", fontFamily: "Inter, sans-serif", fontSize: "1.1vw", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, marginBottom: "2vh" }}>
            Built by Neal Bhavsar
          </div>
          <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "5.5vw", fontWeight: 900, color: "#f0ede6", lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0 }}>
            What's
          </h2>
          <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "5.5vw", fontWeight: 900, color: "#d4af37", lineHeight: 0.95, letterSpacing: "-0.02em", margin: "0 0 3vh 0" }}>
            Next
          </h2>
          <div style={{ width: "3vw", height: "2px", background: "#d4af37", marginBottom: "3vh" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.7vw", color: "rgba(240,237,230,0.8)", fontWeight: 400, lineHeight: 1.4 }}>Ball spin physics — topspin, backspin, sidespin</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.7vw", color: "rgba(240,237,230,0.8)", fontWeight: 400, lineHeight: 1.4 }}>Sound effects — cue strike, ball click, pocket</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.7vw", color: "rgba(240,237,230,0.8)", fontWeight: 400, lineHeight: 1.4 }}>AI opponent with difficulty levels</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.7vw", color: "rgba(240,237,230,0.8)", fontWeight: 400, lineHeight: 1.4 }}>Match mode — best of 3, 5, or 7 frames</div>
          </div>
        </div>

        <div style={{ width: "1px", background: "rgba(212,175,55,0.2)", margin: "6vh 0" }} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8vw", gap: "3vh" }}>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", color: "rgba(240,237,230,0.4)", fontStyle: "italic", lineHeight: 1.5 }}>
            "Start simple. Add what matters. Strip what doesn't."
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh", marginTop: "2vh" }}>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>3</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.5vw", color: "#f0ede6", fontWeight: 600 }}>Development stages</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25vw", color: "rgba(240,237,230,0.45)" }}>Foundation, Stats, Simplified</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>22</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.5vw", color: "#f0ede6", fontWeight: 600 }}>Snooker balls</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25vw", color: "rgba(240,237,230,0.45)" }}>All with physics and rules</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>2</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.5vw", color: "#f0ede6", fontWeight: 600 }}>Files in final version</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25vw", color: "rgba(240,237,230,0.45)" }}>Down from 9 separate modules</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
