CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"deployment_id" uuid,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_deployment_id_deployments_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "deployments"("id");