CREATE EXTENSION pgcrypto;

CREATE TABLE IF NOT EXISTS "article_to_tag" (
	"tag_name" text,
	"article_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_to_tag" ADD CONSTRAINT "article_to_tag_tag_name_article_id" PRIMARY KEY("tag_name","article_id");

CREATE TABLE IF NOT EXISTS "articles" (
	"article_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"author" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "comments" (
	"comment_id" serial PRIMARY KEY NOT NULL,
	"article_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"body" text NOT NULL,
	"comment_author_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "favorited_articles" (
	"article_id" uuid,
	"user_id" uuid
);
--> statement-breakpoint
ALTER TABLE "favorited_articles" ADD CONSTRAINT "favorited_articles_article_id_user_id" PRIMARY KEY("article_id","user_id");

CREATE TABLE IF NOT EXISTS "followings" (
	"follower_id" uuid NOT NULL,
	"followed_username" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "followings" ADD CONSTRAINT "followings_follower_id_followed_username" PRIMARY KEY("follower_id","followed_username");

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
