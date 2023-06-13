import express from "express";
import {
  getAllAdmins,
  loginAdmin,
  registerAdmin,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register-admin", registerAdmin);

adminRouter.post("/login-admin", loginAdmin);

adminRouter.get("/get-all-admins", getAllAdmins);
export default adminRouter;
