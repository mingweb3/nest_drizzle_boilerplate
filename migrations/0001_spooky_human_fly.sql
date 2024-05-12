ALTER TABLE "Users" ALTER COLUMN "password" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "username" varchar(80);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "refresh_token" varchar(256);