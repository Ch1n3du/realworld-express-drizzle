import {pgTable, text, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    username: text("username").primaryKey(),
    bio: text("bio"),
    email: text("email").notNull(),
    image: text("image"),
    password: text("password").notNull(),
    createdAt: date("createdAt").defaultNow().notNull(),
});

