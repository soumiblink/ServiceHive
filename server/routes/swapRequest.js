import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createSwapRequest,
  getMySwapRequests,
  getSwappableSlots,
  respondToSwapRequest,
} from "../controllers/swapRequest.js";

const router = express.Router();

router.get("/swappable-slots", isAuthenticated, getSwappableSlots);
router.post("/swap-request", isAuthenticated, createSwapRequest);
router.post("/swap-response/:requestId", isAuthenticated, respondToSwapRequest);
router.get("/swap-requests", isAuthenticated, getMySwapRequests);

export default router;
