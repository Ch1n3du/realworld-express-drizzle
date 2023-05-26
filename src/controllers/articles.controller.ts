import { Request, Response } from "express";
import { ListArticleParams, ListArticleParamsSchema, listArticles } from "../db/articles";

export async function listArticlesController(req: Request, res: Response) {
    let queryParams: ListArticleParams = ListArticleParamsSchema.parse(req.query);

    let articles = await listArticles(queryParams);
}