import { and, eq, not } from "drizzle-orm";
import { number, string, TypeOf, z } from "zod";
import { db } from ".";
import { articles, article_to_tag, authorCommentsRelations, comments, favorited_articles, followings, tags, users } from "./schema";

import slug from "slug";
import { getUserIdFromUsername } from "./user";

type Article = {
    slug: string,
    title: string,
    description: string | null,
    body: string,
    tagList: string[],
    createdAt: Date,
    updatedAt: Date,
    favorited: boolean,
    favoritesCount: number,
    author: Author,
}

type Author = {
    username: string,
    bio: string | null,
    image: string | null,
    following: boolean
}

export async function getArticle(
    articleId: string,
    searcherUserId: string,
): Promise<Article | null> {
    let articleInfoRows = await db
        .select({
            slug: articles.slug,
            title: articles.title,
            description: articles.description,
            body: articles.body,
            createdAt: articles.created_at,
            updatedAt: articles.updated_at,
            //! Change field later
            author_id: articles.author_id,
        })
        .from(articles)
        .where(eq(articles.article_id, articleId));
    if (articleInfoRows.length < 1) {
        return null;
    }
    let articleInfo = articleInfoRows[0];
    let author: Author = (await getAuthorInfo(searcherUserId, articleInfo.author_id))!;
    let tagList: string[] = await getArticleTagList(articleId);
    let { favorited, favoritesCount } = await getFavoriteInfo(articleId, searcherUserId)

    return {
        ...articleInfo,
        tagList,
        author,
        favorited,
        favoritesCount
    };
}

export async function createArticle(
    username: string,
    params: {
        title: string,
        description: string,
        body: string
        tagList?: string[]
    }
): Promise<Article | null> {
    let articleSlug: string = slug(params.title);
    let authorId: string = (await getUserIdFromUsername(username))!;

    await db.insert(articles)
        .values({
            slug: slug(params.title),
            title: params.title,
            author_id: authorId,
            description: params.description,
            body: params.body,
        });

    let articleId = (await getArticleIdFromSlug(articleSlug))!;
    let tagList = params.tagList || [];
    let formattedTagList = tagList
        .map((tag_name) => {
            return { tag_name, article_id: articleId };
        });

    try {
        await db
            .insert(article_to_tag)
            .values(formattedTagList);
    } catch (_) { }

    return getArticle(articleSlug, authorId);
}

export async function updateArticle(
    articleId: string,
    searcherUsername: string,
    updateParams: {
        title?: string,
        description?: string,
        body?: string,
    }
) {
    let updatedSlug = isUndefined(updateParams.title)
        ? undefined
        : slug(updateParams.title!)
    await db
        .update(articles)
        .set({ ...updateParams, slug: updatedSlug })
        .where(eq(articles.article_id, articleId));
    let userId = (await getUserIdFromUsername(searcherUsername))!

    return getArticle(articleId, userId);
}

export async function deleteArticle(articleId: string, searcherUsername: string) {
    let article = getArticle(articleId, (await getUserIdFromUsername(searcherUsername))!);
    await db.delete(comments)
        .where(eq(comments.article_id, articleId));
    await db.delete(favorited_articles)
        .where(eq(favorited_articles.article_id, articleId));
    await db
        .delete(article_to_tag)
        .where(eq(article_to_tag.article_id, articleId));
    await db
        .delete(articles)
        .where(eq(articles.article_id, articleId));

    return article;
}

type Comment = {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    body: string,
    author: Author
}

export async function getComment(
    articleId: string,
    commentId: number,
    searcherUsername: string,
): Promise<Comment | null> {
    let commentInfoRows = await db
        .select({
            id: comments.comment_id,
            createdAt: comments.created_at,
            updatedAt: comments.updated_at,
            body: comments.body,
            //! Change field later
            author: comments.comment_author_id
        })
        .from(comments)
        .where(and(
            eq(comments.article_id, articleId),
            eq(comments.comment_id, commentId)));

    if (commentInfoRows.length === 0) {
        return null;
    }
    let commentInfo = commentInfoRows[0]

    let searcherUserId = await getUserIdFromUsername(searcherUsername);
    if (searcherUserId === null) {
        return null;
    }
    let authorUserId = await getUserIdFromUsername(commentInfo.author);
    if (authorUserId === null) {
        return null;
    }

    let author = await getAuthorInfo(searcherUserId!, authorUserId!);
    if (author === null) {
        return null;
    }

    return { ...commentInfo, author: author! }
}



