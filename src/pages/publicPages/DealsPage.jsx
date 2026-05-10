import { ArrowBigRightDash, MoveRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { allDeals, flashSales } from "../../constants/deals";


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
        <div className="hero-ticker-tape top-15 sm:top-20">
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
              <div className="dest-emoji-bg">
                <img className="-z-40 block w-full h-max" src="https://images.pexels.com/photos/30892607/pexels-photo-30892607.jpeg" alt="" />

              </div>
              <div className="dest-info-float">
                {/* <span className="dest-emoji-main">🗼</span> */}
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
                  <span className="deal-visual-emoji"><img src={d.emoji} alt="" /></span>
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
                      <button className="deal-book-btn flex items-center gap-1" onClick={() => handleBook(d.city)}>Book <ArrowBigRightDash size={20}/></button>
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