export type User = {
    username: string,
    email: string,
    token: string,
    bio: string
    image: string | null,
}

export type Profile = {
    username: string,
    bio: string,
    image: string,
    following: boolean
}

export type Author = {
    username: string,
    bio: string,
    image: string,
    following: boolean
}

export type Article = {
    slug: string,
    title: string,
    description: string,
    body: string,
    tagList: string[],
    createdAt: string,
    updatedAt: string,
    favorited: boolean,
    author: Author,
}

export type MultipleArticles = {
    articlesCount: number,
    articles: Article[],
}

export type Comment = {
    id: number,
    createdAt: string,
    updatedAt: string,
    body: string,
    author: Author
}

