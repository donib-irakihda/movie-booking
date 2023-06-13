import express from "express";
import {
  bookMovie,
  deleteBooking,
  getBookingById,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/book-movie", bookMovie);
bookingRouter.get("/get-booking-by-id/:id", getBookingById);
bookingRouter.delete("/delete-booking-by-id/:id", deleteBooking);

export default bookingRouter;
