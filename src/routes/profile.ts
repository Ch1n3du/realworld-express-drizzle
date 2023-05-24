import { Router } from "express";
import { followUserController, getProfileController, unfollowUserController } from "../controllers/profile.controller";

const profileRouter = Router();

//! Auth optional
// GET /api/profiles/:username
profileRouter.get("/:username", getProfileController)

//! Auth required
profileRouter.post("/:username/follow", followUserController)

//! Auth required
profileRouter.delete("/:username/follow", unfollowUserController)

export default profileRouter;