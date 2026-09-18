import User from "../models/User.js";

export async function updateProfile(req, res) {
  const allowed = [
    "name", "phone", "bio", "photos", "city", "interests",
    "minAge", "maxAge", "maxDistanceKm", "interestedIn", "lookingFor", "datingIntent"
  ];
  for (const key of allowed) if (req.body[key] !== undefined) req.user[key] = req.body[key];
  await req.user.save();
  res.json({ user: req.user });
}