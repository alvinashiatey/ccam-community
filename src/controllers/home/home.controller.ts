import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from 'interfaces/IControllerBase.interface'
import database from "../../database/database";

class HomeController implements IControllerBase {
    public path = '/'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(this.path, this.index)
    }

    index = async (req: Request, res: Response) => {
        res.render('home/index', { title: "Web Server Love", data: await database.getPosts() })
    }
}

export default HomeController