import Message from "../models/Message.js";
import Match from "../models/Match.js";

export async function listMessages(req, res) {
  const match = await Match.findOne({ _id: req.params.matchId, users: req.user._id, active: true });
  if (!match) return res.status(404).json({ message: "Match not found" });
  const messages = await Message.find({ match: match._id }).sort({ createdAt: 1 }).limit(200);
  res.json({ messages });
}

export async function sendMessage(req, res) {
  const match = await Match.findOne({ _id: req.params.matchId, users: req.user._id, active: true });
  if (!match) return res.status(404).json({ message: "Match not found" });
  const text = req.body.text?.trim();
  if (!text) return res.status(400).json({ message: "Message cannot be empty" });
  const message = await Message.create({ match: match._id, sender: req.user._id, text });
  res.status(201).json({ message });
}