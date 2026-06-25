import Watchlist from "./watchlist.model.js";
import Movie from "../movies/movie.model.js";
import { watchlistSchema } from "./watchlist.schema.js";

export const addToWatchlistService = async (req, res, dto) => {
  const validateData = await watchlistSchema.safeParseAsync(dto);
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

  const existing = await Watchlist.findOne({
    user: req.user.id,
    movie: validateData.data.movie,
  });
  if (existing) {
    return res.status(400).json({ message: "Movie already in watchlist" });
  }

  const watchlist = await Watchlist.create({
    ...validateData.data,
    user: req.user.id,
  });

  if (!watchlist) {
    return res.status(400).json({ message: "Error adding to watchlist" });
  }

  return res.status(201).json({
    message: "Movie added to watchlist successfully",
    data: watchlist,
  });
};

export const getWatchlistService = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Watchlist.find({ user: req.user.id })
      .populate("movie", "title posterUrl genre averageRating")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Watchlist.countDocuments({ user: req.user.id }),
  ]);

  return res.json({
    message: "Watchlist fetched successfully",
    data: items,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

export const removeFromWatchlistService = async (req, res) => {
  const watchlist = await Watchlist.findById(req.params.id);
  if (!watchlist) {
    return res.status(404).json({ message: "Watchlist item not found" });
  }

  const isOwner = watchlist.user.toString() === req.user.id.toString();
  if (!isOwner) {
    return res
      .status(403)
      .json({ message: "Not authorized to remove this item" });
  }

  await Watchlist.findByIdAndDelete(req.params.id);

  return res.json({ message: "Movie removed from watchlist successfully" });
};
