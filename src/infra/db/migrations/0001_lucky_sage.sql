ALTER TABLE "uploads" ADD COLUMN "remote_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_remote_key_unique" UNIQUE("remote_key");