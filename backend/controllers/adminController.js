import adminModel from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import movieModel from "../models/movieModel.js";

export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await adminModel.create({
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: "error while registering an admin" });
    console.log(error);
  }
};
500;

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel
      .findOne({ email })
      .populate({ path: "addedMovies", model: movieModel, select: "title" });
    if (!admin)
      return res
        .status(404)
        .json({ error: "Admin not found with this email.." });

    const matchPassword = await bcrypt.compare(password, admin.password);

    if (!matchPassword)
      return res.status(400).json({ error: "Invalid credentials..." });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ message: "Login Success..", admin: admin, token: token });
  } catch (error) {
    res.status(500).json({ error: "Error while logging in..." });
    console.log(error);
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel
      .find()
      .populate({
        path: "addedMovies",
        model: movieModel,
        select: "title description",
      });
    res.status(200).json({ admins: admins });

    if (!admins) return res.status(404).json({ error: "Admin not found" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong.." });
    console.log(error);
  }
};
