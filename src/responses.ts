type User = {
    username: string,
    email: string,
    token: string,
    bio: string
    image: string
    following: boolean
}

type Profile = {
    username: string,
    bio: string,
    image: string,
    following: boolean 
}

type Author = {
    username: string,
    bio: string,
    image: string,
    following: boolean
}

type Article = {
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

type MultipleArticles = {
    articlesCount: number,
    articles: Article[],
}

type Comment = {
    id: number,
    createdAt: string,
    updatedAt: string,
    body: string,
    author: Author
}

