import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
  },
});

export default mongoose.model("feedback", feedbackSchema);
