const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = 3002;

app.get("/", (req, res) => {
  res.send("Welcome to socket app ! - project starfruit");
});

io.on("connection", (socket) => {
  var roomId = "";
  var userName = "";
  console.log("New Client Connected");
  socket.on("init", (data) => {
    try {
      console.log(data);
      socket.join(data.liveSeq);
      roomId = data.liveSeq;
      userName = data.userName;
      socket.broadcast.to(roomId).emit("welcome", data);
      console.log(io.nsps["/"].adapter.rooms[roomId]);
    } catch (err) {}
  });

  socket.on("message", (data) => {
    // console.log("message : " + data);
    console.log(roomId);
    socket.emit("response", data);
    socket.broadcast.to(roomId).emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    socket.broadcast.to(roomId).emit("announce_dis", userName);
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log("server is running");
});
