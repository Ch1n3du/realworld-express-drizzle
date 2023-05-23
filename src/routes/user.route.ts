import { Router } from "express";
import { getCurrentUser, updateUser } from "../controllers/user.controller";
import { validateRequest } from "zod-express-middleware";
import { UpdateUserSchema } from "../requests/user.request";

const userRouter = Router();

// Get current user
userRouter.get("/", getCurrentUser);

userRouter.put("/", validateRequest({ body: UpdateUserSchema }), updateUser);

export default userRouter;
