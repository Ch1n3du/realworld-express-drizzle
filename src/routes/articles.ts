import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { AddCommentSchema, addCommentToArticleController, createArticleController, CreateArticleSchema, deleteArticleController, deleteCommentController, favoriteArticleController, getArticleController, getCommentsFromArticleController, unfavoriteArticleController, updateArticleController, UpdateArticleSchema } from "../controllers/articles.controller";

const articlesRouter = Router();
const todo = async () => "TODO";

// List articles
articlesRouter.get("/", getArticleController);

// Feed Articles
articlesRouter.get("/feed", todo)

// Get article
articlesRouter.get("/:slug", getArticleController)

//! Auth required
// Create article
articlesRouter.post(
    "/",
    validateRequest({ body: CreateArticleSchema }),
    createArticleController
);

//! Auth
// Update Article
articlesRouter.put(
    "/:slug",
    validateRequest({ body: UpdateArticleSchema }),
    updateArticleController,
);

//! Auth
// Delete Article
articlesRouter.delete(
    "/:slug",
    deleteArticleController,
);

//! Auth
// Add Comments to an Article
articlesRouter.post(
    "/:slug/comments",
    validateRequest({ body: AddCommentSchema }),
    addCommentToArticleController,
);

//! Auth
// Get Comments from an Article
articlesRouter.get(
    "/:slug/comments",
    getCommentsFromArticleController,
);

//! Auth
// Delete comment
articlesRouter.delete(
    "/:slug/comments/:id",
    deleteCommentController,
);

//! Auth
// Favourite article
articlesRouter.post(
    "/:slug/favorite",
    favoriteArticleController,
);

//! Auth
// Unfavourite Article
articlesRouter.delete(
    "/:slug/favorite",
    unfavoriteArticleController
);

export default articlesRouter;