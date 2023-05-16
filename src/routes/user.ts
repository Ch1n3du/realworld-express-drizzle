import { Router } from "express";

const userRouter = Router();
const todo = async () => "TODO";

userRouter.get("/", todo);

userRouter.put("/", todo);

export default userRouter;