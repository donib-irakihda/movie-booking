import movieModel from "../models/movieModel.js";
import adminModel from "../models/adminModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const addMovie = async (req, res) => {
  const extractedToken = req.headers.authorization.split(" ")[1];

  if (!extractedToken || extractedToken.trim() === "")
    return res.status(404).json({ error: "Token not found" });

  let adminId;
  jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decrypted) => {
    if (err) {
      return res.status(500).json({ errors: "Token error: " + err.message });
    } else {
      adminId = decrypted.id;
      return;
    }
  });
  console.log(adminId);

  const { title, description, releaseDate, actors, posterUrl, featured } =
    req.body;

  try {
    const newMovie = await movieModel.create({
      title,
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      posterUrl,
      admin: adminId,
    });
    if (!newMovie) return res.status(500).json({ error: "Request failed..." });

    const session = await mongoose.startSession();
    const admin = await adminModel.findById(adminId);

    await session.startTransaction();

    await newMovie.save({ session });
    admin.addedMovies.push(newMovie);
    await admin.save({ session });

    await session.commitTransaction();
    res
      .status(201)
      .json({ message: "Movie added succesfully", movie: newMovie });
  } catch (error) {
    console.log(error);
  }
  console.log(extractedToken);
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await movieModel
      .find()
      .populate({ path: "admin", model: adminModel, select: "email" })
      .populate({
        path: "bookings",
        populate: {
          path: "user",
          model: userModel,
          select: "name",
        },
      });

    if (!movies) return res.status(404).json({ error: "Movies not found" });
    res.status(200).json({ all_movies: movies });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await movieModel
      .findById(req.params.id)
      .populate({ path: "admin", model: adminModel, select: "email" });

    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json({ movie: movie });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};
