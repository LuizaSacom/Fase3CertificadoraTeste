import express from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import {
  summary,
  createActive,
  deleteActive,
  updateActive,
  createActiveHistory,
  updateActiveHistory,
  deleteActiveHistory,
} from "../controllers/ActiveController";

export const activeRoutes = express.Router();

activeRoutes.use(authMiddleware);

activeRoutes.get("/", summary);

activeRoutes.put("/:id", updateActive);

activeRoutes.post("/", createActive);

activeRoutes.delete("/:id", deleteActive);

activeRoutes.post("/:id/history", createActiveHistory);

activeRoutes.put("/:activeId/history/:historyId", updateActiveHistory);

activeRoutes.delete("/:activeId/history/:historyId", deleteActiveHistory);
