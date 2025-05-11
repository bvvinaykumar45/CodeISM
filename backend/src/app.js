import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: "You have successfully pinged Code ISM 🔥."
  });
});

app.use('/api/v1/auth');

app.use(express.json());

export default app;