import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/dbconfig.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingRouter);

connectDB();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
