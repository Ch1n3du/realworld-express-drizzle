// /api/users routes
import { Router } from "express";
import { loginUser, LoginSchema, registerUser, RegisterUserSchema } from "../controllers/users.controller";
import { validateRequest } from "zod-express-middleware";

const usersRouter = Router();



// Login Route
usersRouter.post(
    "/login",
    validateRequest({ body: LoginSchema }),
    loginUser
);

// Registration
usersRouter.post(
    "/",
    validateRequest({ body: RegisterUserSchema }),
    registerUser
);

export default usersRouter;