export async function getCommentsForArticle(
    articleId: string,
    searcherUsername: string,
): Promise<Comment[] | null> {
    let commentInfoRows = await db
        .select({
            id: comments.comment_id,
            createdAt: comments.created_at,
            updatedAt: comments.updated_at,
            body: comments.body,
            //! Change field later
            author: comments.comment_author_id
        })
        .from(comments)
        .where(eq(comments.article_id, articleId));
    if (commentInfoRows.length === 0) {
        return null;
    }
    let formattedComments = [];

    for (const [index, comment] of commentInfoRows.entries()) {
        let authorUserId = await getUserIdFromUsername(comment.author);
        if (authorUserId === null) {
            return null;
        }
        let searcherUserId = await getUserIdFromUsername(searcherUsername);
        if (searcherUserId === null) {
            return null;
        }
        let author = await getAuthorInfo(searcherUserId!, authorUserId!);
        if (author === null) {
            return null;
        }

        formattedComments[index] = { ...comment, author: author! }
    };

    return formattedComments
}


export async function addCommentToArticle(
    commentAuthorUsername: string,
    articleId: string,
    commentBody: string,
): Promise<Comment | null> {
    try {

        let res = await db
            .insert(comments)
            .values({
                comment_author_id: (await getUserIdFromUsername(commentAuthorUsername))!,
                article_id: articleId,
                body: commentBody
            })
            .returning({
                id: comments.comment_id,
            });
        let id: number = res[0].id;

        return getComment(articleId, id, commentAuthorUsername);
    } catch (_) {
        return null;
    }
}

export async function deleteComment(articleId: string, commentId: number) {
    await db
        .delete(comments)
        .where(and(
            eq(comments.comment_id, commentId),
            eq(comments.article_id, articleId),
        )
        );
}

export async function favoriteArticle(
    articleId: string,
    username: string,
): Promise<Article | null> {
    await db.insert(favorited_articles)
        .values({
            article_id: articleId,
            user_id: (await getUserIdFromUsername(username))!,
        });

    return getArticle(articleId, username)
}

export async function unfavoriteArticle(
    articleId: string,
    username: string,
): Promise<Article | null> {
    db.delete(favorited_articles)
        .where(and(
            eq(favorited_articles.article_id, articleId),
            eq(favorited_articles.user_id, (await getUserIdFromUsername(username))!),
        )
        );

    return getArticle(articleId, username)
}

export async function getTags(): Promise<string[]> {
    let rawTags = await db
        .select({ tagName: tags.tag_name })
        .from(tags);

    return rawTags.map(({ tagName }) => tagName)
}

const isUndefined = (value: any) => value === undefined;

export const ListArticleParamsSchema = z.object({
    tag: string().optional(),
    author: string().optional(),
    favorited: string().optional(),
    limit: number().optional(),
    offset: number().optional(),
});
export type ListArticleParams = TypeOf<typeof ListArticleParamsSchema>;

type ArticleList = {
    articles: Article[],
    articlesCount: number,
}

