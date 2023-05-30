CREATE EXTENSION pgcrypto;
CREATE TABLE IF NOT EXISTS "article_to_tag" (
	"tag_name" text PRIMARY KEY NOT NULL,
	"article_slug" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "articles" (
	"article_id" uuid PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"author" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "comments" (
	"comment_id" serial PRIMARY KEY NOT NULL,
	"article_slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"body" text NOT NULL,
	"comment_author_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "favorited_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_slug" text,
	"user_id" uuid
);

CREATE TABLE IF NOT EXISTS "followings" (
	"follower_id" uuid PRIMARY KEY NOT NULL,
	"followed_username" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "tags" (
	"tag_name" text PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"bio" text,
	"email" text NOT NULL,
	"image" text,
	"password" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
