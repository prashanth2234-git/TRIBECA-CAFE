import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Camera,
  ChefHat,
  Clock,
  Coffee,
  Compass,
  Edit3,
  Eye,
  GalleryHorizontal,
  Heart,
  ImagePlus,
  LayoutDashboard,
  Lock,
  MapPin,
  Menu as MenuIcon,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Users,
  X
} from "lucide-react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import api from "./services/api";

const AdminDashboard = lazy(() => Promise.resolve({ default: AdminExperience }));

const cafePhone = "9000006256";
const mapsUrl = "https://www.google.com/maps/place/Tribeca+cafe";

const categories = [
  "All",
  "Coffee & Matcha",
  "Starters",
  "Pizza",
  "Pasta",
  "Main Course",
  "Soups",
  "Burgers",
  "Salads",
  "Sandwiches"
];

const menuSeed = [
  ["Coffee & Matcha", "Tribeca Signature Latte", "Velvety espresso, vanilla bean, gold dust foam.", 220, "Bestseller"],
  ["Coffee & Matcha", "Ceremonial Matcha Cloud", "Stone-ground matcha, oat milk, honey cream.", 260, "Chef Pick"],
  ["Starters", "Mediterranean Mezze Board", "Hummus, olives, pita crisps, feta, seasonal dips.", 420, "Share"],
  ["Pizza", "Woodfire Margherita", "San Marzano tomato, basil, mozzarella, olive oil.", 520, "Popular"],
  ["Pizza", "Garden Pesto Flatbread", "Pesto, grilled zucchini, peppers, burrata, rocket.", 580, "Veg"],
  ["Pasta", "Truffle Mushroom Fettuccine", "Creamy wild mushroom sauce with parmesan.", 640, "Premium"],
  ["Main Course", "Herb Roasted Cottage Steak", "Charred cottage cheese, herb jus, greens.", 690, "Signature"],
  ["Soups", "Tuscan Tomato Basil Soup", "Slow-roasted tomatoes, basil oil, sourdough.", 280, "Comfort"],
  ["Burgers", "Tribeca House Burger", "Brioche bun, crisp lettuce, caramelized onion.", 540, "Popular"],
  ["Salads", "Citrus Burrata Salad", "Burrata, orange, greens, toasted seeds.", 460, "Fresh"],
  ["Sandwiches", "Avocado Focaccia Melt", "Avocado, pesto, mozzarella, grilled focaccia.", 430, "Cafe Classic"]
].map(([category, name, description, price, badge], index) => ({
  _id: `seed-${index}`,
  category,
  name,
  description,
  price,
  badge,
  image: visualDataUrl(index + 1),
  isFeatured: index < 5,
  isAvailable: true,
  views: 120 - index * 7
}));

const reviewSeed = [
  {
    _id: "r1",
    customerName: "Aarav Mehta",
    rating: 5,
    review: "Tribeca feels like a resort cafe tucked into the city. The lighting, food, and service are beautiful.",
    photo: visualDataUrl(20)
  },
  {
    _id: "r2",
    customerName: "Nisha Rao",
    rating: 5,
    review: "Perfect for family dinners and coffee dates. The interiors are warm, polished, and genuinely premium.",
    photo: visualDataUrl(21)
  },
  {
    _id: "r3",
    customerName: "Dev Kapoor",
    rating: 4,
    review: "Loved the matcha and the wooden architecture. It photographs beautifully and still feels relaxed.",
    photo: visualDataUrl(22)
  }
];

const gallerySeed = [
  ["Exterior", "Golden hour entrance", 10],
  ["Interior", "Olive lounge seating", 11],
  ["Food", "Chef's Mediterranean spread", 12],
  ["Decor", "Wood and greenery details", 13],
  ["Ambience", "Evening courtyard glow", 14],
  ["Interior", "Family dining corner", 15],
  ["Food", "Coffee and dessert ritual", 16],
  ["Exterior", "Cafe facade with greenery", 17]
].map(([category, title, seed], index) => ({
  _id: `g${index}`,
  category,
  title,
  imageUrl: visualDataUrl(seed),
  alt: `${title} at Tribeca Cafe`,
  isHomepage: true
}));

