import { Router } from "express";
import { expressjwt } from "express-jwt";
import dotenv from "dotenv";

import userRouter from "./user";
import usersRouter from "./users";
import profileRouter from "./profile";
import articlesRouter from "./articles";
import tagsRouter from "./tags";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
const router = Router();

router.use("/user", userRouter);
router.use("/users", usersRouter);
router.use("/profiles", profileRouter);
router.use("/articles", articlesRouter);
router.use("/tags", tagsRouter)


router.use(
    expressjwt({
        secret: JWT_SECRET!,
        algorithms: ["HS256"],

    }).unless({
        path: [
            "/users/login",
            "/users",
        ]
    })
)

export default router