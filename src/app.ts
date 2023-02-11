import * as express from 'express'
import { Application } from 'express'
import setUpNunjucks from './helpers/nunjuecks_starter'
import database from "./database/database";
import Websocket from "./Websocket/websocket";
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import PostSocket from "./Websocket/post.socket";


class App {
    public app: Application
    public port: number
    private io: Websocket;
    private readonly server: Server<typeof IncomingMessage, typeof ServerResponse>;

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port
        database.init().then(() => console.log("Database initialized"))
        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.assets()
        this.template()
        this.server = createServer(this.app)
        this.io = Websocket.getInstance(this.server)
        this.sockets()
    }
    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private sockets() {
        this.io.initializeHandlers([
            { path: '/', handler: new PostSocket() }
        ]);
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    private assets() {
        this.app.use(express.static('public'))
        this.app.use(express.static('views'))
    }

    private template() {
        setUpNunjucks(this.app)
        this.app.set('view engine', 'njk')
    }

    private onError(error: any) {
        if (error.syscall !== 'listen') {
            throw error
        }
        const bind = typeof this.port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges')
                process.exit(1)
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use')
                process.exit(1)
                break;
            default:
                throw error;
        }
    }

    public listen() {
        this.server.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
        this.server.on('error', this.onError.bind(this))
    }
}

export default App