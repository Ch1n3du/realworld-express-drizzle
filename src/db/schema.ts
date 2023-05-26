import { relations } from "drizzle-orm";
import { pgTable, text, date, serial, integer, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    username: text("username").primaryKey(),
    bio: text("bio"),
    email: text("email").notNull(),
    image: text("image"),
    password: text("password").notNull(),
    created_at: date("created_at").defaultNow().notNull(),
});

export const followers = pgTable("followings", {
    follower_username: text("follower_username").primaryKey().notNull(),
    followed_username: text("followed_username").notNull()
})

export const articles = pgTable("articles", {
    slug: text("id").notNull().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    body: text("body").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    author: text("author").notNull().references(() => users.username),
});

export const favorited_articles = pgTable("favorited_articles", {
    id: uuid("id").defaultRandom().primaryKey(),
    article_slug: text("article_slug").references(() => articles.slug),
    username: text("username").references(() => users.username)
});

export const comments = pgTable("comments", {
    comment_id: serial("comment_id").notNull().primaryKey(),
    article_slug: text("article_slug").notNull().references(() => articles.slug),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    body: text("body").notNull(),
    comment_author: text("comment_author").notNull(),
});

export const tags = pgTable("tags", {
    tag_name: text("tag_name").notNull().primaryKey(),
})

export const article_to_tag = pgTable("article_to_tag", {
    tag_name: text("tag_name").primaryKey(),
    article_slug: text("article_slug").notNull().references(() => articles.slug),
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

// Author Comments Relation
// Author (One) -> Comments (Many)
export const authorCommentsRelations = relations(articles, ({ many }) => ({
    comments: many(comments)
}));
export const commentAuthorRelations = relations(comments, ({ one }) => ({
    article: one(users, {
        fields: [comments.comment_author],
        references: [users.username],
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
        fields: [article_to_tag.article_slug],
        references: [articles.slug],
    }),
    tag: one(tags, {
        fields: [article_to_tag.tag_name],
        references: [tags.tag_name],
    })
}));

