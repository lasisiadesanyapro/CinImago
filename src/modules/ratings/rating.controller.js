import {
  createRatingService,
  getAllRatingsService,
  getRatingByIdService,
  updateRatingService,
  deleteRatingService,
} from "./rating.service.js";

export const createRatingController = async (req, res) => {
  const dto = req.body;
  const ratingService = await createRatingService(req, res, dto);
  return ratingService;
};

export const getAllRatingsController = async (req, res) => {
  const ratingService = await getAllRatingsService(req, res);
  return ratingService;
};

export const getRatingByIdController = async (req, res) => {
  const ratingService = await getRatingByIdService(req, res);
  return ratingService;
};

export const updateRatingController = async (req, res) => {
  const dto = req.body;
  const ratingService = await updateRatingService(req, res, dto);
  return ratingService;
};

export const deleteRatingController = async (req, res) => {
  const ratingService = await deleteRatingService(req, res);
  return ratingService;
};
