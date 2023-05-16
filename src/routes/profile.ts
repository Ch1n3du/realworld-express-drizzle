import { Router } from "express";

const profileRouter = Router();
const todo = async () => "TODO";

//! Auth optional
// GET /api/profiles/:username
profileRouter.get("/:username", todo)

//! Auth required
profileRouter.post("/:username/follow", todo)

//! Auth required
profileRouter.delete("/:username/follow", todo)

export default profileRouter;