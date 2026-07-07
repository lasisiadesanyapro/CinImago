import Review from "./review.model.js";
import Movie from "../movies/movie.model.js";
import { reviewSchema, updateReviewSchema } from "./review.schema.js";

export const createReviewService = async (req, res, dto) => {
  const validateData = await reviewSchema.safeParseAsync(dto);
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

  const review = await Review.create({
    ...validateData.data,
    user: req.user.id,
  });

  if (!review) {
    return res.status(400).json({ message: "Error creating review" });
  }

  return res.status(201).json({
    message: "Review created successfully",
    data: review,
  });
};

export const getAllReviewsService = async (req, res) => {
  const { movie, user, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (movie) filter.movie = movie;
  if (user) filter.user = user;

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "name email")
      .populate("movie", "title")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Review.countDocuments(filter),
  ]);

  return res.json({
    message: "Reviews fetched successfully",
    data: reviews,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

export const getReviewByIdService = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({ movie: req.params.id })
      .populate("user", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Review.countDocuments({ movie: req.params.id }),
  ]);

  return res.json({
    message: "Movie reviews fetched successfully",
    data: reviews,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

export const updateReviewService = async (req, res, dto) => {
  console.log(req.params.id);

  const validateData = await updateReviewSchema.safeParseAsync(dto);
  if (!validateData.success) {
    return res.json({
      message: "Invalid input data",
      errors: validateData.error.issues,
    });
  }
  console.log(req.params.id);
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const isOwner = review.user.toString() === req.user.id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this review" });
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    validateData.data,
    {
      new: true,
      runValidators: true,
    },
  );

  return res.json({
    message: "Review updated successfully",
    data: updatedReview,
  });
};

export const deleteReviewService = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const isOwner = review.user.toString() === req.user.id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this review" });
  }

  await Review.findByIdAndDelete(req.params.id);

  return res.json({ message: "Review deleted successfully" });
};
