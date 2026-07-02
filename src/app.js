import express from "express";
import authRouter from "./modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import movieRouter from "./modules/movies/movie.route.js";
import reviewRouter from "./modules/review/review.routes.js";
import ratingRouter from "./modules/ratings/rating.routes.js";
import watchlistRouter from "./modules/watchlist/watchlist.routes.js";
import watchHistoryRouter from "./modules/Watchhistory/Watchhistory.route.js";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import { limiter } from "./utils/limiter.js";

const createapp = () => {
  const app = express();
  app.use(helmet());
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(hpp());
  app.use(cors({ origin: "*" }));
  app.use(limiter);

  app.get("/health", (req, res) => {
    return res
      .status(200)
      .json({ status: "ok", message: "server is up and running" });
  });
  app.use(cookieParser());
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/movies", movieRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/ratings", ratingRouter);
  app.use("/api/v1/watchlist", watchlistRouter);
  app.use("/api/v1/watchhistory", watchHistoryRouter);
  return app;
};
export default createapp;
