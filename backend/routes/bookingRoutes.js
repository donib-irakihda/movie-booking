import express from "express";
import { bookMovie } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/book-movie", bookMovie);

export default bookingRouter;
