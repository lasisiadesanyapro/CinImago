import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    label: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

ratingSchema.index({ user: 1, movie: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
