import WatchHistory from "./Watchhistory.model.js";
import Movie from "../movies/movie.model.js";
import { watchHistorySchema } from "./watchHistory.schema.js";

export const recordWatchService = async (req, res, dto) => {
  const validateData = await watchHistorySchema.safeParseAsync(dto);
  if (!validateData.success) {
    return res.json({
      message: "Invalid input data",
      errors: validateData.error.issues,
    });
  }

  const movie = await Movie.findById(validateData.data.movie);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const watchHistory = await WatchHistory.findOneAndUpdate(
    { user: req.user.id, movie: validateData.data.movie },
    {
      progressSeconds: validateData.data.progressSeconds ?? 0,
      watchedAt: Date.now(),
    },
    { new: true, upsert: true, runValidators: true },
  );

  return res.status(200).json({
    message: "Watch progress recorded successfully",
    data: watchHistory,
  });
};

export const getWatchHistoryService = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    WatchHistory.find({ user: req.user.id })
      .populate("movie", "title posterUrl genre")
      .skip(skip)
      .limit(Number(limit))
      .sort({ watchedAt: -1 }),
    WatchHistory.countDocuments({ user: req.user.id }),
  ]);

  return res.json({
    message: "Watch history fetched successfully",
    data: items,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

export const getWatchHistoryByIdService = async (req, res) => {
  const watchHistory = await WatchHistory.findById(req.params.id).populate(
    "movie",
    "title posterUrl genre",
  );

  if (!watchHistory) {
    return res.status(404).json({ message: "Watch history entry not found" });
  }

  const isOwner = watchHistory.user.toString() === req.user.id.toString();
  if (!isOwner) {
    return res
      .status(403)
      .json({ message: "Not authorized to view this entry" });
  }

  return res.json({
    message: "Watch history entry fetched successfully",
    data: watchHistory,
  });
};

export const deleteWatchHistoryService = async (req, res) => {
  const watchHistory = await WatchHistory.findById(req.params.id);
  if (!watchHistory) {
    return res.status(404).json({ message: "Watch history entry not found" });
  }

  const isOwner = watchHistory.user.toString() === req.user.id.toString();
  if (!isOwner) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this entry" });
  }

  await WatchHistory.findByIdAndDelete(req.params.id);

  return res.json({ message: "Watch history entry deleted successfully" });
};
