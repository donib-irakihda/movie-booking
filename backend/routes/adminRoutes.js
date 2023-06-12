import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register-admin", registerAdmin);

adminRouter.post("/login-admin", loginAdmin);
export default adminRouter;
