import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { register, login, getUser, logout } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", logout);

export default router;
