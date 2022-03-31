const conferencesocket = (socket, io) => {
  console.log("conference socke");
  const data = socket.handshake.query;
  const { courseId, userId } = data;

  socket.join(courseId);
  socket.on("INITIALIZE_CONFERENCE", async () => {
    console.log("set conf req");
    socket.broadcast.to(data.courseId).emit("SET_CONFERENCE", data);
  });

  return socket;
};

module.exports = conferencesocket;
