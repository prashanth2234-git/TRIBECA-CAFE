import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";
import { z } from "zod";
import ContactMessage from "../models/ContactMessage.js";
import GalleryImage from "../models/GalleryImage.js";
import MenuItem from "../models/MenuItem.js";
import Reservation from "../models/Reservation.js";
import Review from "../models/Review.js";
import SiteContent from "../models/SiteContent.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendAdminNotification } from "../services/emailService.js";
import { uploadBuffer } from "../services/cloudinaryService.js";
import { previewGallery, previewMenu, previewReservations, previewReviews } from "../services/previewData.js";

const clean = (value) => (typeof value === "string" ? sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim() : value);
const cleanBody = (body) => Object.fromEntries(Object.entries(body).map(([key, value]) => [key, clean(value)]));
const dbReady = () => mongoose.connection.readyState === 1;

export const menuSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.enum(["Coffee & Matcha", "Starters", "Pizza", "Pasta", "Main Course", "Soups", "Burgers", "Salads", "Sandwiches"]),
    description: z.string().min(8),
    price: z.coerce.number().min(0),
    image: z.string().optional(),
    badge: z.string().optional(),
    isFeatured: z.coerce.boolean().optional(),
    isAvailable: z.coerce.boolean().optional()
  })
});

export const reservationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().optional().or(z.literal("")),
    date: z.string().min(4),
    time: z.string().min(4),
    guests: z.coerce.number().min(1).max(40),
    specialRequests: z.string().optional()
  })
});

export const reviewSchema = z.object({
  body: z.object({
    customerName: z.string().min(2),
    review: z.string().min(8),
    rating: z.coerce.number().min(1).max(5),
    photo: z.string().optional(),
    isPublished: z.coerce.boolean().optional()
  })
});

export const gallerySchema = z.object({
  body: z.object({
    title: z.string().min(2),
    category: z.enum(["Exterior", "Interior", "Food", "Decor", "Ambience"]),
    imageUrl: z.string().optional(),
    alt: z.string().optional(),
    isHomepage: z.coerce.boolean().optional()
  })
});

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().optional().or(z.literal("")),
    message: z.string().min(4)
  })
});

export const contentSchema = z.object({
  body: z.object({
    key: z.string().min(2),
    title: z.string().min(2),
    value: z.any()
  })
});

export const listMenu = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json(previewMenu);
  const filter = { isAvailable: true };
  if (req.query.category) filter.category = req.query.category;
  const items = await MenuItem.find(filter).sort({ isFeatured: -1, createdAt: -1 });
  res.json(items);
});

export const adminListMenu = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json(previewMenu);
  const items = await MenuItem.find().sort({ createdAt: -1 });
  res.json(items);
});

export const createMenuItem = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(201).json({ _id: `preview-${Date.now()}`, ...cleanBody(req.validated.body) });
  const item = await MenuItem.create(cleanBody(req.validated.body));
  res.status(201).json(item);
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, cleanBody(req.validated.body), { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Menu item not found" });
  res.json(item);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export const createReservation = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(201).json({ _id: `preview-${Date.now()}`, status: "confirmed", ...cleanBody(req.validated.body) });
  const reservation = await Reservation.create(cleanBody(req.validated.body));
  await sendAdminNotification(
    "New Tribeca Cafe reservation",
    `<p>${reservation.name} reserved for ${reservation.guests} guests on ${reservation.date} at ${reservation.time}. Phone: ${reservation.phone}</p>`
  );
  res.status(201).json(reservation);
});

export const listReservations = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json(previewReservations);
  const reservations = await Reservation.find().sort({ date: -1, time: -1, createdAt: -1 }).limit(200);
  res.json(reservations);
});

export const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, cleanBody(req.body), { new: true, runValidators: true });
  if (!reservation) return res.status(404).json({ message: "Reservation not found" });
  res.json(reservation);
});

export const listGallery = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json(previewGallery);
  const images = await GalleryImage.find(req.query.category ? { category: req.query.category } : {}).sort({ sortOrder: 1, createdAt: -1 });
  res.json(images);
});

export const createGalleryImage = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(201).json({ _id: `preview-${Date.now()}`, ...cleanBody(req.validated.body) });
  const payload = cleanBody(req.validated.body);
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, "tribeca-cafe/gallery");
    payload.imageUrl = uploaded.secure_url;
    payload.cloudinaryPublicId = uploaded.public_id;
  }
  if (!payload.imageUrl) return res.status(400).json({ message: "imageUrl or image file is required" });
  const image = await GalleryImage.create(payload);
  res.status(201).json(image);
});

export const deleteGalleryImage = asyncHandler(async (req, res) => {
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export const listReviews = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json(previewReviews);
  const reviews = await Review.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json(reviews);
});

export const adminListReviews = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json(previewReviews);
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

export const createReview = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(201).json({ _id: `preview-${Date.now()}`, ...cleanBody(req.validated.body) });
  const review = await Review.create(cleanBody(req.validated.body));
  res.status(201).json(review);
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, cleanBody(req.validated.body), { new: true, runValidators: true });
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json(review);
});

export const createContactMessage = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(201).json({ _id: `preview-${Date.now()}`, status: "new", ...cleanBody(req.validated.body) });
  const message = await ContactMessage.create(cleanBody(req.validated.body));
  await sendAdminNotification("New Tribeca Cafe contact message", `<p>${message.name}: ${message.message}</p><p>Phone: ${message.phone}</p>`);
  res.status(201).json(message);
});

export const listContactMessages = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json([]);
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(200);
  res.json(messages);
});

export const getContent = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json([]);
  const content = await SiteContent.find();
  res.json(content);
});

export const upsertContent = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json({ _id: `preview-${Date.now()}`, ...cleanBody(req.validated.body) });
  const payload = cleanBody(req.validated.body);
  const content = await SiteContent.findOneAndUpdate({ key: payload.key }, payload, { upsert: true, new: true, runValidators: true });
  res.json(content);
});

export const getAnalytics = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({
      totalReservations: previewReservations.length,
      peakReservationHours: [{ hour: "19:30", count: 12 }, { hour: "20:00", count: 9 }],
      popularItems: previewMenu,
      recentReservations: previewReservations,
      customers: { new: 24, returning: 41 }
    });
  }
  const [totalReservations, peakReservationHours, popularItems, recentReservations, newCustomers] = await Promise.all([
    Reservation.countDocuments(),
    Reservation.aggregate([{ $group: { _id: "$time", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
    MenuItem.find().sort({ views: -1, isFeatured: -1 }).limit(5),
    Reservation.find().sort({ createdAt: -1 }).limit(8),
    Reservation.distinct("phone")
  ]);

  res.json({
    totalReservations,
    peakReservationHours: peakReservationHours.map((item) => ({ hour: item._id, count: item.count })),
    popularItems,
    recentReservations,
    customers: { new: newCustomers.length, returning: Math.max(totalReservations - newCustomers.length, 0) }
  });
});
