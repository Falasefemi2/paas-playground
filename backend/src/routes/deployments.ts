import { Effect } from "effect";
import { Hono } from "hono";
import { AppLive, DB } from "../db";
import { deployments } from "../db/schema";
import { runPipeline } from "../pipeline";
import { streamSSE } from "hono/streaming";
import { addClient, removeClient } from "../sse";

const deployment = new Hono()

deployment.post('/', async (c) => {
    const { repo_url } = await c.req.json()
    const result = await Effect.runPromise(
        Effect.gen(function*() {
            const db = yield* DB
            const [newDeployment] = yield* db.insert(deployments).values({
                repo_url
            }).returning()
            return newDeployment
        }).pipe(Effect.provide(AppLive))
    )
    Effect.runPromise(
        runPipeline(repo_url, result.id).pipe(Effect.provide(AppLive))
    )
    return c.json(result, 201)
})

deployment.get("/", async (c) => {
    const result = await Effect.runPromise(
        Effect.gen(function*() {
            const db = yield* DB
            const allDeplyments = yield* db.select().from(deployments)
            return allDeplyments
        }).pipe(Effect.provide(AppLive))
    )
    return c.json(result, 200)
})

deployment.get("/:id/logs/stream", (c) => {
    c.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    const id = c.req.param("id")
    return streamSSE(c, async (stream) => {
        const writer = (log: string) => {
            stream.writeSSE({ data: log })
        }
        addClient(id, writer)
        await new Promise(() => { })
        removeClient(id, writer)
    })
})

export default deployment;
