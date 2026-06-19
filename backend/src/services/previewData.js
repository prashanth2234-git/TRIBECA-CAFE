function visual(seed = 1) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850"><rect width="1200" height="850" fill="#FAF8F3"/><circle cx="${240 + seed * 19}" cy="190" r="220" fill="#C8A96A" opacity=".45"/><path d="M130 720V340c0-76 62-138 138-138h664c76 0 138 62 138 138v380z" fill="#2D4A3A"/><path d="M250 720V420c0-52 42-94 94-94h90c52 0 94 42 94 94v300z" fill="#FAF8F3" opacity=".88"/><path d="M674 720V420c0-52 42-94 94-94h90c52 0 94 42 94 94v300z" fill="#FAF8F3" opacity=".88"/><rect x="430" y="150" width="340" height="64" rx="32" fill="#2D4A3A"/><text x="600" y="192" text-anchor="middle" font-family="Georgia" font-size="34" fill="#FAF8F3" letter-spacing="5">TRIBECA</text><circle cx="210" cy="650" r="84" fill="#4c7a55"/><circle cx="1000" cy="645" r="92" fill="#4c7a55"/><path d="M160 280c160 55 310 76 450 58 150-19 278-79 430-58" fill="none" stroke="#7A5230" stroke-width="34" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const previewMenu = [
  ["Coffee & Matcha", "Tribeca Signature Latte", "Velvety espresso, vanilla bean, and gold dust foam.", 220, "Bestseller"],
  ["Coffee & Matcha", "Ceremonial Matcha Cloud", "Stone-ground matcha with oat milk and honey cream.", 260, "Chef Pick"],
  ["Starters", "Mediterranean Mezze Board", "Hummus, olives, pita crisps, feta, and seasonal dips.", 420, "Share"],
  ["Pizza", "Woodfire Margherita", "San Marzano tomato, basil, mozzarella, and olive oil.", 520, "Popular"],
  ["Pasta", "Truffle Mushroom Fettuccine", "Creamy wild mushroom sauce with parmesan and herbs.", 640, "Premium"]
].map(([category, name, description, price, badge], index) => ({
  _id: `preview-menu-${index}`,
  category,
  name,
  description,
  price,
  badge,
  image: [
  "/images/food.jpeg",
  "/images/dining.jpeg",
  "/images/beauty.jpeg",
  "/images/Soul of cafe.jpeg",
  "/images/view.jpeg"
][index],
  isFeatured: index < 4,
  isAvailable: true,
  views: 200 - index * 10
}));

export const previewGallery = [
  ["Exterior", "Golden hour entrance", 11],
  ["Interior", "Olive lounge seating", 12],
  ["Food", "Chef's Mediterranean spread", 13],
  ["Decor", "Wood and greenery details", 14],
  ["Ambience", "Evening courtyard glow", 15]
].map(([category, title, seed], index) => ({
  _id: `preview-gallery-${index}`,
  category,
  title,
  imageUrl: [
  "/images/entrance.jpeg",
  "/images/dining.jpeg",
  "/images/food.jpeg",
  "/images/interior.jpeg",
  "/images/Night view.jpeg"
][index],
  alt: `${title} at Tribeca Cafe`,
  isHomepage: true
}));

export const previewReviews = [
  { _id: "preview-review-1", customerName: "Aarav Mehta", rating: 5, review: "Tribeca feels like a resort cafe tucked into the city.", photo: visual(21), isPublished: true },
  { _id: "preview-review-2", customerName: "Nisha Rao", rating: 5, review: "Perfect for family dinners and coffee dates. Warm and premium.", photo: visual(22), isPublished: true },
  { _id: "preview-review-3", customerName: "Dev Kapoor", rating: 4, review: "Loved the matcha and wooden architecture.", photo: visual(23), isPublished: true }
];

export const previewReservations = [
  { _id: "preview-reservation-1", name: "Priya Sharma", date: "2026-06-18", time: "19:30", guests: 4, status: "confirmed" },
  { _id: "preview-reservation-2", name: "Rahul Nair", date: "2026-06-18", time: "20:00", guests: 2, status: "pending" }
];
