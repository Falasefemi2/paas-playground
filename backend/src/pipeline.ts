import { Effect } from "effect";
import { DB } from "./db";
import { deployments } from "./db/schema";
import { eq } from "drizzle-orm";
import { broadcast } from "./sse";

export const runPipeline = (repo_url: string, deploymentId: string): Effect.Effect<void, Error, DB> =>
    Effect.gen(function*() {
        const db = yield* DB

        yield* db.update(deployments).set({ status: "cloning" })
            .where(eq(deployments.id, deploymentId))
        broadcast(deploymentId, 'Cloning repository...')

        yield* Effect.tryPromise({
            try: async () => {
                const proc = Bun.spawn(['git', 'clone', repo_url, `./workspace/${deploymentId}`])
                const exitCode = await proc.exited
                if (exitCode !== 0) throw new Error('git clone failed')
            },
            catch: (error) => new Error(`Clone failed: ${error}`)
        })

        yield* db.update(deployments).set({ status: "building" })
            .where(eq(deployments.id, deploymentId))
        broadcast(deploymentId, 'Building...')

        yield* Effect.tryPromise({
            try: async () => {
                const proc = Bun.spawn(['npm', 'install'], { cwd: `./workspace/${deploymentId}` })
                const exitCode = await proc.exited
                if (exitCode !== 0) throw new Error('npm install failed')
            },
            catch: (error) => new Error(`NPM install failed: ${error}`)
        })

        yield* db.update(deployments).set({ status: "running" })
            .where(eq(deployments.id, deploymentId))
        broadcast(deploymentId, 'App is running!')

        yield* Effect.sync(() => {
            const startFile = Bun.file(`./workspace/${deploymentId}/index.js`).size > 0
                ? 'index.js'
                : 'index.ts'
            Bun.spawn(['bun', 'run', startFile], { cwd: `./workspace/${deploymentId}` })
        })

    }).pipe(
        Effect.catchAll((error) =>
            Effect.gen(function*() {
                const db = yield* DB
                yield* db.update(deployments).set({
                    status: "failed",
                    error_msg: error.message
                }).where(eq(deployments.id, deploymentId))
                broadcast(deploymentId, `Failed: ${error.message}`)
            })
        )
    )
