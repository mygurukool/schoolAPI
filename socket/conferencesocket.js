const conferencesocket = (socket, io) => {
  console.log("conference socke");
  const data = socket.handshake.query;
  const { courseId, userId } = data;

  socket.join(courseId);
  socket.on("INITIALIZE_CONFERENCE", async (request) => {
    // console.log("set conf req");
    socket.broadcast.to(courseId).emit("SET_CONFERENCE", request);
  });

  return socket;
};

module.exports = conferencesocket;
