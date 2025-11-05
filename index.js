import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";

import roleRouter from "./routes/rolesRoutes.js";

let app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("req body is", JSON.stringify(req.body));
  console.log("📩 Incoming request:", req.method, req.url);
  next();
});

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/roles", roleRouter);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  next(err);
});

app.listen("3000", () => {
  mongoose
    .connect(`${process.env.MONGO_URL}`)
    .then(() => {
      console.log("DB Connection was successful");
    })
    .catch((e) => {
      console.log("error while connecting to database", e.message);
    });
  console.log("Your app is running on 3000");
});
