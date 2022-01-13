const socketIO = require('socket.io')
const app = require('../app')
const logger = require("../config/logger");
const config = require("../config/config");
const { GroupChat } = require('../models');

const socket = (server) => {

    // const socketServer = http.createServer(app)
    // socketServer.listen(config.socketport, () => {
    //     logger.info(`Listening to socket server at ${config.socketport}`);
    // })
    const io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        },
    })

    const activeUsers = new Set();

    let roomId = "";

    const paginate = (array, page_size, page_number) => {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === "desc"
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }


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
            console.log('JOIN_ROOM', room);

            const checkRoom = await GroupChat.findOne({ roomId: room.roomId })
            if (!checkRoom) {
                const createGroup = await GroupChat.create(room)
                roomId = createGroup.roomId
                socket.join(roomId);
                // io.emit("SEND_USER_GROUPS", [createGroup])
            }
            else {

                roomId = checkRoom.roomId
                socket.join(roomId);
                // io.emit("SEND_USER_GROUPS", [checkRoom])
            }
        });

        // send messages

        socket.on("SEND_MESSAGE", async (room) => {
            await GroupChat.findOneAndUpdate({ roomId: room.roomId }, { $push: { messages: room.message } })
            console.log("SEND_MESSAGE", room);
            io.to(room.roomId).emit("GET_MESSAGE", room)
        })

        socket.on("SEND_MESSAGES", async (room) => {
            console.log("SEND_MESSAGES", room);

            const group = await GroupChat.findOne({ roomId: room.roomId })
            const groupMessages = group.messages
            const page = room.page
            const rowsPerPage = 5
            // const paginatedMessages = paginate(messages.messages, 20, room.page + 1)
            const paginatedMessages = stableSort(groupMessages, getComparator("desc", "timeStamp")).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            )

            const newMessage = await Promise.all(paginatedMessages.reverse().map(m => {
                return { message: m }
            }))
            // console.log("GET_MESSAGES", newMessage);

            io.to(room.roomId).emit("GET_MESSAGES", newMessage)
        })

        socket.on("ADD_USERS_TO_GROUP", async (data) => {
            console.log('ADD_USERS_GROUP', data);
            if (!data.groupId) {
                const createGroup = await GroupChat.create(data)
                roomId = createGroup.roomId
                socket.join(roomId);
                io.emit("SEND_USER_GROUPS", [createGroup])

            } else {
                const getGroup = await GroupChat.findById(data.groupId)
                let currentGroupUser = getGroup.users
                await Promise.all(data.users.map(async (u) => {
                    const found = await getGroup.users.find(f => f.id === u.id)
                    if (!found) {
                        currentGroupUser.push(u)
                    }
                }))
                // console.log('currentGroupUser', currentGroupUser);
                const updatedGroup = await GroupChat.findByIdAndUpdate(data.groupId, { users: currentGroupUser }, { new: true })
                io.emit("SEND_USER_GROUPS", [updatedGroup])

            }

        })



        // whiteboard

        socket.on("JOIN_WHITEBOARD_ROOM", async (data) => {
            console.log('JOIN_WHITEBOARD_ROOM', data);
            socket.join(data)
        })

        socket.on("CREATE_WHITEBOARD", async (data) => {
            console.log("CREATE_WHITEBOARD", data);
            io.to(data.courseId).emit("SET_WHITEBOARD_URL", data.whiteBoardUrl)
        })

        // conference

        socket.on("JOIN_CONFERENCE_ROOM", async (data) => {
            console.log('JOIN_CONFERENCE_ROOM', data);
            socket.join(data)
        })

        socket.on("INITIALIZE_CONFERENCE", async (data) => {
            // console.log('INITIALIZE_CONFERENCE', data);
            socket.broadcast.to(data.courseId).emit("SET_CONFERENCE", data)
        })

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
