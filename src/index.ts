import { opine, json,Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import { Entity, EntityBase, Fields, Remult } from 'remult';
import { remultMiddleware } from 'remult/remult-middleware';
import { createPostgresConnection } from './postgres.ts';
@Entity("tasks", { allowApiCrud: true })
class Task extends EntityBase {
    @Fields.autoIncrement()
    id = 0;
    @Fields.string()
    title = '';
}


const app = opine();
const r = new Router();
app.use(r);

app.use(json());

const api = remultMiddleware({
    dataProvider:  () => {
        return createPostgresConnection({
            connectionString: "postgres://postgres:MASTERKEY@localhost/postgres"
        })
    },
    entities: [Task]
});


app.use(api);
app.use((r,res)=>{});

app.get("/", async function (req, res) {
    const repo = remult.repo(Task);
    await repo.insert([{ title: "abc" }])
    res.json({ "name:": "noam", "count": await repo.count() });
});
app.post('/', async (req, res) => {
    console.log(req.body);
    res.send("ok");
})

// const api = remultExpress({
//     entities: [Task],
//     bodyParser:false
// })
// app.use((req, res, next) => {
//     //@ts-ignore
//     api(req,res,next);
// });




app.listen(
    3000,
    () => console.log("server has started on http://localhost:3000 🚀"),
);



const remult =// new Remult(new InMemoryDataProvider());
    new Remult();

