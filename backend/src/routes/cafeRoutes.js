import express from "express";
import multer from "multer";
import {
  adminListMenu,
  adminListReviews,
  contactSchema,
  contentSchema,
  createContactMessage,
  createGalleryImage,
  createMenuItem,
  createReservation,
  createReview,
  deleteGalleryImage,
  deleteMenuItem,
  gallerySchema,
  getAnalytics,
  getContent,
  listContactMessages,
  listGallery,
  listMenu,
  listReservations,
  listReviews,
  menuSchema,
  reservationSchema,
  reviewSchema,
  updateMenuItem,
  updateReservation,
  updateReview,
  upsertContent
} from "../controllers/cafeController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith("image/")) return callback(new Error("Only image uploads are allowed"));
    callback(null, true);
  }
});

const router = express.Router();
const adminOnly = [protect, authorize("admin", "manager")];

router.get("/menu", listMenu);
router.get("/menu/admin", adminOnly, adminListMenu);
router.post("/menu", adminOnly, validate(menuSchema), createMenuItem);
router.put("/menu/:id", adminOnly, validate(menuSchema), updateMenuItem);
router.delete("/menu/:id", adminOnly, deleteMenuItem);

router.post("/reservations", validate(reservationSchema), createReservation);
router.get("/reservations", adminOnly, listReservations);
router.patch("/reservations/:id", adminOnly, updateReservation);

router.get("/gallery", listGallery);
router.post("/gallery", adminOnly, upload.single("image"), validate(gallerySchema), createGalleryImage);
router.delete("/gallery/:id", adminOnly, deleteGalleryImage);

router.get("/reviews", listReviews);
router.get("/reviews/admin", adminOnly, adminListReviews);
router.post("/reviews", adminOnly, validate(reviewSchema), createReview);
router.put("/reviews/:id", adminOnly, validate(reviewSchema), updateReview);

router.post("/contact", validate(contactSchema), createContactMessage);
router.get("/contact", adminOnly, listContactMessages);

router.get("/content", getContent);
router.put("/content", adminOnly, validate(contentSchema), upsertContent);

router.get("/analytics", adminOnly, getAnalytics);

export default router;
