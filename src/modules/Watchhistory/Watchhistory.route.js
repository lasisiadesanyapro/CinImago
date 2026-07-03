import express from "express";
import {
  recordWatchController,
  getWatchHistoryController,
  getWatchHistoryByIdController,
  deleteWatchHistoryController,
} from "./Watchhistory.controller.js";
import { isAuth } from "../../middleware/authentication.middleware.js";

const watchHistoryRouter = express.Router();

watchHistoryRouter
  .route("/")
  .get(isAuth, getWatchHistoryController)
  .post(isAuth, recordWatchController);

watchHistoryRouter
  .route("/:id")
  .get(isAuth, getWatchHistoryByIdController)
  .delete(isAuth, deleteWatchHistoryController);

export default watchHistoryRouter;
