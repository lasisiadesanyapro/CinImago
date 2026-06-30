import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
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
    progressSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

watchHistorySchema.index({ user: 1, movie: 1 }, { unique: true });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
export default WatchHistory;
