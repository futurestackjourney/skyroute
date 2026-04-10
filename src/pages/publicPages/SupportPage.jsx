import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── DATA ─────────────────────────── */
const quickLinks = [
  { icon: "🔄", label: "Change Flight" },
  { icon: "💸", label: "Request Refund" },
  { icon: "🧳", label: "Lost Baggage" },
  { icon: "📄", label: "Get Invoice" },
  { icon: "🔑", label: "Manage Booking" },
  { icon: "✈️", label: "Flight Status" },
];

const topics = [
  { icon: "🎫", title: "Bookings & Reservations", desc: "Modify dates, upgrade seats, add extras, or cancel a reservation with step-by-step guidance.", articles: "24 articles" },
  { icon: "💳", title: "Payments & Refunds", desc: "Understand our refund policy, dispute a charge, or track the status of your reimbursement.", articles: "18 articles" },
  { icon: "🧳", title: "Baggage & Check-in", desc: "Allowances, excess fees, special items, and online check-in walkthroughs for every airline.", articles: "31 articles" },
  { icon: "✈️", title: "Flight Disruptions", desc: "Delays, cancellations, diversions — know your rights and how SkyRoute advocates for you.", articles: "12 articles" },
  { icon: "👤", title: "Account & Profile", desc: "Update your details, manage saved cards, loyalty programs, and security settings.", articles: "9 articles" },
  { icon: "🌍", title: "Travel Requirements", desc: "Visa policies, passport rules, health documentation, and destination-specific entry rules.", articles: "41 articles" },
];

const faqCategories = ["All", "Bookings", "Refunds", "Baggage", "Account"];

