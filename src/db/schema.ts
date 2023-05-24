import { relations } from "drizzle-orm";
import { pgTable, text, date, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    username: text("username").primaryKey(),
    bio: text("bio"),
    email: text("email").notNull(),
    image: text("image"),
    password: text("password").notNull(),
    createdAt: date("createdAt").defaultNow().notNull(),
});

export const followers = pgTable("followings", {
    followerId: uuid("followerId").primaryKey().notNull().references(() => users.username),
    followedId: uuid("followedId").notNull().references(() => users.username),
})

export const articles = pgTable("articles", {
    id: uuid("id").primaryKey().defaultRandom(),
    author: text("author").notNull().references(() => users.username),
    title: text("title").notNull(),
    description: text("description"),
    body: text("body").notNull(),
    createdAt: date("createdAt").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    body: text("body").notNull(),
    author: text("author").notNull(),
    articleId: uuid("articleId").notNull().references(() => articles.id),
    createdAt: date("createdAt").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
    id: uuid("id").primaryKey().defaultRandom(),
    tagName: text("tagName").notNull(),
})

export const article_to_tag = pgTable("article_to_tag", {
    tagId: uuid("id").notNull().primaryKey(),
    articleId: uuid("articleId").notNull().references(() => articles.id),
})

// RELATIONS

// User Articles Relation
// User (One) -> Articles (Many)
export const userArticlesRelations = relations(users, ({ many }) => ({
    articles: many(articles),
}));
export const articleAuthorRelations = relations(articles, ({ one }) => ({
    author: one(users, {
        fields: [articles.author],
        references: [users.username]
    })
}))

// Article Comments Relation
// Article (One) -> Comments (Many)
export const articleCommentsRelations = relations(articles, ({ many }) => ({
    comments: many(comments)
}));
export const commentArticleRelations = relations(comments, ({ one }) => ({
    article: one(articles, {
        fields: [comments.articleId],
        references: [articles.id]
    })
}));


// Article Tags Relation
// Tags (Many) -> Articles (Many)
export const articleTagsRelations = relations(articles, ({ many }) => ({
    tags: many(article_to_tag)
}));
export const tagArticlesRelations = relations(tags, ({ many }) => ({
    articles: many(article_to_tag)
}));
export const articleToTagRelations = relations(article_to_tag, ({ one }) => ({
    article: one(articles, {
        fields: [article_to_tag.articleId],
        references: [articles.id],
    }),
    tag: one(tags, {
        fields: [article_to_tag.tagId],
        references: [tags.id],
    })
}));

