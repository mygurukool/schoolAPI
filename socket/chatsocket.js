const { ObjectId } = require("mongodb");
const { GroupChat } = require("../models");

const chatSocket = (socket, io) => {
  const data = socket.handshake.query;
  const { assignmentId, userId, userName } = data;

  const findMyGroups = async ({ userId, assignmentId }) => {
    const found = await GroupChat.find({
      assignmentId: data.assignmentId,

      "users.id": userId,
    });
    if (Array.isArray(found)) {
      return found;
    } else {
      return [found];
    }
  };

  const sendToUsers = async ({ users, type, data }) => {
    users.forEach((element) => {
      socket.to(element.id).emit(type, data);
    });
    socket.emit(type, data);
  };

  // console.log("socket handshake data", data);
  socket.join(userId);
  socket.on("getGroups", async () => {
    const checkGroup = await findMyGroups({ assignmentId, userId });

    console.log("checkGroup", checkGroup?.length);
    socket.emit("setGroups", checkGroup);
  });

  socket.on("ADD_USERS_TO_GROUP", async (req) => {
    if (!req._id || !req.id) {
      const createGroup = await GroupChat.create(req);
      try {
        console.log("createGroup", createGroup);
        createGroup.users.forEach((element) => {
          socket.to(element.id).emit("setGroups", [createGroup]);
        });

        socket.emit("setGroups", [createGroup]);
      } catch {
        await GroupChat.findByIdAndDelete(createGroup.id || createGroup._id);
        console.log("deleted");
      }
    }
  });

  socket.on("MESSAGE", async (message) => {
    const updated = await GroupChat.findByIdAndUpdate(
      message.groupId,

      { $push: { messages: message } }
    );
    console.log("updated", updated);
    try {
      if (updated) {
        sendToUsers({
          users: updated.users,
          type: "message",
          data: message,
        });
      }
      console.log("sent");
    } catch (error) {
      console.log("error", error);
    }
  });
  socket.on("GETMESSAGES", async ({ groupId, page }) => {
    const myGroups = await GroupChat.findById(groupId);
    console.log("GETMESSAGES", groupId, myGroups.messages.length);
    sendToUsers({
      users: myGroups.users,
      type: "SETMESSAGES",
      data: myGroups.messages,
    });
  });

  return socket;
};

module.exports = chatSocket;
