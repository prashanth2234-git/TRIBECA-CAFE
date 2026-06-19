import { connectDB } from "./config/db.js";
import ContactMessage from "./models/ContactMessage.js";
import GalleryImage from "./models/GalleryImage.js";
import MenuItem from "./models/MenuItem.js";
import Reservation from "./models/Reservation.js";
import Review from "./models/Review.js";
import SiteContent from "./models/SiteContent.js";
import User from "./models/User.js";

function visual(seed = 1) {
  const colors = ["#2D4A3A", "#C8A96A", "#FAF8F3", "#7A5230"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850"><rect width="1200" height="850" fill="${colors[2]}"/><circle cx="${250 + seed * 17}" cy="190" r="220" fill="${colors[1]}" opacity=".45"/><path d="M130 720V340c0-76 62-138 138-138h664c76 0 138 62 138 138v380z" fill="${colors[0]}"/><path d="M250 720V420c0-52 42-94 94-94h90c52 0 94 42 94 94v300z" fill="${colors[2]}" opacity=".88"/><path d="M674 720V420c0-52 42-94 94-94h90c52 0 94 42 94 94v300z" fill="${colors[2]}" opacity=".88"/><rect x="430" y="150" width="340" height="64" rx="32" fill="${colors[0]}"/><text x="600" y="192" text-anchor="middle" font-family="Georgia" font-size="34" fill="${colors[2]}" letter-spacing="5">TRIBECA</text><circle cx="210" cy="650" r="84" fill="#4c7a55"/><circle cx="1000" cy="645" r="92" fill="#4c7a55"/><path d="M160 280c160 55 310 76 450 58 150-19 278-79 430-58" fill="none" stroke="${colors[3]}" stroke-width="34" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function seed() {
  await connectDB();
  await Promise.all([
    ContactMessage.deleteMany({}),
    GalleryImage.deleteMany({}),
    MenuItem.deleteMany({}),
    Reservation.deleteMany({}),
    Review.deleteMany({}),
    SiteContent.deleteMany({}),
    User.deleteMany({})
  ]);

  await User.create({
    name: "Tribeca Admin",
    email: "admin@tribecacafe.com",
    phone: "9000006256",
    password: "password123",
    role: "admin"
  });

  await MenuItem.create([
    { category: "Coffee & Matcha", name: "Tribeca Signature Latte", description: "Velvety espresso, vanilla bean, and gold dust foam.", price: 220, badge: "Bestseller", image: visual(1), isFeatured: true, views: 240 },
    { category: "Coffee & Matcha", name: "Ceremonial Matcha Cloud", description: "Stone-ground matcha with oat milk and honey cream.", price: 260, badge: "Chef Pick", image: visual(2), isFeatured: true, views: 210 },
    { category: "Starters", name: "Mediterranean Mezze Board", description: "Hummus, olives, pita crisps, feta, and seasonal dips.", price: 420, badge: "Share", image: visual(3), isFeatured: true, views: 188 },
    { category: "Pizza", name: "Woodfire Margherita", description: "San Marzano tomato, basil, mozzarella, and olive oil.", price: 520, badge: "Popular", image: visual(4), isFeatured: true, views: 230 },
    { category: "Pasta", name: "Truffle Mushroom Fettuccine", description: "Creamy wild mushroom sauce with parmesan and herbs.", price: 640, badge: "Premium", image: visual(5), isFeatured: true, views: 250 },
    { category: "Main Course", name: "Herb Roasted Cottage Steak", description: "Charred cottage cheese, herb jus, and garden greens.", price: 690, badge: "Signature", image: visual(6), isFeatured: true, views: 172 },
    { category: "Soups", name: "Tuscan Tomato Basil Soup", description: "Slow-roasted tomatoes, basil oil, and sourdough.", price: 280, badge: "Comfort", image: visual(7), views: 100 },
    { category: "Burgers", name: "Tribeca House Burger", description: "Brioche bun, crisp lettuce, caramelized onion, and house sauce.", price: 540, badge: "Popular", image: visual(8), views: 190 },
    { category: "Salads", name: "Citrus Burrata Salad", description: "Burrata, orange, greens, toasted seeds, and olive oil.", price: 460, badge: "Fresh", image: visual(9), views: 132 },
    { category: "Sandwiches", name: "Avocado Focaccia Melt", description: "Avocado, pesto, mozzarella, and grilled focaccia.", price: 430, badge: "Cafe Classic", image: visual(10), views: 164 }
  ]);

  await GalleryImage.create([
{
  category: "Exterior",
  title: "Grand Entrance",
  imageUrl: "/images/entrance.jpeg",
  alt: "Tribeca Cafe grand entrance"
},
{
  category: "Food",
  title: "Signature Dining Experience",
  imageUrl: "/images/food.jpeg",
  alt: "Dining experience at Tribeca Cafe"
},
{
  category: "Interior",
  title: "Mediterranean Dining Hall",
  imageUrl: "/images/interior.jpeg",
  alt: "Main dining area"
},
{
  category: "Exterior",
  title: "Tribeca Cafe Facade",
  imageUrl: "/images/view.jpeg",
  alt: "Cafe facade"
},
{
  category: "Nature",
  title: "Nature Inspired Entrance",
  imageUrl: "/images/entrance.jpeg",
  alt: "Nature entrance"
},
{
  category: "Ambience",
  title: "Evening Walkway",
  imageUrl: "/images/Night view.jpeg",
  alt: "Night ambience"
},
{
  category: "Books",
  title: "Reading Corner",
  imageUrl: "/images/Books section.jpeg",
  alt: "Books section"
},
{
  category: "Dining",
  title: "Cozy Private Lounge",
  imageUrl: "/images/dining.jpeg",
  alt: "Private dining"
},
{
  category: "Decor",
  title: "Artistic Courtyard",
  imageUrl: "/images/creativity.jpeg",
  alt: "Creative decor"
},
{
  category: "Beauty",
  title: "Soul Of Cafe",
  imageUrl: "/images/Soul of cafe.jpeg",
  alt: "Soul of cafe"
}
]);
  await Review.create([
    { customerName: "Aarav Mehta", rating: 5, review: "Tribeca feels like a resort cafe tucked into the city. The ambience is beautiful.", photo: visual(21) },
    { customerName: "Nisha Rao", rating: 5, review: "Perfect for family dinners and coffee dates. Warm, polished, and premium.", photo: visual(22) },
    { customerName: "Dev Kapoor", rating: 4, review: "Loved the matcha and wooden architecture. It photographs beautifully.", photo: visual(23) }
  ]);

  await Reservation.create([
    { name: "Priya Sharma", phone: "9000006256", email: "priya@example.com", date: "2026-06-18", time: "19:30", guests: 4, status: "confirmed" },
    { name: "Rahul Nair", phone: "9000006257", email: "rahul@example.com", date: "2026-06-18", time: "20:00", guests: 2, status: "pending" },
    { name: "Sneha Iyer", phone: "9000006258", email: "sneha@example.com", date: "2026-06-19", time: "13:00", guests: 6, status: "confirmed" }
  ]);

  await SiteContent.create([
    { key: "hero", title: "Homepage Hero", value: { tagline: "Where Great Food Meets Beautiful Moments", phone: "9000006256" } },
    { key: "hours", title: "Working Hours", value: "10:00 AM - 11:00 PM" },
    { key: "location", title: "Google Maps Location", value: "https://www.google.com/maps/place/Tribeca+cafe" }
  ]);

  console.log("Tribeca Cafe seed complete");
  console.log("Admin: admin@tribecacafe.com / password123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
