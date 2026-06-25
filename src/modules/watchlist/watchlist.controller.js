import {
  addToWatchlistService,
  getWatchlistService,
  removeFromWatchlistService,
} from "./watchlist.service.js";

export const addToWatchlistController = async (req, res) => {
  const dto = req.body;
  const watchlistService = await addToWatchlistService(req, res, dto);
  return watchlistService;
};

export const getWatchlistController = async (req, res) => {
  const watchlistService = await getWatchlistService(req, res);
  return watchlistService;
};

export const removeFromWatchlistController = async (req, res) => {
  const watchlistService = await removeFromWatchlistService(req, res);
  return watchlistService;
};
