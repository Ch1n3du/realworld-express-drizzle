// /api/users routes
import { Router } from "express";
import { loginUser, registerUser } from "../controllers/users.controller";
import { validateRequest } from "zod-express-middleware";
import { LoginSchema, RegisterUserSchema } from "../requests/users.request";

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