const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const api = require("./api");
const { join } = require("path");

const PORT = 3002;

app.get("/", (req, res) => {
  res.send("Welcome to socket app ! - project starfruit");
});

const joinToRoom = async (liveSeq, userName) => {
  try {
    const {data} = await api.joinToRoom(liveSeq, userName);
    console.log(data);
    const result = await api.getParticipantList(liveSeq);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const leaveToRoom = async (liveSeq, userName) => {
  try{
    const {data} = await api.leaveToRoom(liveSeq, userName);
    console.log(data);
    const result = await api.getParticipantList(liveSeq);
    return result
  }catch(err){
    console.log(err);
  }
}

io.on("connection", (socket) => {
  var roomId = "";
  var userName = "";
  console.log("New Client Connected");
  socket.on("init", async (data) => {
    try {
      console.log(data);
      socket.join(data.liveSeq);
      roomId = data.liveSeq;
      userName = data.userName;
      const participantList = await joinToRoom(roomId, userName);
      console.log(participantList);
      socket.broadcast.to(roomId).emit("welcome", data);
      io.to(roomId).emit("participant", participantList);
      console.log(io.nsps["/"].adapter.rooms[roomId]);
    } catch (err) {}
  });

  socket.on("message", (data) => {
    // console.log("message : " + data);
    console.log(roomId);
    socket.emit("response", data);
    socket.broadcast.to(roomId).emit("broadcast", data);
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected");
    console.log(roomId, userName);
    const participantList = await leaveToRoom(roomId, userName);
    console.log(participantList);
    socket.broadcast.to(roomId).emit("announce_dis", userName);
    io.to(roomId).emit("participant", participantList);
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log("server is running");
});
