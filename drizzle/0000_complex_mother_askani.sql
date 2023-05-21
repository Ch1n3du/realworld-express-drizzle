CREATE TABLE IF NOT EXISTS "users" (
	"username" text PRIMARY KEY NOT NULL,
	"bio" text,
	"email" text,
	"image" text,
	"pasword" text,
	"createdAt" date DEFAULT now()
);
