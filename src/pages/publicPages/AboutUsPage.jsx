import { useState, useEffect, useRef } from "react";

// const style = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

//   :root {
//     --color-pumpkin: oklch(73.073% 0.17623 49.145);
//     --color-pumpkin-50: oklch(75.197% 0.17126 45.899);
//     --color-pumpkin-100: oklch(77.669% 0.14767 52.458);
//     --color-charcoal: oklch(34.591% 0.04142 235.083);
//     --color-charcoal-50: oklch(40.469% 0.04507 235.227);
//     --color-charcoal-100: oklch(49.466% 0.04468 236.159);
//     --color-primary: oklch(34.591% 0.04142 235.083);
//     --color-secondary: oklch(55.102% 0.02343 264.389);
//     --color-card: #fff3e9;
//     --color-surface: oklch(96.826% 0.00696 248.26);
//   }

//   * { box-sizing: border-box; margin: 0; padding: 0; }

//   body {
//     // font-family: "SN Pro", sans-serif;
//     font-family: 'Playfair Display', serif;
//     background-color: var(--color-surface);
//     color: var(--color-primary);
//     overflow-x: hidden;
//   }

//   .font-display { font-family: 'Playfair Display', serif; }

//   /* Nav */
//   // .nav {
//   //   position: fixed; top: 0; left: 0; right: 0; z-index: 100;
//   //   background: rgba(255,243,233,0.85);
//   //   backdrop-filter: blur(16px);
//   //   border-bottom: 1px solid rgba(0,0,0,0.06);
//   //   display: flex; align-items: center; justify-content: space-between;
//   //   padding: 0 3rem; height: 70px;
//   // }
//   // .nav-logo {
//   //   font-family: 'Playfair Display', serif;
//   //   font-size: 1.5rem; font-weight: 900; letter-spacing: -0.02em;
//   //   color: var(--color-charcoal);
//   //   display: flex; align-items: center; gap: 0.4rem;
//   // }
//   // .nav-logo span { color: var(--color-pumpkin); }
//   // .nav-links { display: flex; gap: 2rem; }
//   // .nav-link {
//   //   font-size: 0.875rem; font-weight: 500; color: var(--color-charcoal-100);
//   //   text-decoration: none; letter-spacing: 0.02em;
//   //   transition: color 0.2s;
//   // }
//   // .nav-link:hover { color: var(--color-pumpkin); }
//   // .nav-cta {
//   //   background: var(--color-pumpkin);
//   //   color: #fff; border: none; cursor: pointer;
//   //   padding: 0.6rem 1.4rem; border-radius: 100px;
//   //   font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
//   //   transition: transform 0.15s, box-shadow 0.15s;
//   // }
//   // .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }

// `;

const PlaneIcon = ({ size = 80 }) => (
  <svg width={size * 3} height={size * 2} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#shadow)">
      <path d="M200 70L40 30L60 80L40 130L200 90L220 80L200 70Z" fill="oklch(34.591% 0.04142 235.083)" opacity="0.9"/>
      <path d="M200 70L220 80L200 90" fill="oklch(34.591% 0.04142 235.083)"/>
      <path d="M60 80L80 60L140 55L80 80Z" fill="oklch(73.073% 0.17623 49.145)"/>
      <path d="M60 80L80 100L140 105L80 80Z" fill="oklch(73.073% 0.17623 49.145)" opacity="0.7"/>
      <rect x="90" y="70" width="60" height="20" rx="4" fill="rgba(255,255,255,0.15)"/>
      <circle cx="100" cy="80" r="3" fill="rgba(255,255,255,0.4)"/>
      <circle cx="115" cy="80" r="3" fill="rgba(255,255,255,0.4)"/>
      <circle cx="130" cy="80" r="3" fill="rgba(255,255,255,0.4)"/>
    </g>
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.2"/>
      </filter>
    </defs>
  </svg>
);

const stats = [
  { number: "4M+", label: "Passengers Served" },
  { number: "180+", label: "Destinations" },
  { number: "98%", label: "On-Time Rate" },
  { number: "14yrs", label: "In the Sky" },
];

const values = [
  { icon: "🛡️", title: "Safety First", desc: "Every route, every booking, every flight — safety is our non-negotiable standard. We partner only with verified, top-rated carriers." },
  { icon: "✨", title: "Seamless Experience", desc: "From search to landing, we obsess over removing friction. A three-minute booking shouldn't feel like a chore." },
  { icon: "🌍", title: "Global Reach", desc: "We connect you to 180+ destinations across 60 countries — from bustling capitals to hidden coastal gems." },
  { icon: "💰", title: "Best Value", desc: "Our AI-powered fare engine monitors millions of prices daily to guarantee you're never overpaying." },
  { icon: "🤝", title: "Human Support", desc: "Real people available 24/7 — not chatbots. Our travel specialists are one call away, always." },
  { icon: "🌱", title: "Responsible Travel", desc: "Carbon offset programs and eco-routing options built into every booking, because travel and care aren't opposites." },
];

const team = [
  { emoji: "👩🏽‍✈️", bg: "#fff3e9", name: "Amara Hassan", role: "CEO & Co-Founder", bio: "Former airline ops director with 20 years at Emirates. Built SkyRoute to reimagine how people fly." },
  { emoji: "👨🏻‍💻", bg: "#e9f0ff", name: "Daniel Park", role: "CTO", bio: "Ex-Google engineer who built the fare prediction engine that powers our real-time pricing." },
  { emoji: "👩🏼‍🎨", bg: "#f0ffe9", name: "Léa Moreau", role: "Chief Design Officer", bio: "Award-winning UX designer from Paris. Led redesigns for three European travel platforms." },
  { emoji: "👨🏾‍💼", bg: "#ffe9f3", name: "Marcus Osei", role: "Head of Partnerships", bio: "Negotiated deals with 120+ airlines across 6 continents. Fluent in aviation policy and partnership law." },
];

