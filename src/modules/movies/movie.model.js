import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    genre: {
      type: [String],
      default: [],
    },
    releaseYear: {
      type: Number,
    },
    director: {
      type: String,
      trim: true,
    },
    posterUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
