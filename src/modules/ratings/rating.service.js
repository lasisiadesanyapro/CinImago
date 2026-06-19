import Rating from "./rating.model.js";
import Movie from "../movies/movie.model.js";
import { ratingSchema, updateRatingSchema } from "./rating.schema.js";

export const createRatingService = async (req, res, dto) => {
  const validateData = await ratingSchema.safeParseAsync(dto);
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

  const existingRating = await Rating.findOne({
    user: req.user.id,
    movie: validateData.data.movie,
  });
  if (existingRating) {
    return res
      .status(400)
      .json({ message: "You have already rated this movie" });
  }

  const rating = await Rating.create({
    ...validateData.data,
    user: req.user.id,
  });

  if (!rating) {
    return res.status(400).json({ message: "Error creating rating" });
  }

  const allRatings = await Rating.find({ movie: validateData.data.movie });
  const average =
    allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;

  await Movie.findByIdAndUpdate(validateData.data.movie, {
    averageRating: Math.round(average * 10) / 10,
    reviewCount: allRatings.length,
  });

  return res.status(201).json({
    message: "Rating created successfully",
    data: rating,
  });
};

export const getAllRatingsService = async (req, res) => {
  const { movie, user, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (movie) filter.movie = movie;
  if (user) filter.user = user;

  const skip = (page - 1) * limit;
  const [ratings, total] = await Promise.all([
    Rating.find(filter)
      .populate("user", "name email")
      .populate("movie", "title")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Rating.countDocuments(filter),
  ]);

  return res.json({
    message: "Ratings fetched successfully",
    data: ratings,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

export const getRatingByIdService = async (req, res) => {
  const rating = await Rating.findById(req.params.id)
    .populate("user", "name email")
    .populate("movie", "title");

  if (!rating) {
    return res.status(404).json({ message: "Rating not found" });
  }

  return res.json({
    message: "Rating fetched successfully",
    data: rating,
  });
};

export const updateRatingService = async (req, res, dto) => {
  const validateData = await updateRatingSchema.safeParseAsync(dto);
  if (!validateData.success) {
    return res.json({
      message: "Invalid input data",
      errors: validateData.error.issues,
    });
  }

  const rating = await Rating.findById(req.params.id);
  if (!rating) {
    return res.status(404).json({ message: "Rating not found" });
  }

  const isOwner = rating.user.toString() === req.user.id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this rating" });
  }

  const updatedRating = await Rating.findByIdAndUpdate(
    req.params.id,
    validateData.data,
    { new: true, runValidators: true },
  );

  const allRatings = await Rating.find({ movie: rating.movie });
  const average =
    allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;

  await Movie.findByIdAndUpdate(rating.movie, {
    averageRating: Math.round(average * 10) / 10,
  });

  return res.json({
    message: "Rating updated successfully",
    data: updatedRating,
  });
};

export const deleteRatingService = async (req, res) => {
  const rating = await Rating.findById(req.params.id);
  if (!rating) {
    return res.status(404).json({ message: "Rating not found" });
  }

  const isOwner = rating.user.toString() === req.user.id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this rating" });
  }

  await Rating.findByIdAndDelete(req.params.id);

  const allRatings = await Rating.find({ movie: rating.movie });
  const average =
    allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length
      : 0;

  await Movie.findByIdAndUpdate(rating.movie, {
    averageRating: Math.round(average * 10) / 10,
    reviewCount: allRatings.length,
  });

  return res.json({ message: "Rating deleted successfully" });
};
