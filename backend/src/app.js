import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "You have successfully pinged Code ISM 🔥.",
  });
});

app.use("/api/v1/auth", authRouter);

app.use(express.json());

export default app;
