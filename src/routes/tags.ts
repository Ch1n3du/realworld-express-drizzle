import { Router } from "express"
import { getTagsController } from "../controllers/articles.controller";

const tagsRouter = Router();

//! Auth
// Get tags
tagsRouter.get("/tags", getTagsController);

export default tagsRouter;