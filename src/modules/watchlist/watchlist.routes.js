import express from "express";
import {
  addToWatchlistController,
  getWatchlistController,
  removeFromWatchlistController,
} from "./watchlist.controller.js";
import { isAuth } from "../../middleware/authentication.middleware.js";

const watchlistRouter = express.Router();

watchlistRouter
  .route("/")
  .get(isAuth, getWatchlistController)
  .post(isAuth, addToWatchlistController);

watchlistRouter.route("/:id").delete(isAuth, removeFromWatchlistController);

export default watchlistRouter;
