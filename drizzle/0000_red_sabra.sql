CREATE TABLE IF NOT EXISTS "article_to_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"articleId" serial NOT NULL
);

CREATE TABLE IF NOT EXISTS "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"author" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"body" text NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text NOT NULL,
	"author" text NOT NULL,
	"articleId" serial NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "followings" (
	"followerId" text PRIMARY KEY NOT NULL,
	"followedId" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tagName" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"username" integer PRIMARY KEY NOT NULL,
	"bio" text,
	"email" text NOT NULL,
	"image" text,
	"password" text NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "article_to_tag" ADD CONSTRAINT "article_to_tag_articleId_articles_id_fk" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "articles" ADD CONSTRAINT "articles_author_users_username_fk" FOREIGN KEY ("author") REFERENCES "users"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_articles_id_fk" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
