import {pgTable, text, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    username: text("username").primaryKey(),
    bio: text("bio"),
    email: text("email"),
    image: text("image"),
    password: text("pasword"),
    createdAt: date("createdAt").defaultNow(),
});

