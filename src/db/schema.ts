import { relations } from "drizzle-orm";
import { pgTable, text, date, serial, integer, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    user_id: uuid("user_id").defaultRandom().primaryKey(),
    username: text("username").notNull(),
    bio: text("bio"),
    email: text("email").notNull(),
    image: text("image"),
    password: text("password").notNull(),
    created_at: date("created_at").defaultNow().notNull(),
});

export const followings = pgTable("followings", {
    follower_id: uuid("follower_id").notNull(),
    followed_id: uuid("followed_username").notNull()
}, (table) => {
    return {
        pk: primaryKey(table.follower_id, table.followed_id)
    }
})

export const articles = pgTable("articles", {
    article_id: uuid("article_id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    body: text("body").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    author_id: uuid("author").notNull(),
});

export const favorited_articles = pgTable("favorited_articles", {
    article_id: uuid("article_id"),
    user_id: uuid("user_id")
}, (table) => {
    return {
        pk: primaryKey(table.article_id, table.user_id)
    }
});

export const comments = pgTable("comments", {
    comment_id: serial("comment_id").notNull().primaryKey(),
    article_id: uuid("article_id").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    body: text("body").notNull(),
    comment_author_id: uuid("comment_author_id").notNull(),
});

export const tags = pgTable("tags", {
    tag_name: text("tag_name").notNull().primaryKey(),
})

export const article_to_tag = pgTable("article_to_tag", {
    tag_name: text("tag_name"),
    article_id: uuid("article_id").notNull(),
}, (table) => {
    return {
        pk: primaryKey(table.tag_name, table.article_id)
    }
})

// RELATIONS

// User Articles Relation
// User (One) -> Articles (Many)
export const userArticlesRelations = relations(users, ({ many }) => ({
    articles: many(articles),
}));
export const articleAuthorRelations = relations(articles, ({ one }) => ({
    author: one(users, {
        fields: [articles.author_id],
        references: [users.user_id]
    })
}))

// Author Comments Relation
// Author (One) -> Comments (Many)
export const authorCommentsRelations = relations(articles, ({ many }) => ({
    comments: many(comments)
}));
export const commentAuthorRelations = relations(comments, ({ one }) => ({
    article: one(users, {
        fields: [comments.comment_author_id],
        references: [users.user_id],
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
        fields: [article_to_tag.article_id],
        references: [articles.article_id],
    }),
    tag: one(tags, {
        fields: [article_to_tag.tag_name],
        references: [tags.tag_name],
    })
}));

