import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  passwordHash: { type: String, required: true, select: false },
  dob: { type: Date, required: true },
  identity: {
    type: String,
    enum: ["MAN", "WOMAN", "NON_BINARY", "OTHER", "PREFER_NOT_TO_SAY"],
    required: true
  },
  interestedIn: [{
    type: String,
    enum: ["MEN", "WOMEN", "EVERYONE", "NON_BINARY", "OTHER"]
  }],
  lookingFor: [{
    type: String,
    enum: [
      "BOYFRIEND", "GIRLFRIEND", "SUGAR_DADDY", "SUGAR_MOMMY",
      "SUGAR_BABY", "LONG_TERM", "SHORT_TERM", "CASUAL",
      "FRIENDSHIP", "MARRIAGE", "COMPANIONSHIP", "OPEN_TO_EXPLORE", "NOT_SURE"
    ]
  }],
  datingIntent: [{
    type: String,
    enum: [
      "SERIOUS_RELATIONSHIP", "LONG_TERM_PARTNER", "SOMEONE_TO_DATE",
      "CASUAL_CONNECTION", "COMPANIONSHIP", "MARRIAGE", "JUST_EXPLORING"
    ]
  }],
  bio: { type: String, maxlength: 1000, default: "" },
  photos: [{ type: String }],
  city: { type: String, trim: true, default: "" },
  interests: [{ type: String, trim: true }],
  minAge: { type: Number, min: 18, max: 100, default: 18 },
  maxAge: { type: Number, min: 18, max: 100, default: 60 },
  maxDistanceKm: { type: Number, min: 1, max: 500, default: 50 },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  status: { type: String, enum: ["ACTIVE", "SUSPENDED", "DELETED"], default: "ACTIVE" },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("User", userSchema);