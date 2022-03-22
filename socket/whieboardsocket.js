const whiteboardsocket = (socket, io) => {
  console.log("whiteboard socke");

  const data = socket.handshake.query;
  const { courseId, whiteBoardUrl } = data;

  socket.join(courseId);
  socket.on("CREATE_WHITEBOARD", async () => {
    console.log("sent whiteboard res");

    socket.broadcast
      .to(data.courseId)
      .emit("SET_WHITEBOARD_URL", whiteBoardUrl);
  });

  return socket;
};

module.exports = whiteboardsocket;
