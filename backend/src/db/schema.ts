import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['pending', 'cloning', 'building', 'running', 'failed'])

export const deployments = pgTable('deployments', {
    id: uuid('id').primaryKey().defaultRandom(),
    repo_url: text('repo_url').notNull(),
    status: statusEnum('status').notNull().default('pending'),
    error_msg: text('error_msg'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const logs = pgTable('logs', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    deployment_id: uuid('deployment_id').references(() => deployments.id),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})
