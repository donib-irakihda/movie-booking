import bookingModel from "../models/bookingModel.js";

export const bookMovie = async (req, res) => {
  const { movie, date, seatNumber, user } = req.body;

  try {
    const booking = await bookingModel.create({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });

    res
      .status(201)
      .json({ message: "Movie booked successfully...", booking: booking });
  } catch (error) {
    console.log(error);
  }
};
