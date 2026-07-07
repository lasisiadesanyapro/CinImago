import express from "express";
import {
  createReviewController,
  getAllReviewsController,
  getReviewByIdController,
  updateReviewController,
  deleteReviewController,
} from "./review.controller.js";
import { isAuth } from "../../middleware/authentication.middleware.js";
import { restrictTo } from "../../middleware/authorization.middleware.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .get(restrictTo("admin"), getAllReviewsController)
  .post(isAuth, createReviewController);

reviewRouter
  .route("/:id")
  .get(getReviewByIdController)
  .put(isAuth, updateReviewController)
  .delete(isAuth, deleteReviewController);

export default reviewRouter;
