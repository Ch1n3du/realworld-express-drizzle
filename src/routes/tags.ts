import { Router } from "express"

const tagsRouter = Router();

//! Auth
// Get tags
tagsRouter.get("/tags");

export default tagsRouter;