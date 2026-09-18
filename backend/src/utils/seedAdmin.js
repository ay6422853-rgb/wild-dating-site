import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

await connectDB();

const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";

if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");

const passwordHash = await bcrypt.hash(password, 12);
const dob = new Date("1990-01-01");

await User.findOneAndUpdate(
  { email },
  {
    name: "WILD Admin",
    email,
    passwordHash,
    dob,
    identity: "PREFER_NOT_TO_SAY",
    interestedIn: ["EVERYONE"],
    role: "ADMIN",
    status: "ACTIVE",
    emailVerified: true
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

console.log(`Admin ready: ${email}`);
await mongoose.disconnect();