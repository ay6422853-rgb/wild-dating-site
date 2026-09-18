import mongoose from "mongoose";

const schema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, maxlength: 2000, trim: true },
  readAt: Date
}, { timestamps: true });

export default mongoose.model("Message", schema);