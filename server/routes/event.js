import express from "express";
import {
  createEvent,
  deleteEvent,
  getMyEvents,
  toggleSwap,
} from "../controllers/event.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", isAuthenticated, createEvent);
router.get("/", isAuthenticated, getMyEvents);
router.delete("/:id", isAuthenticated, deleteEvent);
router.patch("/:id/swappable", isAuthenticated, toggleSwap);

export default router;
