CREATE TABLE IF NOT EXISTS "article_to_tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"articleId" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"body" text NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"body" text NOT NULL,
	"author" text NOT NULL,
	"articleId" uuid NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "followings" (
	"followerId" uuid PRIMARY KEY NOT NULL,
	"followedId" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tagName" text NOT NULL
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

DO $$ BEGIN
 ALTER TABLE "followings" ADD CONSTRAINT "followings_followerId_users_username_fk" FOREIGN KEY ("followerId") REFERENCES "users"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "followings" ADD CONSTRAINT "followings_followedId_users_username_fk" FOREIGN KEY ("followedId") REFERENCES "users"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
