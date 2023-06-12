import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/add-movie", addMovie);

movieRouter.get("/get-all-movies", getAllMovies);

movieRouter.get("/get-movie-by-id/:id", getMovieById);

export default movieRouter;
