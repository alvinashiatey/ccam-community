import { join } from 'node:path'
const Low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
import IPost from '../interfaces/IPost.interface'

class Database {
    private readonly adapter: any
    public db: any
    private readonly file: string;

    constructor() {
        this.file = join(__dirname, "../db.json");
        this.adapter = new FileSync(this.file)
        this.db = new Low(this.adapter)
    }

    async init() {
        await this.db.read()
        this.db.data = this.db.data || { posts: [] }
        return this
    }

    public async getPosts() {
        return this.db.get("posts").value() as IPost[]
    }

    public async getPost(id: number) {
        return this.db.get("posts").find({ id }).value() as IPost
    }

    public async addPost(post: IPost) {
        this.db.get("posts").push(post).write()
    }
}

export default new Database()
