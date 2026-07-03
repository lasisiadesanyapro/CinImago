import Movie from "./movie.model.js";
import { movieSchema, updateMovieSchema } from "./movie.schema.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
export const createMovieService = async (req, res, dto) => {
  const validateData = await movieSchema.safeParseAsync(dto);
  if (!validateData.success) {
    return res.json({
      message: "Invalid input data",
      errors: validateData.error.issues,
    });
  }

  const { files } = req;
  if (!files || !files.video) {
    return res.status(400).json({ message: "Video file is required" });
  }

  const { secure_url, public_id } = await uploadToCloudinary(
    files.video.tempFilePath,
    "cinemago/movies",
    "video",
  );
  const movie = await Movie.create(validateData.data);
  if (!movie) {
    return res.status(400).json({ message: "Error creating a movie" });
  }
  return res.status(201).json({
    message: "Movie created successfully",
    data: movie,
  });
};

export const getAllMoviesService = async (req, res) => {
  const { genre, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (genre) filter.genre = { $in: [genre] };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { director: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [movies, total] = await Promise.all([
    Movie.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Movie.countDocuments(filter),
  ]);

  return res.json({
    message: "Movies fetched successfully",
    data: movies,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

export const getMovieByIdService = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.json({
    message: "Movie fetched successfully",
    data: movie,
  });
};

export const updateMovieService = async (req, res, dto) => {
  const validateData = await updateMovieSchema.safeParseAsync(dto);
  if (!validateData.success) {
    return res.json({
      message: "Invalid input data",
      errors: validateData.error.issues,
    });
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    validateData.data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.json({
    message: "Movie updated successfully",
    data: movie,
  });
};

export const deleteMovieService = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.json({ message: "Movie deleted successfully" });
};
