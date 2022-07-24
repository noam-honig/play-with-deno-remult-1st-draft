import { opine, json, Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import { BackendMethod, Entity, EntityBase, Fields, Remult, Validators } from 'remult';
import { remultMiddleware } from 'remult/remult-middleware';
import { createPostgresConnection } from './postgres.ts';
@Entity("tasks", {
    allowApiCrud: true
})
export class Task {
    @Fields.uuid()
    id!: string;

    @Fields.string({
        validate: Validators.required
    })
    title = '';

    @Fields.boolean()
    completed = false;
    @BackendMethod({ allowed: false })
    static testForbidden() {
    }
}
const app = opine();
const r = new Router();

const api = remultMiddleware({

    entities: [Task]
});

app.use(json());
app.use(api);

app.get('/api/test', async (req, res) => {
    //@ts-ignore
    const remult: Remult = await api.getRemult(req);
    res.json({ result: await remult.repo(Task).count() })
});


const port = 3006;
app.listen(
    port,
    () => console.log("opine " + port),
);
