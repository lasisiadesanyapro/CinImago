import express from "express";
import {
  createRatingController,
  getAllRatingsController,
  getRatingByIdController,
  updateRatingController,
  deleteRatingController,
} from "./rating.controller.js";
import { isAuth } from "../../middleware/authentication.middleware.js";

const ratingRouter = express.Router();

ratingRouter
  .route("/")
  .get(getAllRatingsController)
  .post(isAuth, createRatingController);

ratingRouter
  .route("/:id")
  .get(getRatingByIdController)
  .put(isAuth, updateRatingController)
  .delete(isAuth, deleteRatingController);

export default ratingRouter;
