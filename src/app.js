import express from "express";
import authRouter from "./modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import movieRouter from "./modules/movies/movie.route.js";
import reviewRouter from "./modules/review/review.routes.js";
import ratingRouter from "./modules/ratings/rating.routes.js";

const createapp = () => {
  const app = express();
  app.use(express.json());
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "server is up and running" });
  });
  app.use(cookieParser());
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/movies", movieRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/ratings", ratingRouter);
  return app;
};
export default createapp;
