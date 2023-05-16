import { Router } from "express";

import userRouter from "./user";
import usersRouter from "./users";
import profileRouter from "./profile";
import articlesRouter from "./articles";
import tagsRouter from "./tags";

const router = Router();

router.use("/user", userRouter);
router.use("/users", usersRouter);
router.use("/profiles", profileRouter);
router.use("/articles", articlesRouter);
router.use("/tags", tagsRouter)

export default router