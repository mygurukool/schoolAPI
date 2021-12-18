const socketIO = require('socket.io')
const http = require('http')
const app = require('../app')
const logger = require("../config/logger");
const config = require("../config/config");
const { uuid } = require('uuidv4');
const { GroupChat } = require('../models');

const socket = () => {

    const socketServer = http.createServer(app)
    socketServer.listen(config.socketport, () => {
        logger.info(`Listening to socket server at ${config.socketport}`);
    })
    const io = socketIO(socketServer, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        },
    })

    const activeUsers = new Set();

    let roomId = "";


    io.on("connection", (socket) => {
        console.log('connection open');

        // get user groups
        // socket.on("GET_USER_GROUPS", async (room) => {
        //     console.log('room', room);
        //     const checkGroup = await GroupChat.find({ assignmentId: room.assignmentId })
        //     console.log('checkGroup', checkGroup);

        //     const filteredGroups = await Promise.all(checkGroup.filter(g => {
        //         const found = g.users.find(u => { return u.id === room.userId })
        //         // console.log('found', found, g.users)
        //         if (found) {
        //             return true
        //         }
        //         else { return false }
        //     }))
        //     console.log('filteredGroups', filteredGroups);
        //     if (filteredGroups.length > 0) {
        //         console.log();
        //         io.to(room.assignmentId).emit("SEND_USER_GROUPS", filteredGroups)

        //     }

        //     // const createGroup = await GroupChat.create(room)
        //     // roomId = createGroup.id || createGroup._id
        //     // socket.join(roomId, (e) => {
        //     //     console.log('e', e);
        //     // });
        //     // io.to(roomId).emit("SOCKET_ERROR")


        //     // const getGroups = await GroupChat.find(room)

        // });


        // Joining room for conversation
        socket.on("JOIN_ROOM", async (room) => {
            const checkRoom = await GroupChat.findOne({ roomId: room.roomId })
            if (!checkRoom) {
                const createGroup = await GroupChat.create(room)
                roomId = createGroup.roomId
                // console.log('created', createGroup, roomId);
                socket.join(roomId, (e) => {
                    console.log('e', e);
                });
                io.emit("SEND_USER_GROUPS", [createGroup])
            }
            else {
                roomId = checkRoom.roomId
                socket.join(roomId);
                io.emit("SEND_USER_GROUPS", [checkRoom])
            }
        });

        // send messages

        socket.on("SEND_MESSAGE", async (room) => {
            await GroupChat.findOneAndUpdate({ roomId: room.roomId }, { $push: { messages: room.message } })
            io.to(room.roomId).emit("GET_MESSAGE", room)
        })

        // const emitError = (error) => {
        //     io.to(groupId).emit("SOCKET_ERROR", error)
        // }


        socket.on("disconnect", () => {
            activeUsers.delete(socket.userId);
            console.log('disconnected');
            // Triggering this event disconnects user
            // io.to(groupId).emit("user disconnected", socket.userId);
        });
    });
    return io
}
module.exports = socket