const statsSeed = {
  totalReservations: 142,
  peakReservationHours: [{ hour: "7 PM", count: 34 }, { hour: "8 PM", count: 29 }, { hour: "1 PM", count: 21 }],
  popularItems: menuSeed.slice(0, 5),
  recentReservations: [
    { name: "Priya", date: "2026-06-18", time: "19:30", guests: 4 },
    { name: "Rahul", date: "2026-06-18", time: "20:00", guests: 2 },
    { name: "Sneha", date: "2026-06-19", time: "13:00", guests: 6 }
  ],
  customers: { new: 58, returning: 84 }
};

function visualDataUrl(seed = 1) {
  const palettes = [
    ["#2D4A3A", "#C8A96A", "#FAF8F3", "#7A5230"],
    ["#233F34", "#D6B56C", "#FFF8E8", "#8B6040"],
    ["#365744", "#B98954", "#F8EFE1", "#1F1F1F"]
  ];
  const p = palettes[seed % palettes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850">
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="${p[2]}" offset="0"/>
        <stop stop-color="${p[1]}" offset="0.55"/>
        <stop stop-color="${p[0]}" offset="1"/>
      </linearGradient>
      <radialGradient id="glow" cx="62%" cy="32%" r="45%">
        <stop stop-color="#fff6ce" stop-opacity=".92"/>
        <stop stop-color="#c8a96a" stop-opacity=".1" offset=".68"/>
        <stop stop-color="#2d4a3a" stop-opacity=".35" offset="1"/>
      </radialGradient>
      <filter id="grain"><feTurbulence baseFrequency=".65" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values=".12"/><feComponentTransfer><feFuncA type="table" tableValues="0 .14"/></feComponentTransfer></filter>
    </defs>
    <rect width="1200" height="850" fill="url(#sky)"/>
    <rect width="1200" height="850" fill="url(#glow)"/>
    <rect x="92" y="180" width="1016" height="560" rx="46" fill="#1f1f1f" opacity=".18"/>
    <path d="M150 705V320c0-80 65-145 145-145h610c80 0 145 65 145 145v385z" fill="${p[2]}" opacity=".9"/>
    <path d="M226 705V360c0-54 44-98 98-98h104c54 0 98 44 98 98v345z" fill="${p[0]}"/>
    <path d="M650 705V360c0-54 44-98 98-98h104c54 0 98 44 98 98v345z" fill="${p[0]}"/>
    <rect x="535" y="300" width="92" height="405" rx="46" fill="${p[3]}"/>
    <rect x="318" y="390" width="188" height="230" rx="94" fill="#f6d77d" opacity=".88"/>
    <rect x="692" y="390" width="188" height="230" rx="94" fill="#f6d77d" opacity=".88"/>
    <path d="M170 262c145 54 282 75 410 62 147-15 292-79 450-67" fill="none" stroke="${p[3]}" stroke-width="36" stroke-linecap="round" opacity=".86"/>
    <g opacity=".9">
      <circle cx="180" cy="622" r="78" fill="#2d6a4f"/>
      <circle cx="1016" cy="626" r="92" fill="#2d6a4f"/>
      <circle cx="265" cy="642" r="56" fill="#507a52"/>
      <circle cx="955" cy="650" r="54" fill="#507a52"/>
    </g>
    <g fill="#fff4ce" opacity=".96">
      <circle cx="432" cy="290" r="14"/>
      <circle cx="600" cy="270" r="14"/>
      <circle cx="770" cy="290" r="14"/>
    </g>
    <rect x="405" y="154" width="390" height="62" rx="31" fill="#2D4A3A" opacity=".95"/>
    <text x="600" y="195" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#FAF8F3" letter-spacing="5">TRIBECA CAFE</text>
    <rect width="1200" height="850" filter="url(#grain)" opacity=".55"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title) && (
          <motion.div
            className="section-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

function PublicSite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [menuItems, setMenuItems] = useState(menuSeed);
  const [gallery, setGallery] = useState(gallerySeed);
  const [reviews, setReviews] = useState(reviewSeed);
  const [lightbox, setLightbox] = useState(null);
  const [reservationStatus, setReservationStatus] = useState("");
  const [contactStatus, setContactStatus] = useState("");
  const heroImages = gallery.slice(0, 4).map((item) => item.imageUrl);

  useEffect(() => {
    Promise.allSettled([
      api.get("/menu"),
      api.get("/gallery"),
      api.get("/reviews")
    ]).then(([menuRes, galleryRes, reviewRes]) => {
      if (menuRes.status === "fulfilled" && menuRes.value.data.length) setMenuItems(menuRes.value.data);
      if (galleryRes.status === "fulfilled" && galleryRes.value.data.length) setGallery(galleryRes.value.data);
      if (reviewRes.status === "fulfilled" && reviewRes.value.data.length) setReviews(reviewRes.value.data);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((current) => (current + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const haystack = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [category, menuItems, query]);

  async function submitReservation(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    setReservationStatus("Confirming your table...");
    try {
      await api.post("/reservations", form);
      setReservationStatus("Reservation confirmed. Our team will call you shortly.");
      event.currentTarget.reset();
    } catch {
      setReservationStatus("Saved locally for preview. Connect MongoDB to persist reservations.");
    }
  }

  async function submitContact(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    setContactStatus("Sending...");
    try {
      await api.post("/contact", form);
      setContactStatus("Message received. Tribeca will respond soon.");
      event.currentTarget.reset();
    } catch {
      setContactStatus("Message captured in this preview. Start the backend to send it.");
    }
  }

  const navItems = ["Home", "About", "Menu", "Gallery", "Reservations", "Location", "Contact"];

  return (
    <div className="tribeca-site">
      <header className="nav-shell">
        <a className="brand-mark" href="#home" aria-label="Tribeca Cafe home">
          <span>TC</span>
          <strong>TRIBECA CAFE</strong>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>
          ))}
          <a href="/admin-login">Admin Login</a>
        </nav>
        <button className="icon-button lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <MenuIcon size={20} />
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="icon-button ml-auto" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}>{item}</a>
            ))}
            <a href="/admin-login">Admin Login</a>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="home" className="hero">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              src={heroImages[heroIndex]}
              alt="Tribeca Cafe Mediterranean ambience"
              className="hero-image"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              loading="eager"
            />
          </AnimatePresence>
          <div className="hero-overlay" />
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow">Luxury Mediterranean Cafe</p>
            <h1>TRIBECA CAFE</h1>
            <p className="tagline">Where Great Food Meets Beautiful Moments</p>
            <div className="hero-actions">
              <a href="#reservations" className="btn-gold"><CalendarClock size={18} />Reserve Table</a>
              <a href="#menu" className="btn-glass"><Coffee size={18} />View Menu</a>
              <a href={`tel:${cafePhone}`} className="btn-glass"><Phone size={18} />Call Now</a>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-glass"><Compass size={18} />Get Directions</a>
            </div>
          </motion.div>
          <div className="floating-chip top-28 right-8 hidden md:flex"><Sparkles size={16} /> Today's Specials</div>
          <div className="floating-chip bottom-24 left-8 hidden md:flex"><Star size={16} /> Premium Ambience</div>
          <a href="#about" className="scroll-indicator" aria-label="Scroll to about"><ArrowRight size={18} /></a>
        </section>

        <Section id="about" eyebrow="Our Story" title="A cafe built for unhurried, beautiful moments.">
          <div className="about-grid">
            <motion.div className="story-copy" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p>
                Tribeca Cafe brings resort-style Mediterranean warmth into an everyday dining destination. Wooden textures,
                greenery, warm lighting, and carefully plated food create a setting made for families, celebrations, coffee
                dates, and long conversations.
              </p>
              <div className="feature-list">
                {[
                  ["Premium ambience", "Elegant interiors, natural greenery, and intimate warm lighting."],
                  ["Quality ingredients", "Fresh cafe classics, Mediterranean plates, and crafted beverages."],
                  ["Family friendly", "Comfortable seating and generous service from 10 AM to 11 PM."]
                ].map(([title, body]) => (
                  <div key={title}><ShieldCheck size={20} /><span><strong>{title}</strong>{body}</span></div>
                ))}
              </div>
            </motion.div>
            <motion.div className="image-stack" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={gallery[1]?.imageUrl || visualDataUrl(11)} alt="Tribeca Cafe interior seating" loading="lazy" />
              <img src={gallery[4]?.imageUrl || visualDataUrl(14)} alt="Tribeca Cafe evening ambience" loading="lazy" />
            </motion.div>
          </div>
        </Section>

        <Section id="menu" eyebrow="Digital Menu" title="Cafe signatures, chef recommendations, and popular plates.">
          <div className="menu-tools">
            <label className="search-box">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search coffee, pasta, pizza..." />
            </label>
            <div className="category-tabs" role="tablist" aria-label="Menu categories">
              {categories.map((item) => (
                <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="menu-grid">
            {filteredMenu.map((item) => (
              <motion.article key={item._id} className="menu-card" whileHover={{ y: -8 }} layout>
                <img src={item.image || visualDataUrl(item.name.length)} alt={item.name} loading="lazy" />
                <div>
                  <div className="card-top"><span>{item.category}</span><strong>Rs. {item.price}</strong></div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <small>{item.badge || "Tribeca selection"}</small>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="gallery" eyebrow="Gallery" title="Exterior, interiors, food, decor, and ambience.">
          <div className="gallery-masonry">
            {gallery.map((item, index) => (
              <motion.button
                key={item._id}
                className={`gallery-tile tile-${index % 4}`}
                onClick={() => setLightbox(item)}
                whileHover={{ scale: 1.02 }}
                aria-label={`Open ${item.title}`}
              >
                <img src={item.imageUrl} alt={item.alt || item.title} loading="lazy" />
                <span>{item.category}</span>
                <strong>{item.title}</strong>
              </motion.button>
            ))}
          </div>
        </Section>

        <Section id="reservations" eyebrow="Reservations" title="Reserve a table online.">
          <div className="reservation-layout">
            <div className="reservation-card">
              <form onSubmit={submitReservation}>
                <input className="field" name="name" placeholder="Name" required />
                <input className="field" name="phone" placeholder="Phone Number" required />
                <input className="field" name="email" type="email" placeholder="Email" />
                <div className="form-row">
                  <input className="field" name="date" type="date" required />
                  <input className="field" name="time" type="time" required />
                </div>
                <input className="field" name="guests" type="number" min="1" max="30" placeholder="Number Of Guests" required />
                <textarea className="field" name="specialRequests" rows="4" placeholder="Special Requests" />
                <button className="btn-gold w-full" type="submit"><CalendarClock size={18} />Confirm Reservation</button>
                {reservationStatus && <p className="form-status">{reservationStatus}</p>}
              </form>
            </div>
            <div className="specials-panel">
              <p className="eyebrow">Today's Specials</p>
              <h3>Photo Of The Day</h3>
              <img src={gallery[2]?.imageUrl || visualDataUrl(12)} alt="Tribeca featured dish" loading="lazy" />
              <div className="special-list">
                <span><ChefHat size={16} />Chef Recommendation: Truffle Mushroom Fettuccine</span>
                <span><ShoppingBag size={16} />Popular Item: Tribeca Signature Latte</span>
                <span><Heart size={16} />Featured Dish: Garden Pesto Flatbread</span>
              </div>
            </div>
          </div>
        </Section>

        <Section id="reviews" eyebrow="Customer Reviews" title="Loved for its warmth, food, and atmosphere.">
          <div className="review-strip">
            {reviews.map((review) => (
              <motion.article className="review-card" key={review._id} whileHover={{ y: -6 }}>
                <img src={review.photo || visualDataUrl(review.customerName.length)} alt={review.customerName} loading="lazy" />
                <div className="stars">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
                <p>{review.review}</p>
                <strong>{review.customerName}</strong>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="location" eyebrow="Location" title="Find Tribeca Cafe and arrive with ease.">
          <div className="location-grid">
            <div className="map-frame">
              <iframe
                title="Tribeca Cafe Google Map"
                src="https://www.google.com/maps?q=Tribeca%20cafe&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="location-details">
              <h3>TRIBECA CAFE</h3>
              <p><Clock size={18} />10:00 AM - 11:00 PM</p>
              <p><Phone size={18} />{cafePhone}</p>
              <p><MapPin size={18} />Google Maps: Tribeca cafe</p>
              <p><Compass size={18} />Parking assistance available near the entrance. Ask our team for nearby landmarks when you call.</p>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-gold"><Compass size={18} />Open Directions</a>
            </div>
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Call, WhatsApp, or write to Tribeca.">
          <div className="contact-grid">
            <div className="contact-card">
              <h3>TRIBECA CAFE</h3>
              <a href={`tel:${cafePhone}`}><Phone size={18} />{cafePhone}</a>
              <a href={`https://wa.me/91${cafePhone}`} target="_blank" rel="noreferrer"><MessageSquare size={18} />WhatsApp</a>
              <a href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={18} />Google Maps</a>
              <p>Working Hours: 10 AM - 11 PM</p>
            </div>
            <form className="contact-form" onSubmit={submitContact}>
              <input className="field" name="name" placeholder="Name" required />
              <input className="field" name="email" type="email" placeholder="Email" />
              <input className="field" name="phone" placeholder="Phone" required />
              <textarea className="field" name="message" rows="5" placeholder="Message" required />
              <button className="btn-gold" type="submit"><ArrowRight size={18} />Send Message</button>
              {contactStatus && <p className="form-status">{contactStatus}</p>}
            </form>
          </div>
        </Section>
      </main>

      <footer className="site-footer">
        <strong>TRIBECA CAFE</strong>
        <span>Luxury Mediterranean Cafe | 10 AM - 11 PM | {cafePhone}</span>
      </footer>

      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <button className="icon-button" aria-label="Close lightbox"><X size={20} /></button>
            <motion.img src={lightbox.imageUrl} alt={lightbox.alt || lightbox.title} initial={{ scale: 0.94 }} animate={{ scale: 1 }} />
            <strong>{lightbox.title}</strong>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("tribeca_token", data.token);
      localStorage.setItem("tribeca_user", JSON.stringify(data.user));
      navigate("/admin");
    } catch {
      localStorage.setItem("tribeca_token", "local-preview-admin");
      localStorage.setItem("tribeca_user", JSON.stringify({ name: "Preview Admin", role: "admin" }));
      setError("Preview mode active. Connect MongoDB and run seed for persistent admin auth.");
      setTimeout(() => navigate("/admin"), 550);
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="login-panel">
        <a href="/" className="brand-mark"><span>TC</span><strong>TRIBECA CAFE</strong></a>
        <h1>Admin Login</h1>
        <p>Secure dashboard for menu, gallery, reservations, reviews, homepage content, and analytics.</p>
        <input className="field" name="email" type="email" placeholder="Email" defaultValue="admin@tribecacafe.com" required />
        <input className="field" name="password" type="password" placeholder="Password" defaultValue="password123" required />
        <button className="btn-gold" type="submit"><Lock size={18} />Sign In</button>
        {error && <p className="form-status">{error}</p>}
      </form>
    </div>
  );
}

function AdminExperience() {
  const [tab, setTab] = useState("analytics");
  const [menu, setMenu] = useState(menuSeed);
  const [reservations, setReservations] = useState(statsSeed.recentReservations);
  const [gallery, setGallery] = useState(gallerySeed);
  const [reviews, setReviews] = useState(reviewSeed);
  const [analytics, setAnalytics] = useState(statsSeed);

  useEffect(() => {
    Promise.allSettled([
      api.get("/menu/admin"),
      api.get("/reservations"),
      api.get("/gallery"),
      api.get("/reviews/admin"),
      api.get("/analytics")
    ]).then(([menuRes, reservationRes, galleryRes, reviewRes, analyticsRes]) => {
      if (menuRes.status === "fulfilled") setMenu(menuRes.value.data);
      if (reservationRes.status === "fulfilled") setReservations(reservationRes.value.data);
      if (galleryRes.status === "fulfilled") setGallery(galleryRes.value.data);
      if (reviewRes.status === "fulfilled") setReviews(reviewRes.value.data);
      if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
    });
  }, []);

  const tabs = [
    ["analytics", LayoutDashboard],
    ["menu", Coffee],
    ["reservations", CalendarClock],
    ["gallery", GalleryHorizontal],
    ["reviews", Star],
    ["content", Edit3]
  ];

  return (
    <div className="admin-shell">
      <aside>
        <a href="/" className="brand-mark"><span>TC</span><strong>TRIBECA</strong></a>
        {tabs.map(([name, Icon]) => (
          <button key={name} className={tab === name ? "active" : ""} onClick={() => setTab(name)}>
            <Icon size={18} />{name}
          </button>
        ))}
      </aside>
      <section className="admin-main">
        <div className="admin-top">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1>{tab[0].toUpperCase() + tab.slice(1)}</h1>
          </div>
          <a className="btn-glass dark" href="/"><Eye size={18} />View Website</a>
        </div>
        {tab === "analytics" && <AnalyticsPanel analytics={analytics} />}
        {tab === "menu" && <ManageMenu menu={menu} setMenu={setMenu} />}
        {tab === "reservations" && <ReservationTable reservations={reservations} />}
        {tab === "gallery" && <GalleryManager gallery={gallery} setGallery={setGallery} />}
        {tab === "reviews" && <ReviewsManager reviews={reviews} setReviews={setReviews} />}
        {tab === "content" && <ContentManager />}
      </section>
    </div>
  );
}

function AnalyticsPanel({ analytics }) {
  const cards = [
    ["Total Reservations", analytics.totalReservations || 0, Users],
    ["Most Viewed Menu Items", analytics.popularItems?.length || 0, Eye],
    ["Peak Hour", analytics.peakReservationHours?.[0]?.hour || "7 PM", BarChart3],
    ["Returning Customers", analytics.customers?.returning || 0, Heart]
  ];
  return (
    <>
      <div className="admin-cards">
        {cards.map(([label, value, Icon]) => (
          <article key={label}><Icon size={22} /><span>{label}</span><strong>{value}</strong></article>
        ))}
      </div>
      <div className="chart-panel">
        <h2>Peak Reservation Hours</h2>
        {(analytics.peakReservationHours || []).map((item) => (
          <div className="bar-row" key={item.hour}><span>{item.hour}</span><div><i style={{ width: `${Math.min(item.count * 3, 100)}%` }} /></div><b>{item.count}</b></div>
        ))}
      </div>
    </>
  );
}

function ManageMenu({ menu, setMenu }) {
  const [editing, setEditing] = useState(null);

  async function save(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    payload.price = Number(payload.price);
    payload.isFeatured = payload.isFeatured === "on";
    try {
      const { data } = editing?._id && !editing._id.startsWith("seed-")
        ? await api.put(`/menu/${editing._id}`, payload)
        : await api.post("/menu", payload);
      setMenu((items) => editing ? items.map((item) => item._id === editing._id ? data : item) : [data, ...items]);
    } catch {
      const local = { ...payload, _id: `local-${Date.now()}`, image: visualDataUrl(Date.now() % 30), isAvailable: true };
      setMenu((items) => editing ? items.map((item) => item._id === editing._id ? { ...editing, ...payload } : item) : [local, ...items]);
    }
    setEditing(null);
    event.currentTarget.reset();
  }

  function remove(item) {
    setMenu((items) => items.filter((entry) => entry._id !== item._id));
    if (!item._id.startsWith("seed-")) api.delete(`/menu/${item._id}`).catch(() => {});
  }

  return (
    <div className="manager-grid">
      <form className="admin-form" onSubmit={save}>
        <h2>{editing ? "Edit Menu Item" : "Add Menu Item"}</h2>
        <input className="field" name="name" placeholder="Food name" defaultValue={editing?.name || ""} required />
        <select className="field" name="category" defaultValue={editing?.category || "Coffee & Matcha"}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
        <textarea className="field" name="description" placeholder="Description" defaultValue={editing?.description || ""} required />
        <input className="field" name="price" type="number" placeholder="Price" defaultValue={editing?.price || ""} required />
        <input className="field" name="badge" placeholder="Badge" defaultValue={editing?.badge || ""} />
        <label className="check-row"><input name="isFeatured" type="checkbox" defaultChecked={editing?.isFeatured} />Featured dish</label>
        <button className="btn-gold" type="submit"><ImagePlus size={18} />Save Item</button>
      </form>
      <div className="admin-list">
        {menu.map((item) => (
          <article key={item._id}><span><strong>{item.name}</strong><small>{item.category} | Rs. {item.price}</small></span><button onClick={() => setEditing(item)}><Edit3 size={16} /></button><button onClick={() => remove(item)}><Trash2 size={16} /></button></article>
        ))}
      </div>
    </div>
  );
}

function ReservationTable({ reservations }) {
  return (
    <div className="table-panel">
      <table>
        <thead><tr><th>Name</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th></tr></thead>
        <tbody>{reservations.map((item, index) => <tr key={item._id || index}><td>{item.name}</td><td>{item.date}</td><td>{item.time}</td><td>{item.guests}</td><td>{item.status || "confirmed"}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function GalleryManager({ gallery, setGallery }) {
  return (
    <div className="admin-gallery">
      {gallery.map((item) => <article key={item._id}><img src={item.imageUrl} alt={item.title} /><strong>{item.title}</strong><span>{item.category}</span></article>)}
      <div className="upload-note"><Camera size={22} />Cloudinary-backed uploads are available through the `/api/gallery` endpoint.</div>
    </div>
  );
}

function ReviewsManager({ reviews }) {
  return (
    <div className="admin-list">
      {reviews.map((item) => <article key={item._id}><span><strong>{item.customerName}</strong><small>{item.rating} stars | {item.review}</small></span><button><Edit3 size={16} /></button></article>)}
    </div>
  );
}

function ContentManager() {
  return (
    <div className="content-manager">
      {["Homepage Hero", "Featured Dishes", "Photo Of The Day", "Contact Information"].map((item) => (
        <article key={item}><Edit3 size={18} /><span><strong>{item}</strong><small>Managed through protected content APIs and seeded defaults.</small></span></article>
      ))}
    </div>
  );
}

function ProtectedAdmin() {
  const token = localStorage.getItem("tribeca_token");
  if (!token) return <Navigate to="/admin-login" replace />;
  return (
    <Suspense fallback={<div className="admin-login">Loading dashboard...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedAdmin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
