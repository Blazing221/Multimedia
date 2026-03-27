const base = import.meta.env.BASE_URL;

export default function TitleSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#080c0a" }}>
      <img
        src={`${base}hero.png`}
        crossOrigin="anonymous"
        alt="Snooker table"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(8,12,10,0.85) 40%, rgba(45,106,63,0.35) 100%)" }} />

      <div className="relative flex h-full flex-col justify-between px-[8vw] py-[7vh]">
        <div style={{ color: "#d4af37", fontFamily: "Inter, sans-serif", fontSize: "1.3vw", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500 }}>
          Neal Bhavsar
        </div>

        <div>
          <div style={{ color: "#d4af37", fontFamily: "Inter, sans-serif", fontSize: "1.15vw", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 400, marginBottom: "1.5vh" }}>
            A Snooker Game Built from Scratch
          </div>
          <h1 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "7vw", fontWeight: 900, color: "#f0ede6", lineHeight: 0.92, letterSpacing: "-0.02em", margin: 0 }}>
            How I
          </h1>
          <h1 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "7vw", fontWeight: 900, color: "#d4af37", lineHeight: 0.92, letterSpacing: "-0.02em", margin: 0 }}>
            Built It
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.85vw", color: "rgba(240,237,230,0.75)", fontWeight: 300, marginTop: "2.5vh", maxWidth: "52vw", lineHeight: 1.5 }}>
            Development Stages: from blank canvas to a full physics-based snooker game
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "3vw", height: "1px", background: "#d4af37", opacity: 0.6 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.2vw", color: "rgba(240,237,230,0.5)", letterSpacing: "0.12em", fontWeight: 400 }}>
            3 stages — 1 clean result
          </span>
        </div>
      </div>
    </div>
  );
}
