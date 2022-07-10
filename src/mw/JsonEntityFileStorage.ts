import * as path from "path";
import { existsSync, writeFileSync, readFileSync } from "fs";

import { JsonEntityStorage } from "remult";
export class JsonEntityFileStorage implements JsonEntityStorage {
    getItem(entityDbName: string): string {
        let fn = path.join(this.folderPath, entityDbName) + '.json';
        if (existsSync(fn)) {
            return readFileSync(fn).toString()
        }
        return undefined!;
    }
    setItem(entityDbName: string, json: string) {
        if (!existsSync(this.folderPath)) {
            Deno.mkdirSync(this.folderPath);
        }
        return writeFileSync(path.join(this.folderPath, entityDbName) + '.json', json);
    }
    constructor(private folderPath: string) { }
}