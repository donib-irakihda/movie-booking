import express from "express";
import {
  deleteUserById,
  getAllUsers,
  getBookingsOfUser,
  registerUser,
  updateUserById,
  userLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get-all-users", getAllUsers);

userRouter.post("/register-user", registerUser);

userRouter.put("/update-user-by-id/:id", updateUserById);

userRouter.delete("/delete-user/:id", deleteUserById);

userRouter.post("/user-login", userLogin);

userRouter.get("/get-bookings-of-user/:id", getBookingsOfUser);

export default userRouter;
