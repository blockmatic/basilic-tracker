CREATE TABLE "mutation_events" (
	"capability_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"cursor" bigserial PRIMARY KEY NOT NULL,
	"entities" jsonb NOT NULL,
	"operation_id" text NOT NULL,
	"payload" jsonb,
	"query_keys" jsonb NOT NULL,
	"revision" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mutation_events" ADD CONSTRAINT "mutation_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "mutation_events_operation_id_unique" ON "mutation_events" USING btree ("operation_id");--> statement-breakpoint
CREATE INDEX "mutation_events_user_cursor_idx" ON "mutation_events" USING btree ("user_id","cursor");