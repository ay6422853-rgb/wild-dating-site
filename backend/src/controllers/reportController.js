import Report from "../models/Report.js";

export async function createReport(req, res) {
  const { reported, reason, details } = req.body;
  if (!reported || !reason) return res.status(400).json({ message: "Reported user and reason are required" });
  const report = await Report.create({ reporter: req.user._id, reported, reason, details: details || "" });
  res.status(201).json({ report });
}