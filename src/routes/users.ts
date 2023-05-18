// /api/users routes
import { Router } from "express";
import { loginUser, registerUser } from "../controllers/users";

const usersRouter = Router();

// Authentication
usersRouter.post("/login", loginUser);

// Registration
usersRouter.post("/", registerUser);

export default usersRouter;