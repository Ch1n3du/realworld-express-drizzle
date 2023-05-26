import { Router } from "express";
import { listArticlesController } from "../controllers/articles.controller";

const articlesRouter = Router();
const todo = async () => "TODO";

// List articles
articlesRouter.get("/", listArticlesController);

// Feed Articles
articlesRouter.get("/feed", todo)

// Get article
articlesRouter.get("/:slug", todo)

//! Auth required
// Create article
articlesRouter.post("/", todo)

//! Auth
// Update Article
articlesRouter.put("/:slug", todo)

//! Auth
// Delete Article
articlesRouter.delete("/:slug", todo)

//! Auth
// Add Comments to an Article
articlesRouter.post("/:slug/comments", todo)

//! Auth
// Get Comments from an Article
articlesRouter.get("/:slug/comments", todo)

//! Auth
// Delete comment
articlesRouter.delete("/:slug/comments/:id", todo)

//! Auth
// Favourite article
articlesRouter.post("/:slug/favorite", todo)

//! Auth
// Unfavourite Article
articlesRouter.delete("/:slug/favorite")

export default articlesRouter;