const timeline = [
  { year: "2011", event: "SkyRoute Founded", detail: "Amara and Daniel founded SkyRoute from a small Karachi flat with a bold vision: make global flight booking effortless." },
  { year: "2013", event: "First Million Bookings", detail: "Reached one million bookings across South Asia & Middle East within 18 months of launch." },
  { year: "2016", event: "AI Fare Engine Launched", detail: "Debuted our proprietary real-time fare intelligence system — cutting average ticket costs by 23%." },
  { year: "2019", event: "Global Expansion", detail: "Opened offices in Dubai, London, and Singapore. Crossed 100 destination partnerships." },
  { year: "2022", event: "4M Passengers", detail: "Welcomed our four-millionth passenger. Launched carbon offset program for all bookings." },
  { year: "2024", event: "Sky is Not the Limit", detail: "Ranked #1 flight booking platform in South Asia for customer satisfaction. Expanding to 200+ routes." },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function AboutUsPage() {
  useReveal();

  return (
    <>
      {/* <style>{style}</style> */}

      {/* NAV */}
      {/* <nav className="nav">
        <div className="nav-logo">Sky<span>Route</span></div>
        <div className="nav-links">
          {["Flights", "Destinations", "Deals", "About", "Contact"].map(l => (
            <a key={l} href="#" className="nav-link">{l}</a>
          ))}
        </div>
        <button className="nav-cta">Book Now</button>
      </nav> */}

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-content">
          <div className="hero-eyebrow">✈ About SkyRoute</div>
          <h1 className="hero-title-about">
            We Don't Just Book<br /><em>Flights.</em> We Open<br />Horizons.
          </h1>
          <p className="hero-desc">
            SkyRoute was born from a simple frustration: why is booking a flight still complicated?
            Since 2011, we've made it our mission to change that — connecting millions of travellers
            to the world, effortlessly.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Destinations</button>
            <button className="btn-ghost">Our Story ↓</button>
          </div>
        </div>
        <div className="hero-plane">
          <PlaneIcon size={80} />
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* MISSION */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="section-inner">
          <div className="two-col">
            <div className="reveal">
              <span className="section-tag">Our Mission</span>
              <h2 className="section-title">Travel Should Feel Like Freedom, Not a Form</h2>
              <p className="section-body">
                We founded SkyRoute because the world's most exciting thing — getting on a plane to
                somewhere new — was buried under confusing interfaces, hidden fees, and outdated tech.
              </p>
              <p className="section-body" style={{ marginTop: "1rem" }}>
                Today, our platform serves over four million travellers annually. But our obsession
                remains the same: a booking experience so smooth, so transparent, so human, that the
                only thing left to feel is excitement.
              </p>
            </div>
            <div className="mission-visual reveal reveal-delay-2" style={{ paddingBottom: "2rem", paddingRight: "2rem" }}>
              <div className="mission-card-main">
                <div className="big-quote">"</div>
                <p className="mission-quote">
                  The best journey begins the moment you decide to go. We make sure nothing gets in the way of that decision.
                </p>
              </div>
              <div className="mission-card-float">
                <div className="float-icon">🏆</div>
                <div>
                  <div className="float-text-main">#1 in South Asia</div>
                  <div className="float-text-sub">Customer Satisfaction 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
            <span className="section-tag">Our Values</span>
            <h2 className="section-title">What We Stand For, Every Single Flight</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className={`value-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="value-number">0{i + 1}</div>
                <div className="value-icon">{v.icon}</div>
                <div className="value-title">{v.title}</div>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
            <span className="section-tag">The People</span>
            <h2 className="section-title">Built by Travellers, for Travellers</h2>
          </div>
          <div className="team-grid">
            {team.map((m, i) => (
              <div key={i} className={`team-card reveal reveal-delay-${i + 1}`}>
                <div className="team-photo" style={{ background: m.bg, fontSize: "4.5rem" }}>
                  {m.emoji}
                </div>
                <div className="team-info">
                  <div className="team-name">{m.name}</div>
                  <div className="team-role">{m.role}</div>
                  <p className="team-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
            <span className="section-tag">Our Journey</span>
            <h2 className="section-title">A Decade of Taking Off</h2>
          </div>
          <div className="timeline">
            {timeline.map((t, i) => (
              <div key={i} className={`timeline-item reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-year">{t.year}</div>
                  <div className="timeline-event">{t.event}</div>
                  <p className="timeline-detail">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="cta-banner">
        <h2 className="cta-title">Ready to Go <em>Somewhere</em>?</h2>
        <p className="cta-sub">180+ destinations. Millions of happy travellers. Your next adventure is one click away.</p>
        <button className="cta-btn">Book Your Flight →</button>
      </section> */}

      {/* FOOTER */}
      {/* <footer className="footer">
        <div className="footer-brand">Sky<span>Route</span></div>
        <div className="footer-copy">© 2024 SkyRoute. All rights reserved.</div>
        <div style={{ fontSize: "0.8rem" }}>Made with ✈ and ambition.</div>
      </footer> */}
    </>
  );
}