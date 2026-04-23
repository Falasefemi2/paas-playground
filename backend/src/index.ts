import { Effect } from 'effect'
import { Hono } from 'hono'
import { AppLive, DB } from './db';
import deployment from './routes/deployments';
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.route('/deployments', deployment)

const program = Effect.gen(function*() {
    const db = yield* DB;
    console.log('DB connected')
}).pipe(
    Effect.provide(AppLive),
    Effect.catchAll((error) => Effect.sync(() => console.error('Error:', error)))
)

Effect.runPromise(program).then(() => {
    Bun.serve({
        fetch: app.fetch,
        port: 3000
    })
    console.log('Server running on port 3000')
})
