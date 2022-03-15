const { GroupChat } = require("../models");


let rowsPerPage = 5
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


const chatSocket = (socket, io) => {
  const data = socket.handshake.query;
  const { assignmentId, userId, userName } = data;

  // console.log('data', data);

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

    // console.log("checkGroup", checkGroup?.length);
    socket.emit("setGroups", checkGroup);
  });

  socket.on("ADD_USERS_TO_GROUP", async (req) => {
    if (!req._id || !req.id) {
      const createGroup = await GroupChat.create(req);
      try {
        // console.log("createGroup", createGroup);
        createGroup.users.forEach((element) => {
          socket.to(element.id).emit("setGroups", [createGroup]);
        });

        socket.emit("setGroups", [createGroup]);
      } catch {
        await GroupChat.findByIdAndDelete(createGroup.id || createGroup._id);
        // console.log("deleted");
      }
    }
  });

  socket.on("FORWARD_MESSAGE", async (req) => {
    const { group, message } = req
    // console.log("FORWARD_MESSAGE", group, message);
    if (group) {
      const createGroup = await GroupChat.create(group);
      const updated = await GroupChat.findByIdAndUpdate(
        createGroup._id || createGroup.id,
        { $push: { messages: message } }
      );
      // console.log('updated');
      try {
        if (updated) {
          sendToUsers({
            users: updated.users,
            type: "setGroups",
            data: [createGroup],
          });
        }
        // console.log("sent");
      } catch (error) {
        console.log("error", error);
      }
    } else {
      const updated = await GroupChat.findByIdAndUpdate(
        message.groupId,
        { $push: { messages: message } }
      );
      // console.log('updated else');
      try {
        if (updated) {
          sendToUsers({
            users: updated.users,
            type: "message",
            data: message,
          });
        }
        // console.log("sent");
      } catch (error) {
        console.log("error", error);
      }
    }
  });

  socket.on("MESSAGE", async (message) => {
    const updated = await GroupChat.findByIdAndUpdate(
      message.groupId,

      { $push: { messages: message } }
    );
    // console.log("updated", updated);
    try {
      if (updated) {
        sendToUsers({
          users: updated.users,
          type: "message",
          data: message,
        });
      }
      // console.log("sent");
    } catch (error) {
      console.log("error", error);
    }
  });
  socket.on("GETMESSAGES", async ({ groupId, page }) => {
    const myGroups = await GroupChat.findById(groupId);
    // console.log("GETMESSAGES", groupId, myGroups.messages.length);
    // console.log('page', page, myGroups.messages.length);

    const paginatedMessages = stableSort(
      myGroups.messages,
      getComparator("desc", "timeStamp")
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const messagesToSent = (paginatedMessages && Array.isArray(paginatedMessages)) ? paginatedMessages.reverse() : []

    socket.emit("SETMESSAGES", messagesToSent)
    // sendToUsers({
    //   users: myGroups.users,
    //   type: "SETMESSAGES",
    //   data: myGroups.messages,
    // });
  });

  return socket;
};

module.exports = chatSocket;
