dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import contactRoutes from "./routes/contactRoutes.js";


const app = express();


app.use(helmet());


app.use(express.json());


app.use(cors({
  origin: process.env.FRONTEND_URL
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

app.use(limiter);


app.use("/api/contact", contactRoutes);


app.get("/", (req, res) => {
  res.send("API Running 🚀");
});


mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected 🔥");
})
.catch((err) => {
  console.log(err);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});