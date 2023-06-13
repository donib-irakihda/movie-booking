import mongoose from "mongoose";
import bookingModel from "../models/bookingModel.js";
import movieModel from "../models/movieModel.js";
import userModel from "../models/userModel.js";

export const bookMovie = async (req, res) => {
  const { movie, date, seatNumber, user } = req.body;

  try {
    const existingMovie = await movieModel.findById(movie);
    if (!existingMovie)
      return res.status(404).json({ error: "Movie not found" });

    const existingUser = await userModel.findById(user);
    if (!existingUser) return res.status(404).json({ error: "User not found" });

    const booking = await bookingModel.create({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    existingMovie.bookings.push(booking);
    existingUser.bookings.push(booking);

    await existingMovie.save({ session });
    await existingUser.save({ session });
    await booking.save({ session });

    await session.commitTransaction();

    res
      .status(201)
      .json({ message: "Movie booked successfully...", booking: booking });
  } catch (error) {
    console.log(error);
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel
      .findById(req.params.id)
      .populate({
        path: "movie",
        model: movieModel,
        select: " title",
      })
      .populate({
        path: "user",
        model: userModel,
        select: " name",
      });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json({ booking: booking });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong: " + error.message });
    console.log(error);
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await bookingModel
      .findByIdAndRemove(req.params.id)
      .populate("user movie");
    // console.log(booking);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const session = await mongoose.startSession();

    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);

    await booking.user.save({ session });
    await booking.movie.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Booking deleted..." });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong: " + error.message });
    console.log(error);
  }
};
