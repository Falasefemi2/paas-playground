CREATE TYPE "status" AS ENUM('pending', 'cloning', 'building', 'running', 'failed');--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"repo_url" text NOT NULL,
	"status" "status" DEFAULT 'pending'::"status" NOT NULL,
	"error_msg" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
