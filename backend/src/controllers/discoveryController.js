import User from "../models/User.js";
import Interaction from "../models/Interaction.js";
import Match from "../models/Match.js";

export async function discover(req, res) {
  const interacted = await Interaction.find({ from: req.user._id }).distinct("to");
  const users = await User.find({
    _id: { $nin: [req.user._id, ...interacted] },
    status: "ACTIVE",
    role: "USER"
  }).select("name dob identity interestedIn lookingFor datingIntent bio photos city interests minAge maxAge");
  res.json({ users });
}

export async function interact(req, res) {
  const { targetId, type } = req.body;
  if (!targetId || !["LIKE", "PASS"].includes(type)) return res.status(400).json({ message: "Invalid interaction" });
  if (String(targetId) === String(req.user._id)) return res.status(400).json({ message: "Invalid target" });

  await Interaction.findOneAndUpdate(
    { from: req.user._id, to: targetId },
    { type },
    { upsert: true, new: true }
  );

  let match = null;
  if (type === "LIKE") {
    const reciprocal = await Interaction.findOne({ from: targetId, to: req.user._id, type: "LIKE" });
    if (reciprocal) {
      match = await Match.findOne({
        users: { $all: [req.user._id, targetId] }
      });
      if (!match) match = await Match.create({ users: [req.user._id, targetId] });
    }
  }
  res.json({ matched: !!match, match });
}

export async function matches(req, res) {
  const list = await Match.find({ users: req.user._id, active: true })
    .populate("users", "name photos city identity dob");
  res.json({ matches: list });
}