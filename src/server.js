const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const api = require("./api");
const { join } = require("path");

const PORT = 3002;

app.get("/", (req, res) => {
  res.send("Welcome to socket app ! - project starfruit");
});

const getParticipantList = async(liveSeq) => {
  try {
    const participantList = await api.getParticipantList(liveSeq);
    return participantList;
  } catch (err) {
    console.log(err);
  }
};

const joinToRoom = async(roomInfo, userName) => {
  try {
    const roomType = roomInfo.split("/")[2];
    const roomSeq = parseInt(roomInfo.split("/")[3]);
    console.log(roomSeq, userName);
    if (roomType === "live") {
      const participant = await api
        .liveJoin(roomSeq, userName)
        .then(async(resp) => {
          // console.log("live join");
          console.log(resp.data);
          const result = await api.getLiveParticipantList(roomSeq);
          return result;
        });
      return participant;
    } else {
      const participant = await api
        .vodJoin(roomSeq, userName)
        .then(async(resp) => {
          console.log("vod join");
          console.log(resp.data);
          const result = await api.getVodParticipantList(roomSeq);
          return result;
        });
      return participant;
    }
  } catch (err) {
    console.log(err);
  }
};

const leaveToRoom = async(roomInfo, userName) => {
  try {
    const roomType = roomInfo.split("/")[2];
    const roomSeq = roomInfo.split("/")[3];
    if (roomType === "live") {
      const participant = await api
        .liveLeave(roomSeq, userName)
        .then(async(resp) => {
          console.log("live leave");
          console.log(resp.data);
          const result = await api.getLiveParticipantList(roomSeq);
          return result;
        });
      return participant;
    } else {
      const participant = await api
        .vodLeave(roomSeq, userName)
        .then(async(resp) => {
          console.log("vod leave");
          console.log(resp.data);
          const result = await api.getVodParticipantList(roomSeq);
          return result;
        });
      return participant;
    }
  } catch (err) {
    console.log(err);
  }
};

io.on("connection", (socket) => {
  var roomId = "";
  var userName = "";
  console.log("New Client Connected");
  socket.on("init", async(data) => {
    try {
      console.log(data);
      socket.join(data.liveSeq);
      roomId = data.liveSeq;
      userName = data.userName;
      // await joinToRoom(roomId, userName).then((resp) => {
      //   console.log("[participantList]");
      //   console.log(resp);
      //   io.to(roomId).emit("participant", resp);
      // });
      const participantList = await joinToRoom(roomId, userName);
      // console.log(participantList);
      // const participantList = await joinToRoom(roomId, userName);
      // console.log('[participantList]');
      // console.log(participantList);
      io.to(roomId).emit("participant", participantList);
      socket.broadcast.to(roomId).emit("welcome", data);
      console.log(io.nsps["/"].adapter.rooms[roomId]);
    } catch (err) {}
  });

  socket.on("message", async(data) => {
    // console.log("message : " + data);
    console.log(roomId.split("/"));
    console.log(data);
    if (roomId.split("/")[2] === "live") {
      const liveSeq = roomId.split("/")[3];
      const { data: respLiveChatLog } = await api.liveChatLog(
        liveSeq,
        data.userName,
        data.msg
      );
      console.log(respLiveChatLog.body);
    } else {
      const vodSeq = roomId.split("/")[3];
      const { data: respVodChatLog } = await api.vodChatLog(
        vodSeq,
        data.userName,
        data.msg
      );
      console.log(respVodChatLog.body);
    }
    socket.emit("response", data);
    socket.broadcast.to(roomId).emit("broadcast", data);
  });

  socket.on("disconnect", async() => {
    console.log("Client disconnected");
    console.log(roomId, userName);
    if (roomId) {
      const participantList = await leaveToRoom(roomId, userName);
      // console.log(participantList);
      socket.broadcast.to(roomId).emit("announce_dis", userName);
      io.to(roomId).emit("participant", participantList);
      socket.leave(roomId);
    }
  });
});

server.listen(PORT, () => {
  console.log("server is running");
});