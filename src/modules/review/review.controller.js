import {
  createReviewService,
  getAllReviewsService,
  getReviewByIdService,
  updateReviewService,
  deleteReviewService,
} from "./review.service.js";

export const createReviewController = async (req, res) => {
  const dto = req.body;
  const reviewService = await createReviewService(req, res, dto);
  return reviewService;
};

export const getAllReviewsController = async (req, res) => {
  const reviewService = await getAllReviewsService(req, res);
  return reviewService;
};

export const getReviewByIdController = async (req, res) => {
  const reviewService = await getReviewByIdService(req, res);
  return reviewService;
};

export const updateReviewController = async (req, res) => {
  const dto = req.body;
  const reviewService = await updateReviewService(req, res, dto);
  return reviewService;
};

export const deleteReviewController = async (req, res) => {
  const reviewService = await deleteReviewService(req, res);
  return reviewService;
};
