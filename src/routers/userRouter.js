
import express from "express";
import uploads from "../../middleware/uploads.js";
import { login, recoverAccount, registerSchool, resetPassword, verifyEmail } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/register", uploads.single("image"), registerSchool);
userRouter.post("/login", login);
userRouter.post("/verifyemail/:token", verifyEmail);
userRouter.post("/recoveraccount", recoverAccount);
userRouter.post("/resetpassword/:token", resetPassword);

export default userRouter;
