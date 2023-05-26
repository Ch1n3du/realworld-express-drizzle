import { Request, Response } from "express";

import * as auth from "../utils/auth";
import * as errors from "../utils/errors";
import * as db from "../db/articles";
import { string, z } from "zod";

// export async function listArticlesController(req: Request, res: Response) {
//     let queryParams: ListArticleParams = ListArticleParamsSchema.parse(req.query);

//     let articles = await listArticles(queryParams);
// }

export async function getArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;

    let articleSlug = req.params.slug;
    let dbResult = await db.getArticle(articleSlug, username)
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let article = dbResult!;

    res.status(200).json({ article });
}

export const CreateArticleSchema = z.object({
    article: z.object({
        title: string().nonempty(),
        description: string(),
        body: string().nonempty(),
        tagList: z.array(z.string().nonempty()),
    })
});

export async function createArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;

    let reqBody = CreateArticleSchema.parse(req.body);
    let params = reqBody.article;

    let dbResult = await db.createArticle(username, { ...params, author: username })
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let article = dbResult!;

    res.status(200).json({ article });
}

export const UpdateArticleSchema = z.object({
    article: z.object({
        title: string().nonempty().optional(),
        description: string().nonempty().optional(),
        body: string().nonempty().optional(),
    })
});

export async function updateArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;

    let reqBody = UpdateArticleSchema.parse(req.body);
    let updateParams = reqBody.article;

    let authorAuth = await db.getArticleAuthor(articleSlug);
    if (authorAuth === null) {
        errors.notFoundError(res, "Article not found");
        return;
    }
    if (username !== authorAuth) {
        errors.unauthorizedError(res, "Not authorized to edit article");
    }

    let dbResult = await db.updateArticle(articleSlug, username, updateParams)
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let article = dbResult!;

    res.status(200).json({ article });
}

export async function deleteArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;

    let authorAuth = await db.getArticleAuthor(articleSlug);
    if (authorAuth === null) {
        errors.notFoundError(res, "Article not found");
        return;
    }
    if (username !== authorAuth) {
        errors.unauthorizedError(res, "Not authorized to delete article");
    }

    let dbResult = await db.deleteArticle(articleSlug, username);
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let article = dbResult!;

    res.status(200).json({ article });
}

export const AddCommentSchema = z.object({
    comment: z.object({
        body: string().nonempty()
    })
});

export async function addCommentToArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;

    let commentBody = AddCommentSchema.parse(req.body).comment.body;

    let dbResult = await db.addCommentToArticle(username, articleSlug, commentBody);
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let comment = dbResult!;

    res.status(200).json({ comment });
}

export async function getCommentsFromArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;

    let commentBody = AddCommentSchema.parse(req.body).comment.body;

    let dbResult = await db.getCommentsForArticle(articleSlug, username);
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let comments = dbResult!;

    res.status(200).json({ comments });
}

export async function deleteCommentController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;
    let commentId: number = Number(req.params.id);

    let authorAuth = await db.getArticleAuthor(articleSlug);
    if (authorAuth === null) {
        errors.notFoundError(res, "Author not found");
        return;
    }
    if (username !== authorAuth) {
        errors.unauthorizedError(res, "Not authorized to delete comment");
    }

    await db.deleteComment(articleSlug, commentId);

    res.status(200);
}

export async function favoriteArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;

    let dbResult = await db.favoriteArticle(articleSlug, username);
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let article = dbResult!;

    res.status(200).json({ article });
}

export async function unfavoriteArticleController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;

    let dbResult = await db.unfavoriteArticle(articleSlug, username);
    if (dbResult === null) {
        errors.notFoundError(res, "Article not found.")
        return;
    }
    let article = dbResult!;

    res.status(200).json({ article });
}



export async function getTagsController(req: Request, res: Response) {
    let token: string = auth.extractAccesToken(req);
    let decodeResult: string | null = auth.decodeAccesToken(token);
    if (decodeResult === null) {
        errors.validationError(res, "Error decoding JWT");
        return;
    }
    let username: string = decodeResult!;
    let articleSlug: string = req.params.slug;

    let tags = await db.getTags();

    res.status(200).json({ tags });
}

