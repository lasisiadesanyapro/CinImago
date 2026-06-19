import {
  createMovieService,
  getAllMoviesService,
  getMovieByIdService,
  updateMovieService,
  deleteMovieService,
} from "./movie.service.js";

export const createMovieController = async (req, res) => {
  const dto = req.body;
  const movieService = await createMovieService(req, res, dto);
  return movieService;
};

export const getAllMoviesController = async (req, res) => {
  const movieService = await getAllMoviesService(req, res);
  return movieService;
};

export const getMovieByIdController = async (req, res) => {
  const movieService = await getMovieByIdService(req, res);
  return movieService;
};

export const updateMovieController = async (req, res) => {
  const dto = req.body;
  const movieService = await updateMovieService(req, res, dto);
  return movieService;
};

export const deleteMovieController = async (req, res) => {
  const movieService = await deleteMovieService(req, res);
  return movieService;
};
