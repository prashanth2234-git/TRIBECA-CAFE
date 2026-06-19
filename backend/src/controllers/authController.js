import { z } from "zod";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    password: z.string().min(6)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export const register = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const exists = await User.findOne({ email: payload.email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ ...payload, role: "customer" });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    token: signToken(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  user.lastLogin = new Date();
  await user.save();

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    token: signToken(user)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
