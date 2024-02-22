import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();

//database connecteion
mongoose
  .connect(process.env.MONGO_URI_STRING)
  .then(() =>
    app.listen(3000, () => {
      console.log("Listening on port 3000!");
    })
  )
  .catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(cookieParser())
app.use("/api/user/", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
