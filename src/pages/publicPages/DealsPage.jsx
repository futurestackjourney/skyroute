import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── STYLES ─────────────────────────── */
/* ─────────────────────────── DATA ─────────────────────────── */
const allDeals = [
  { id:1, emoji:"🗼", bg:"linear-gradient(135deg,#ffecd2,#fcb69f)", city:"Paris", country:"France", from:"Karachi", was:"PKR 185,000", now:"PKR 112,000", savings:"39%", badge:"flash", badgeLabel:"Flash Sale", dates:"Jun 10 – Jun 20", seats:"8 seats left", category:"Europe" },
  { id:2, emoji:"🏙️", bg:"linear-gradient(135deg,#e0f7fa,#b2ebf2)", city:"Dubai", country:"UAE", from:"Lahore", was:"PKR 55,000", now:"PKR 34,500", savings:"37%", badge:"limited", badgeLabel:"Limited", dates:"May 25 – Jun 5", seats:"4 seats left", category:"Middle East" },
  { id:3, emoji:"🌸", bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)", city:"Tokyo", country:"Japan", from:"Islamabad", was:"PKR 210,000", now:"PKR 138,000", savings:"34%", badge:null, badgeLabel:null, dates:"Jul 1 – Jul 15", seats:"12 seats left", category:"Asia" },
  { id:4, emoji:"🗽", bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", city:"New York", country:"USA", from:"Karachi", was:"PKR 275,000", now:"PKR 189,000", savings:"31%", badge:"flash", badgeLabel:"Flash Sale", dates:"Aug 3 – Aug 14", seats:"6 seats left", category:"Americas" },
  { id:5, emoji:"🏛️", bg:"linear-gradient(135deg,#fff8e1,#ffecb3)", city:"Rome", country:"Italy", from:"Lahore", was:"PKR 165,000", now:"PKR 110,000", savings:"33%", badge:null, badgeLabel:null, dates:"Sep 5 – Sep 18", seats:"15 seats left", category:"Europe" },
  { id:6, emoji:"🦁", bg:"linear-gradient(135deg,#f3e5f5,#e1bee7)", city:"Nairobi", country:"Kenya", from:"Karachi", was:"PKR 145,000", now:"PKR 98,000", savings:"32%", badge:"limited", badgeLabel:"Limited", dates:"Oct 10 – Oct 22", seats:"3 seats left", category:"Africa" },
  { id:7, emoji:"🕌", bg:"linear-gradient(135deg,#fff3e0,#ffe0b2)", city:"Istanbul", country:"Turkey", from:"Islamabad", was:"PKR 120,000", now:"PKR 79,000", savings:"34%", badge:null, badgeLabel:null, dates:"Jun 18 – Jun 28", seats:"10 seats left", category:"Middle East" },
  { id:8, emoji:"🏝️", bg:"linear-gradient(135deg,#e0f2f1,#b2dfdb)", city:"Bali", country:"Indonesia", from:"Karachi", was:"PKR 175,000", now:"PKR 120,000", savings:"31%", badge:"flash", badgeLabel:"Flash Sale", dates:"Jul 20 – Aug 2", seats:"7 seats left", category:"Asia" },
  { id:9, emoji:"🎭", bg:"linear-gradient(135deg,#e8eaf6,#c5cae9)", city:"London", country:"UK", from:"Lahore", was:"PKR 230,000", now:"PKR 159,000", savings:"31%", badge:null, badgeLabel:null, dates:"May 30 – Jun 12", seats:"11 seats left", category:"Europe" },
];

const flashSales = [
  { flag:"🇹🇭", dest:"Bangkok", from:"Karachi", price:"PKR 89K", was:"PKR 140K", pct:"36%" },
  { flag:"🇲🇾", dest:"Kuala Lumpur", from:"Lahore", price:"PKR 72K", was:"PKR 115K", pct:"37%" },
  { flag:"🇸🇬", dest:"Singapore", from:"Islamabad", price:"PKR 105K", was:"PKR 160K", pct:"34%" },
  { flag:"🇦🇺", dest:"Sydney", from:"Karachi", price:"PKR 248K", was:"PKR 370K", pct:"33%" },
  { flag:"🇨🇦", dest:"Toronto", from:"Lahore", price:"PKR 295K", was:"PKR 440K", pct:"33%" },
  { flag:"🇪🇸", dest:"Barcelona", from:"Karachi", price:"PKR 148K", was:"PKR 220K", pct:"33%" },
];

const tabs = ["All Deals", "Europe", "Middle East", "Asia", "Americas", "Africa"];

/* ─────────────────────────── COUNTDOWN ─────────────────────────── */
function useCountdown() {
  const [time, setTime] = useState({ h: 5, m: 47, s: 33 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function pad(n) { return String(n).padStart(2, "0"); }

/* ─────────────────────────── COMPONENT ─────────────────────────── */
export default function DealsPage() {
  const [activeTab, setActiveTab] = useState("All Deals");
  const [sort, setSort] = useState("savings");
  const [toast, setToast] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const time = useCountdown();

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const handleCopyCode = (code) => {
    setCopiedCode(code);
    showToast(`✅ Code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(""), 2400);
  };

  const handleBook = (city) => showToast(`✈️ Opening booking for ${city}…`);
  const handleNewsletter = () => { if (emailVal) { showToast("🎉 You're on the list! First deal drops tomorrow."); setEmailVal(""); } };

  const filteredDeals = allDeals.filter(d => activeTab === "All Deals" || d.category === activeTab);
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sort === "savings") return parseInt(b.savings) - parseInt(a.savings);
    if (sort === "price") return parseInt(a.now.replace(/\D/g,"")) - parseInt(b.now.replace(/\D/g,""));
    return 0;
  });

  return (
    <>

      {/* TOAST */}
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>

      {/* HERO */}
      <section className="deals-hero">
        {/* ticker tape */}
        <div className="hero-ticker-tape">
          <div className="ticker-track">
            {[...Array(2)].map((_, ti) =>
              ["✈ KARACHI → PARIS  –39%","✈ LAHORE → DUBAI  –37%","✈ ISLAMABAD → TOKYO  –34%","✈ KARACHI → NEW YORK  –31%","✈ LAHORE → ROME  –33%","✈ KARACHI → BALI  –31%"].map((t, i) => (
                <span key={`${ti}-${i}`} className="ticker-item">{t}<span className="ticker-sep">|</span></span>
              ))
            )}
          </div>
        </div>

        <div className="hero-bg-pattern" />
        <div className="hero-blob-l" />
        <div className="hero-blob-r" />

        <div className="hero-badge">
          <span className="badge-pulse" />
          🔥 Limited Time Offers
        </div>
        <h1 className="hero-title">
          Fly More,<br />Pay <em>Far Less</em>
        </h1>
        <p className="hero-sub">
          Hand-picked deals refreshed daily. Up to 40% off on flights to 180+ destinations worldwide.
        </p>

        {/* Countdown */}
        <div className="countdown-strip">
          <span className="countdown-label">Flash sale ends in</span>
          <div className="countdown-unit">
            <div className="countdown-num">{pad(time.h)}</div>
            <div className="countdown-seg">hrs</div>
          </div>
          <span className="countdown-colon">:</span>
          <div className="countdown-unit">
            <div className="countdown-num">{pad(time.m)}</div>
            <div className="countdown-seg">min</div>
          </div>
          <span className="countdown-colon">:</span>
          <div className="countdown-unit">
            <div className="countdown-num">{pad(time.s)}</div>
            <div className="countdown-seg">sec</div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        {tabs.map(tab => (
          <button key={tab} className={`filter-tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
        <div className="filter-right">
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="savings">Best Savings</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* FEATURED DEAL */}
      <section className="featured-section">
        <div className="featured-inner">
          <div className="reveal">
            <span className="section-tag">Deal of the Week</span>
            <h2 className="section-title">Editor's Pick</h2>
          </div>
          <div className="featured-card reveal reveal-delay-1" onClick={() => handleBook("Paris")}>
            <div className="featured-left">
              <div>
                <div className="featured-eyebrow">🔥 Flash Sale — 39% Off</div>
                <div className="featured-title">The City of<br />Lights Awaits</div>
                <div className="featured-route">Karachi (KHI) → Paris (CDG) · Jun 10 – Jun 20</div>
              </div>
              <div>
                <div className="featured-price-row">
                  <span className="featured-was">PKR 185,000</span>
                  <span className="featured-now">112K</span>
                  <span className="featured-per">/ person</span>
                </div>
                <button className="featured-cta">Book This Deal →</button>
              </div>
            </div>
            <div className="featured-right">
              <div className="dest-emoji-bg">🗼</div>
              <div className="dest-info-float">
                <span className="dest-emoji-main">🗼</span>
                <div className="dest-name-big">Paris, France</div>
                <div className="dest-tagline">Romance, art & croissants</div>
              </div>
              <div className="featured-savings-badge">
                <span className="savings-pct">39%</span>
                <span className="savings-off">off</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEALS GRID */}
      <section className="deals-section">
        <div className="deals-inner">
          <div className="reveal" style={{ marginBottom: "1.5rem", display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
            <h2 className="section-title" style={{ marginBottom:0 }}>
              {sortedDeals.length} Deal{sortedDeals.length !== 1 ? "s" : ""} Found
            </h2>
            <span style={{ fontSize:".85rem", color:"var(--color-charcoal-100)" }}>Sorted by {sort === "savings" ? "best savings" : "lowest price"}</span>
          </div>
          <div className="deals-grid">
            {sortedDeals.map((d, i) => (
              <div key={d.id} className={`deal-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="deal-visual" style={{ background: d.bg }}>
                  <span className="deal-visual-emoji">{d.emoji}</span>
                  {d.badge && <span className={`deal-badge ${d.badge}`}>{d.badgeLabel}</span>}
                </div>
                <div className="deal-body">
                  <div className="deal-route">
                    <span>{d.from}</span>
                    <span className="deal-arrow">→</span>
                    <span>{d.city}</span>
                  </div>
                  <div className="deal-title">{d.city}, {d.country}</div>
                  <div className="deal-meta">{d.dates} · {d.seats}</div>
                  <div className="deal-footer">
                    <div className="deal-price-wrap">
                      <span className="deal-was">{d.was}</span>
                      <span className="deal-now">{d.now.replace("PKR ","")}</span>
                      <span className="deal-now-label">per person</span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:".5rem" }}>
                      <span className="deal-savings">Save {d.savings}</span>
                      <button className="deal-book-btn" onClick={() => handleBook(d.city)}>Book →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLASH SALES STRIP */}
      <section className="flash-band">
        <div className="flash-inner">
          <div className="flash-header">
            <h2 className="flash-title">⚡ <em>Flash</em> Fares — Today Only</h2>
            <button className="flash-see-all">View All →</button>
          </div>
          <div className="flash-scroll">
            {flashSales.map((f, i) => (
              <div key={i} className="flash-card" onClick={() => handleBook(f.dest)}>
                <div className="flash-flag">{f.flag}</div>
                <div className="flash-dest">{f.dest}</div>
                <div className="flash-from">From {f.from}</div>
                <div>
                  <span className="flash-price">{f.price}</span>
                  <span className="flash-pct">-{f.pct}</span>
                </div>
                <div className="flash-was-price">{f.was}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO CODES */}
      <section className="promo-section">
        <div className="promo-inner">
          <div className="reveal" style={{ marginBottom:"2rem" }}>
            <span className="section-tag">Promo Codes</span>
            <h2 className="section-title">Stack Savings Even Further</h2>
          </div>
          <div className="promo-grid">
            <div className="promo-card wide reveal reveal-delay-1" onClick={() => handleCopyCode("SKY15")}>
              <div className="promo-circle promo-circle-1" />
              <div className="promo-circle promo-circle-2" />
              <div className="promo-tag">First Booking</div>
              <div className="promo-title">15% off your<br />first SkyRoute flight</div>
              <p className="promo-desc">New to SkyRoute? Welcome aboard. Use this code at checkout and save 15% on any flight, any destination.</p>
              <div className="promo-code-box">
                <span className="promo-code">SKY15</span>
                <span className="promo-copy-hint">{copiedCode === "SKY15" ? "✅ Copied!" : "Click to copy"}</span>
              </div>
            </div>
            <div className="promo-card narrow reveal reveal-delay-2" onClick={() => handleCopyCode("ELITE10")}>
              <div className="promo-circle promo-circle-1" />
              <div className="promo-tag">Elite Members</div>
              <div className="promo-title">Extra 10% for SkyRoute Elite</div>
              <p className="promo-desc">Loyalty deserves rewards. Elite members get an additional 10% on top of any existing deal.</p>
              <div className="promo-code-box">
                <span className="promo-code">ELITE10</span>
                <span className="promo-copy-hint">{copiedCode === "ELITE10" ? "✅ Copied!" : "Click to copy"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="newsletter-inner reveal">
          <div className="newsletter-icon">✉️</div>
          <h2 className="newsletter-title">Never Miss a <em>Deal</em></h2>
          <p className="newsletter-sub">
            Get the hottest flight deals dropped straight into your inbox — before they sell out.
            Thousands of travellers already save big every week.
          </p>
          <div className="newsletter-form">
            <input
              className="newsletter-input"
              placeholder="your@email.com"
              value={emailVal}
              onChange={e => setEmailVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleNewsletter()}
            />
            <button className="newsletter-btn" onClick={handleNewsletter}>Get Deals ✈</button>
          </div>
          <p className="newsletter-fine">No spam, ever. Unsubscribe anytime. We hate junk mail as much as you do.</p>
        </div>
      </section>
    </>
  );
}