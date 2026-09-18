import mongoose from "mongoose";

const schema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["LIKE", "PASS"], required: true }
}, { timestamps: true });

schema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model("Interaction", schema);