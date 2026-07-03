import {
  recordWatchService,
  getWatchHistoryService,
  getWatchHistoryByIdService,
  deleteWatchHistoryService,
} from "./Watchhistory.service.js";

export const recordWatchController = async (req, res) => {
  const dto = req.body;
  const watchHistoryService = await recordWatchService(req, res, dto);
  return watchHistoryService;
};

export const getWatchHistoryController = async (req, res) => {
  const watchHistoryService = await getWatchHistoryService(req, res);
  return watchHistoryService;
};

export const getWatchHistoryByIdController = async (req, res) => {
  const watchHistoryService = await getWatchHistoryByIdService(req, res);
  return watchHistoryService;
};

export const deleteWatchHistoryController = async (req, res) => {
  const watchHistoryService = await deleteWatchHistoryService(req, res);
  return watchHistoryService;
};
