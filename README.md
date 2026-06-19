# TRIBECA CAFE

Production-ready premium cafe website for TRIBECA CAFE, built as a luxury Mediterranean lifestyle destination with a React/Vite frontend, Express backend, MongoDB models, JWT admin auth, Cloudinary-ready gallery uploads, Nodemailer notifications, and analytics.

## Features

- Cinematic landing page with sticky glass navigation, hero carousel, smooth scrolling, scroll reveals, parallax-style imagery, and mobile-first layouts.
- Digital menu with category filters, search, featured dishes, prices, and admin add/edit/remove support.
- Gallery with masonry layout, image carousel behavior, lazy loading, fullscreen lightbox, zoom transitions, and Cloudinary upload endpoint.
- Table reservation system with confirmation, MongoDB storage, and admin notification email.
- Contact page with phone, WhatsApp, Google Maps, working hours, and contact form.
- Reviews/testimonials carousel-style section with admin management APIs.
- Admin dashboard for menu, gallery, reservations, reviews, homepage content, featured dishes, contact messages, and analytics.
- Analytics for total reservations, popular menu items, peak reservation hours, recent reservations, and customer statistics.
- SEO basics: meta tags, Open Graph, Twitter cards, structured data, `robots.txt`, and `sitemap.xml`.

## Tech Stack

Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Lucide Icons.

Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Helmet, CORS, rate limiting, sanitize-html, Multer, Cloudinary, Nodemailer.

## Quick Start

```bash
npm install
copy .env.example .env
npm run dev
```

For persistent data, set `MONGO_URI` in `.env` or `backend/.env`, then seed:

```bash
npm run seed
```

Admin login after seeding:

```text
admin@tribecacafe.com
password123
```

Frontend runs at `http://localhost:5173`.
Backend runs at `http://localhost:5000`.

## Environment

Required for production:

```text
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=
```

Cloudinary is optional for local preview if you use direct image URLs. Nodemailer is optional locally; reservation/contact records are still stored without SMTP.

## API Documentation

Auth:

- `POST /api/auth/register` customer registration.
- `POST /api/auth/login` returns JWT.
- `GET /api/auth/me` authenticated profile.

Menu:

- `GET /api/menu` public menu.
- `GET /api/menu/admin` admin list.
- `POST /api/menu` admin create.
- `PUT /api/menu/:id` admin update.
- `DELETE /api/menu/:id` admin delete.

Reservations:

- `POST /api/reservations` public table reservation.
- `GET /api/reservations` admin list.
- `PATCH /api/reservations/:id` admin status update.

Gallery:

- `GET /api/gallery` public gallery.
- `POST /api/gallery` admin create with `imageUrl` or multipart `image`.
- `DELETE /api/gallery/:id` admin delete.

Reviews:

- `GET /api/reviews` public published reviews.
- `GET /api/reviews/admin` admin list.
- `POST /api/reviews` admin create.
- `PUT /api/reviews/:id` admin update.

Contact and content:

- `POST /api/contact` public contact form.
- `GET /api/contact` admin messages.
- `GET /api/content` public content.
- `PUT /api/content` admin content upsert.
- `GET /api/analytics` admin analytics.

Admin endpoints require:

```text
Authorization: Bearer <jwt>
```

## Deployment

Frontend on Vercel:

1. Set root command to `npm run build --workspace frontend`.
2. Set output directory to `frontend/dist`.
3. Add `VITE_API_URL=https://your-render-api.onrender.com/api`.

Backend on Render:

1. Build command: `npm install`.
2. Start command: `npm run start --workspace backend`.
3. Add MongoDB Atlas, JWT, Cloudinary, SMTP, and `CLIENT_URL` environment variables.

MongoDB Atlas:

1. Create a database named `tribeca-cafe`.
2. Add the Atlas connection string to `MONGO_URI`.
3. Run `npm run seed` once from a trusted environment.

## Uploaded Images

No cafe image files were present in the local attachment folder during implementation, so the site ships with original project-local generated visual treatments and a Cloudinary-ready gallery system. Drop real Tribeca Cafe images into Cloudinary through `/api/gallery` or replace gallery records after seeding to make the website use the uploaded cafe photography as the primary assets.