export async function listArticles(
    searcherUserId: string,
    queryParams: ListArticleParams
): Promise<ArticleList | null> {
    let limit: number = isUndefined(queryParams.limit)
        ? 20   // default
        : queryParams.limit!;
    let offset: number = isUndefined(queryParams.offset)
        ? 0   // default
        : queryParams.offset!;
    let tagFilter = isUndefined(queryParams.tag)
        ? not(eq(article_to_tag.tag_name, "")) // By default don't filter out anything : eq(article_to_tag.tag_name, queryParams.tag!);
        : eq(article_to_tag.tag_name, queryParams.tag!);
    let authorFilter = isUndefined(queryParams.author)
        ? not(eq(articles.author_id, ""))
        : eq(articles.author_id, (await getUserIdFromUsername(queryParams.author!))!);

    let articleRows = await db.query.articles.findMany({
        limit: limit,
        offset: offset,
        columns: {
            slug: true,
            title: true,
            description: true,
            body: true,
            created_at: true,
            updated_at: true,
            author_id: true,
            article_id: true,
        },
        where: authorFilter,
        with: {
            article_to_tag: {
                columns: {},
                where: tagFilter
            },
            users: {
                columns: {
                    username: true,
                    bio: true,
                    image: true,
                    following: true,
                }
            }
        }
    });

    let formattedArticles: Article[] = [];
    for (const article of articleRows) {

        let { favorited, favoritesCount } = await getFavoriteInfo(article.slug, article.author_id)
        let authorInfo: Author = (await getAuthorInfo(searcherUserId, article.author_id))!;
        let tagList: string[] = await getArticleTagList(article.article_id);
        let formattedArticle: Article = {
            slug: article.slug,
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: tagList,
            createdAt: article.created_at,
            updatedAt: article.updated_at,
            favorited: favorited,
            favoritesCount: favoritesCount,
            author: authorInfo,
        };
        formattedArticles.push(formattedArticle);
    }

    return { articles: formattedArticles, articlesCount: formattedArticles.length };
}

async function getArticleTagList(articleId: string): Promise<string[]> {
    let articleTags = await db
        .select({
            tag_name: article_to_tag.tag_name,
        })
        .from(article_to_tag)
        .where(eq(article_to_tag.article_id, articleId));

    return articleTags
        .filter(({ tag_name }) => tag_name !== null)
        .map(({ tag_name }) => tag_name!);
}

async function getAuthorInfo(searcherUserId: string, authorUserId: string): Promise<Author | null> {
    let authorInfoRows = await db
        .select({
            username: users.username,
            bio: users.bio,
            image: users.image,
        })
        .from(users)
        .where(eq(users.user_id, authorUserId));

    if (authorInfoRows.length === 0) {
        return null;
    }
    let authorInfo = authorInfoRows[0];

    let followingRows = await db
        .select({})
        .from(followings)
        .where(and(
            eq(followings.follower_id, searcherUserId),
            eq(followings.followed_id, authorUserId),
        ));
    let following: boolean = followingRows.length > 0;

    return { following: following, ...authorInfo };
}

async function getFavoriteInfo(articleId: string, userId: string) {
    let favoritesRows = await db
        .select({ username: favorited_articles })
        .from(favorited_articles)
        .where(eq(favorited_articles.article_id, articleId));

    let favoritedRows = await db
        .select({ username: favorited_articles })
        .from(favorited_articles)
        .where(
            and(eq(favorited_articles.article_id, articleId),
                eq(favorited_articles.user_id, userId)
            )
        );
    let favoritesCount: number = favoritesRows.length;
    let favorited: boolean = favoritedRows.length > 0;

    return { favorited, favoritesCount };
}

export async function getArticleAuthor(articleId: string): Promise<string | null> {
    let authorRows = await db
        .select({ author_id: articles.author_id })
        .from(articles)
        .where(eq(articles.article_id, articleId));

    if (authorRows.length === 0) {
        return null;
    }

    let usernameRows = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.user_id, authorRows[0].author_id))

    if (usernameRows.length === 0) {
        return null;
    }

    return usernameRows[0].username;
}

export async function getCommentAuthor(articleId: string, commentId: number) {
    let authorRows = await db
        .select({ author_id: comments.comment_author_id })
        .from(comments)
        .where(and(
            eq(comments.article_id, articleId),
            eq(comments.comment_id, commentId)
        )
        );

    if (authorRows.length === 0) {
        return null;
    }

    let username = (
        await db
            .select({ username: users.username })
            .from(users)
            .where(eq(users.user_id, authorRows[0].author_id))
    )[0].username;

    return username
}

export async function getArticleIdFromSlug(articleSlug: string): Promise<string | null> {
    let articleRows = await db
        .select({
            articleId: articles.article_id
        })
        .from(articles)
        .where(eq(articles.slug, articleSlug));
    if (articleRows.length < 1) {
        return null;
    }
    return articleRows[0].articleId;
}