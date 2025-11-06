import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.js";
import eventRoutes from "./routes/event.js";
import swapRequestRoutes from "./routes/swapRequest.js";

config({
  path: "./.env",
});

connectDB();
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

//apis
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", swapRequestRoutes);

//home route
app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to backend API's",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on PORT ${process.env.PORT}`);
});
