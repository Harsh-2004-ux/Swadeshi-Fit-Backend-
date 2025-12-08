import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());
//route import
import userRouter from "./routes/user.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import storeRoutes from "./routes/store.routes.js";

app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1", activityRoutes);
app.use("/api/v1/users", userRouter);
export { app };
