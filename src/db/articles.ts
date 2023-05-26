import { and, eq, not } from "drizzle-orm";
import { number, string, TypeOf, z } from "zod";
import { db } from ".";
import { articles, article_to_tag, authorCommentsRelations, comments, favorited_articles, followers, tags, users } from "./schema";

import slug from "slug";

export const ListArticleParamsSchema = z.object({
    tag: string().optional(),
    author: string().optional(),
    favorited: string().optional(),
    limit: number().optional(),
    offset: number().optional(),
});
export type ListArticleParams = TypeOf<typeof ListArticleParamsSchema>;

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
    articleSlug: string,
    searcherUsername: string,
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
            author: articles.author,
        })
        .from(articles)
        .where(eq(articles.slug, articleSlug));
    if (articleInfoRows.length < 1) {
        return null;
    }
    let articleInfo = articleInfoRows[0];
    let author: Author = (await getAuthorInfo(searcherUsername, articleInfo.author))!;
    let tagList: string[] = await getArticleTagList(articleSlug);
    let { favorited, favoritesCount } = await getFavoriteInfo(articleSlug, searcherUsername)

    return {
        ...articleInfo,
        tagList,
        author,
        favorited,
        favoritesCount
    };
}

export async function createArticle(
    searcherUsername: string,
    params: {
        title: string,
        author: string,
        description: string,
        body: string
        tagList?: string[]
    }
): Promise<Article | null> {
    let articleSlug: string = slug(params.title);
    await db.insert(articles)
        .values({
            slug: slug(params.title),
            title: params.title,
            author: params.author,
            description: params.description,
            body: params.body,
        });
    let tagList = params.tagList || [];
    let formattedTagList = tagList
        .map((tag_name) => {
            return { tag_name, article_slug: articleSlug };
        });
    await db
        .insert(article_to_tag)
        .values(formattedTagList);

    return getArticle(articleSlug, searcherUsername);
}

export async function updateArticle(
    articleSlug: string,
    searcherUsername: string,
    updateParams: {
        title?: string,
        description?: string,
        body?: string,
    }
) {
    let updatedSlug = isUndefined(updateParams.title)
        ? slug(updateParams.title!)
        : undefined;
    await db
        .update(articles)
        .set({ ...updateParams, slug: updatedSlug })
        .where(eq(articles.slug, articleSlug));

    return getArticle(articleSlug, searcherUsername);
}

export async function deleteArticle(articleSlug: string, searcherUsername: string) {
    await db
        .delete(articles)
        .where(eq(articles.slug, articleSlug));

    await deleteCommentsFromArticle(articleSlug);

    return getArticle(articleSlug, searcherUsername);
}

type Comment = {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    body: string,
    author: Author
}

export async function getComment(
    articleSlug: string,
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
            author: comments.comment_author
        })
        .from(comments)
        .where(and(
            eq(comments.article_slug, articleSlug),
            eq(comments.comment_id, commentId)));
    if (commentInfoRows.length === 0) {
        return null;
    }
    let commentInfo = commentInfoRows[0]

    let author = await getAuthorInfo(searcherUsername, commentInfo.author);
    if (author === null) {
        return null;
    }

    return { ...commentInfo, author: author! }
}



export async function getCommentsForArticle(
    articleSlug: string,
    searcherUsername: string,
): Promise<Comment[] | null> {
    let commentInfoRows = await db
        .select({
            id: comments.comment_id,
            createdAt: comments.created_at,
            updatedAt: comments.updated_at,
            body: comments.body,
            //! Change field later
            author: comments.comment_author
        })
        .from(comments)
        .where(eq(comments.article_slug, articleSlug));
    if (commentInfoRows.length === 0) {
        return null;
    }
    let formattedComments = [];

    for (const [index, comment] of commentInfoRows.entries()) {
        let author = await getAuthorInfo(searcherUsername, comment.author);
        if (author === null) {
            return null;
        }

        formattedComments[index] = { ...comment, author: author! }
    };

    return formattedComments
}


export async function addCommentToArticle(
    commentAuthor: string,
    articleSlug: string,
    commentBody: string,
): Promise<Comment | null> {
    try {

        let res = await db
            .insert(comments)
            .values({
                comment_author: commentAuthor,
                article_slug: articleSlug,
                body: commentBody
            })
            .returning({
                id: comments.comment_id,
            });
        let id: number = res[0].id;

        return getComment(articleSlug, id, commentAuthor);
    } catch (_) {
        return null;
    }
}

