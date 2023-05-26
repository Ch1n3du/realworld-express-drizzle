import { Router } from "express";
import { getCurrentUser, updateUser, UpdateUserSchema } from "../controllers/user.controller";
import { validateRequest } from "zod-express-middleware";

const userRouter = Router();

// Get current user
userRouter.get(
    "/",
    getCurrentUser
);

userRouter.put(
    "/",
    validateRequest({ body: UpdateUserSchema }),
    updateUser
);

export default userRouter;