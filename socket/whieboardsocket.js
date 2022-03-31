const whiteboardsocket = (socket, io) => {
  console.log("whiteboard socke");

  const data = socket.handshake.query;
  const { courseId, whiteBoardUrl } = data;

  socket.join(courseId);
  socket.on("CREATE_WHITEBOARD", async (req) => {
    socket.emit("SET_WHITEBOARD_URL", req.whiteBoardUrl);

    socket.broadcast.to(courseId).emit("SET_WHITEBOARD_URL", req.whiteBoardUrl);
  });

  return socket;
};

module.exports = whiteboardsocket;