export async function deleteComment(articleSlug: string, commentId: number) {
    await db
        .delete(comments)
        .where(and(
            eq(comments.comment_id, commentId),
            eq(comments.article_slug, articleSlug),
        )
        );
}

async function deleteCommentsFromArticle(articleSlug: string) {
    await db
        .delete(comments)
        .where(eq(comments.article_slug, articleSlug));
}

export async function favoriteArticle(
    articleSlug: string,
    username: string,
): Promise<Article | null> {
    await db.insert(favorited_articles)
        .values({
            article_slug: articleSlug,
            username: username,
        });

    return getArticle(articleSlug, username)
}

export async function unfavoriteArticle(
    articleSlug: string,
    username: string,
): Promise<Article | null> {
    db.delete(favorited_articles)
        .where(and(
            eq(favorited_articles.article_slug, articleSlug),
            eq(favorited_articles.username, username),
        )
        );

    return getArticle(articleSlug, username)
}

export async function getTags(): Promise<string[]> {
    let rawTags = await db
        .select({ tagName: tags.tag_name })
        .from(tags);

    return rawTags.map(({ tagName }) => tagName)
}




const isUndefined = (value: any) => value === undefined;
export async function listArticles(queryParams: ListArticleParams) {
    let limit: number = isUndefined(queryParams.limit)
        ? 20   // default
        : queryParams.limit!;
    let offset: number = isUndefined(queryParams.offset)
        ? 0   // default
        : queryParams.offset!;
    // let tagFilter = isUndefined(queryParams.tag)
    //     ? not(eq(article_to_tag.tag_name, "")) // By default don't filter out anything : eq(article_to_tag.tag_name, queryParams.tag!);
    //     : eq(article);
    let authorFilter = isUndefined(queryParams.author)
        ? not(eq(articles.author, ""))
        : eq(articles.author, queryParams.author!);

    let articleRows = await db.query.articles.findMany({
        limit: limit,
        offset: offset, columns: {
            slug: true,
            title: true,
            //! Change property when mapping
            author: true,
            description: true,
            body: true,
            created_at: true,
            updated_at: true,
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

    let results = articleRows.map(async (article) => {
        let { favorited, favoritesCount } = await getFavoriteInfo(article.slug, article.author)
    })
}

async function getArticleTagList(articleSlug: string): Promise<string[]> {
    let articleTags = await db
        .select({
            tag_name: article_to_tag.tag_name,
        })
        .from(article_to_tag)
        .where(eq(article_to_tag.article_slug, articleSlug));

    return articleTags.map(({ tag_name }) => tag_name);
}

async function getAuthorInfo(searcherUsername: string, authorUsername: string): Promise<Author | null> {
    let authorInfoRows = await db
        .select({
            username: users.username,
            bio: users.bio,
            image: users.image,
        })
        .from(users)
        .where(eq(users.username, authorUsername));

    if (authorInfoRows.length === 0) {
        return null;
    }
    let authorInfo = authorInfoRows[0];

    let followingRows = await db
        .select({})
        .from(followers)
        .where(and(
            eq(followers.follower_username, searcherUsername),
            eq(followers.followed_username, authorUsername),
        ));
    let following: boolean = followingRows.length > 0;

    return { following: following, ...authorInfo };
}

async function getFavoriteInfo(articleSlug: string, username: string) {
    let favoritesRows = await db
        .select({ username: favorited_articles })
        .from(favorited_articles)
        .where(eq(favorited_articles.article_slug, articleSlug));

    let favoritedRows = await db
        .select({ username: favorited_articles })
        .from(favorited_articles)
        .where(
            and(eq(favorited_articles.article_slug, articleSlug),
                eq(favorited_articles.username, username)
            )
        );
    let favoritesCount: number = favoritesRows.length;
    let favorited: boolean = favoritedRows.length > 0;

    return { favorited, favoritesCount };
}

export async function getArticleAuthor(articleSlug: string): Promise<string | null> {
    let authorRows = await db
        .select({ author: articles.author })
        .from(articles)
        .where(eq(articles.slug, articleSlug));

    if (authorRows.length === 0) {
        return null;
    }

    return authorRows[0].author
}

export async function getCommentAuthor(articleSlug: string, commentId: number) {
    let authorRows = await db
        .select({ author: comments.comment_author })
        .from(comments)
        .where(and(
            eq(comments.article_slug, articleSlug),
            eq(comments.comment_id, commentId)
        )
        );

    if (authorRows.length === 0) {
        return null;
    }

    return authorRows[0].author
}