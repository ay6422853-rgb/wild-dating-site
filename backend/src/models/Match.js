import mongoose from "mongoose";

const schema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Match", schema);