const faqs = {
  All: [
    { q: "How do I change my flight date or destination?", a: "Log in to My Bookings, select your trip, and click 'Modify Flight'. Date changes are free within 24 hours of booking. Destination changes may incur a fare difference. Changes beyond 24 hours are subject to airline policies." },
    { q: "When will my refund appear in my account?", a: "Refunds to credit/debit cards typically take 5–10 business days. Bank transfers can take up to 14 days. Once processed on our end, you'll receive a confirmation email with the transaction reference." },
    { q: "What's included in my baggage allowance?", a: "Baggage allowance depends on your fare class and airline. Economy usually includes one cabin bag (7–10 kg). Checked luggage varies from 20–30 kg. You can view your allowance in your booking confirmation or under 'My Trips'." },
    { q: "Can I transfer my ticket to someone else?", a: "Most airline tickets are non-transferable. However, some carriers allow name changes for a fee. Contact our support team and we'll check the rules for your specific booking." },
    { q: "How do I add special meal preferences?", a: "Go to 'Manage Booking', select your flight, and choose 'Special Services'. Meal preferences must be added at least 48 hours before departure. Options include vegetarian, vegan, halal, kosher, and more." },
  ],
  Bookings: [
    { q: "How do I change my flight date or destination?", a: "Log in to My Bookings, select your trip, and click 'Modify Flight'. Date changes are free within 24 hours of booking." },
    { q: "Can I hold a fare without paying immediately?", a: "Yes! SkyRoute FareHold lets you lock in a price for up to 48 hours for a small fee. Available on select routes and airlines." },
    { q: "How do I add special meal preferences?", a: "Go to 'Manage Booking', select your flight, and choose 'Special Services'. Meal preferences must be added at least 48 hours before departure." },
  ],
  Refunds: [
    { q: "When will my refund appear in my account?", a: "Refunds to credit/debit cards typically take 5–10 business days. Bank transfers can take up to 14 days." },
    { q: "My flight was cancelled. Am I entitled to a full refund?", a: "Yes. If the airline cancels your flight, you're entitled to a full refund under IATA guidelines. SkyRoute will process this automatically within 3–5 business days." },
  ],
  Baggage: [
    { q: "What's included in my baggage allowance?", a: "Economy usually includes one cabin bag (7–10 kg). Checked luggage varies from 20–30 kg. View your allowance in your booking confirmation." },
    { q: "What happens if my luggage is lost?", a: "Report it immediately at the airline's baggage desk before leaving the airport. Get a PIR reference number, then file a claim with us within 21 days. We'll liaise directly with the airline." },
  ],
  Account: [
    { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. A secure reset link will be emailed to you and expires in 30 minutes. If you don't receive it, check your spam folder." },
    { q: "Can I transfer my ticket to someone else?", a: "Most airline tickets are non-transferable. Some carriers allow name changes for a fee. Contact support and we'll check rules for your specific booking." },
  ],
};

const initialMessages = [
  { from: "agent", text: "Hi there! 👋 I'm Maya from SkyRoute Support. How can I help you today?", time: "Just now" },
  { from: "agent", text: "I can help with bookings, refunds, flight changes, baggage — or anything else travel-related!", time: "Just now" },
];

const botReplies = [
  "Great question! Let me pull that up for you right away. Can you share your booking reference?",
  "I understand your concern. Our team will look into this within the next few minutes.",
  "Thanks for that detail! It looks like your booking is confirmed and on schedule. ✈️",
  "I've flagged this for our specialist team. You'll get a follow-up email within 2 hours.",
  "Absolutely! You can also track this anytime under 'My Trips' in your account.",
];

const statusItems = [
  { icon: "🔍", name: "Search Engine", state: "Operational" },
  { icon: "💳", name: "Payment Gateway", state: "Operational" },
  { icon: "📧", name: "Email Notifications", state: "Operational" },
  { icon: "📱", name: "Mobile App", state: "Operational" },
];

/* ─────────────────────────── COMPONENT ─────────────────────────── */
export default function SupportPage() {
  const [searchVal, setSearchVal] = useState("");
  const [activeFaqCat, setActiveFaqCat] = useState("All");
  const [openFaq, setOpenFaq] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* auto-scroll chat */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { from: "user", text, time: now }]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      setMessages(prev => [...prev, { from: "agent", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1800);
  };

  const currentFaqs = faqs[activeFaqCat] || faqs["All"];

  return (
    <>

      {/* HERO */}
      <section className="support-hero">
        <div className="hero-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
          <div className="ring ring-4" />
        </div>
        <div className="hero-glow" />
        <div className="hero-eyebrow">🛟 Support Centre</div>
        <h1 className="hero-title">We're Here for <em>Every</em><br />Step of Your Journey</h1>
        <p className="hero-sub">Search our help centre, chat with a specialist, or browse guides — real help, not runarounds.</p>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="e.g. change my flight, refund status, baggage rules…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setSearchVal("")}
          />
          <button className="search-btn">Search</button>
        </div>
      </section>

      {/* QUICK LINKS */}
      <div className="quick-strip">
        {quickLinks.map((q, i) => (
          <button key={i} className="quick-chip">
            <span className="quick-chip-icon">{q.icon}</span>
            {q.label}
          </button>
        ))}
      </div>

      {/* TOPICS */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">Help Topics</span>
            <h2 className="section-title">Browse by Category</h2>
          </div>
          <div className="topics-grid">
            {topics.map((t, i) => (
              <div key={i} className={`topic-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="topic-icon-wrap">{t.icon}</div>
                <div className="topic-title">{t.title}</div>
                <p className="topic-desc">{t.desc}</p>
                <div className="topic-articles">→ {t.articles}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-layout">
            {/* Sidebar */}
            <div className="faq-sidebar reveal reveal-delay-1">
              <div className="faq-sidebar-title">Find your answer fast.</div>
              <p className="faq-sidebar-body">Filter by topic or scroll through our most commonly asked questions. Most answers are right here.</p>
              <div className="faq-cats">
                {faqCategories.map(cat => (
                  <button
                    key={cat}
                    className={`faq-cat-btn${activeFaqCat === cat ? " active" : ""}`}
                    onClick={() => { setActiveFaqCat(cat); setOpenFaq(null); }}
                  >{cat}</button>
                ))}
              </div>
            </div>
            {/* FAQ List */}
            <div className="faq-list reveal reveal-delay-2">
              {currentFaqs.map((item, i) => (
                <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.q}</span>
                    <span className="faq-chevron">▼</span>
                  </button>
                  <div className="faq-a">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Prefer Talking to a Person?</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card card-dark reveal reveal-delay-1">
              <div className="contact-icon">📞</div>
              <div className="contact-title">Phone Support</div>
              <p className="contact-desc">Speak directly with a travel specialist. Available 24/7 for urgent travel disruptions.</p>
              <div className="contact-action">
                +92 21 111 759 768
                <span className="contact-action-arrow">→</span>
              </div>
            </div>
            <div className="contact-card card-warm reveal reveal-delay-2">
              <div className="contact-icon">💬</div>
              <div className="contact-title">Live Chat</div>
              <p className="contact-desc">Average response under 2 minutes. Our agents handle everything from rebooking to refunds.</p>
              <div className="contact-action">
                Start a chat
                <span className="contact-action-arrow">→</span>
              </div>
            </div>
            <div className="contact-card card-light reveal reveal-delay-3">
              <div className="contact-icon">✉️</div>
              <div className="contact-title">Email Us</div>
              <p className="contact-desc">Non-urgent queries handled within 4 business hours. Attach your booking reference for faster help.</p>
              <div className="contact-action" style={{ color: "var(--color-pumpkin)" }}>
                support@skyroute.com
                <span className="contact-action-arrow" style={{ background: "var(--color-card)" }}>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CHAT DEMO */}
      <section className="chat-section">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
            <span className="section-tag">Live Chat</span>
            <h2 className="section-title">Chat With Our Team Right Now</h2>
          </div>
          <div className="chat-container reveal reveal-delay-1">
            {/* Top bar */}
            <div className="chat-topbar">
              <div className="chat-agent">
                <div className="agent-avatar">👩🏽‍💼</div>
                <div>
                  <div className="agent-name">Maya — SkyRoute Support</div>
                  <div className="agent-status">
                    <span className="status-dot" />
                    Online · Avg. reply 90 sec
                  </div>
                </div>
              </div>
              <button className="chat-close-btn">✕</button>
            </div>
            {/* Messages */}
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg${m.from === "user" ? " user" : ""}`}>
                  <div className="msg-avatar">{m.from === "agent" ? "👩🏽‍💼" : "🧑"}</div>
                  <div className="msg-group">
                    <div className="msg-bubble">{m.text}</div>
                    <div className="msg-time">{m.time}</div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-msg">
                  <div className="msg-avatar">👩🏽‍💼</div>
                  <div className="msg-bubble" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                    <div className="typing-bubble">
                      <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="chat-input-bar">
              <input
                className="chat-input"
                placeholder="Type your message…"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button className="chat-send" onClick={sendMessage}>➤</button>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM STATUS */}
      <div className="status-banner">
        <div className="status-inner">
          <div className="status-header">
            <div className="status-title">System Status</div>
            <div className="status-all-good">
              <div className="status-dot-green" />
              All systems operational
            </div>
          </div>
          <div className="status-grid">
            {statusItems.map((s, i) => (
              <div key={i} className="status-item">
                <span className="status-icon">{s.icon}</span>
                <div>
                  <div className="status-name">{s.name}</div>
                  <div className="status-state">✓ {s.state}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
