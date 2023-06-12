import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  let users;
  try {
    users = await userModel.find();

    if (!users) {
      return res.status(404).json({ error: "Users not found" });
    }

    res.status(200).json({ users: users });
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await userModel.findOne({ email });

    if (userExists)
      return res
        .status(500)
        .json({ error: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User created successfully..", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error while creating user" });
    console.log(error);
  }
};

export const updateUserById = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const updatePayload = {
      name: name,
      email: email,
    };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatePayload.password = hashedPassword;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      updatePayload,
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({
        error: "User not found",
      });
    res
      .status(200)
      .json({ message: "User updated successfully", updatedUser: updatedUser });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({
        error: "User not found",
      });
    res.status(200).json({ message: "User deleted successfully..." });
  } catch (error) {
    res.status(500).json({ error: "Error while deleting a user..." });
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ error: "User not found with this email.." });

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword)
      return res.status(500).json({ error: "Invalid credentials..." });

    res.status(200).json({ message: "Login Success..", user: user });
  } catch (error) {
    res.status(500).json({ error: "Error while logging in..." });
    console.log(error);
  }
};
