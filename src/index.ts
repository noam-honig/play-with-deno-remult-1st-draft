import { opine, json } from "https://deno.land/x/opine@2.2.0/mod.ts";
import { Entity, EntityBase, Fields, JsonDataProvider, JsonEntityStorage, Remult, allEntities } from 'remult';
import { remultMiddleware } from "./mw/remult-middleware.ts";



import { JsonEntityFileStorage } from "./mw/JsonEntityFileStorage.ts";



@Entity("tasks", { allowApiCrud: true })
class Task extends EntityBase {
    @Fields.autoIncrement()
    id = 0;
    @Fields.string()
    title = '';
}


const app = opine();


app.use(json());

const api = remultMiddleware({
    entities: [Task]
});
console.log(allEntities);
console.log(api);
app.use((req: any, res: any, next: VoidFunction) =>
    api.handleRequest(req, res, next));

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
    new Remult(new JsonDataProvider(new JsonEntityFileStorage('./db')));
