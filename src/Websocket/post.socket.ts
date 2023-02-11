import { Socket } from "socket.io";
import MySocketInterface from "../interfaces/socket.interface";
import database from "../database/database";
import IPost from "../interfaces/IPost.interface";

class PostsSocket implements MySocketInterface {

    async handleConnection(socket: Socket) {
        const data = await database.getPosts();
        socket.emit('connection', data);
        socket.on('addPost', (post: IPost) => {
            database.addPost(post);
            socket.broadcast.emit('addPost', post);
        });
    }

    middlewareImplementation(socket: Socket, next) {
        //Implement your middleware for orders here
        return next();
    }
}

export default PostsSocket;