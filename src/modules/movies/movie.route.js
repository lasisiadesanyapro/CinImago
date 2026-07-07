import express from "express";
import {
  createMovieController,
  getAllMoviesController,
  getMovieByIdController,
  updateMovieController,
  deleteMovieController,
} from "./movie.controller.js";
import { isAuth } from "../../middleware/authentication.middleware.js";
import { restrictTo } from "../../middleware/authorization.middleware.js";
import { getReviewByIdController } from "../review/review.controller.js";

const movieRouter = express.Router();

movieRouter
  .route("/")
  .get(getAllMoviesController)
  .post(isAuth, restrictTo("admin"), createMovieController);

movieRouter
  .route("/:id")
  .get(getMovieByIdController)
  .put(isAuth, restrictTo("admin"), updateMovieController)
  .delete(isAuth, restrictTo("admin"), deleteMovieController);
movieRouter.route("/:id/reviews").get(getReviewByIdController);

export default movieRouter;
