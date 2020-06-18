const axios = require("axios");
const config = require("../config/config.json");

const SERVER_URL = config.SERVER_URL;

// 채팅방 참여
exports.joinToRoom = (liveSeq, userName) => {
  return axios.post(`${SERVER_URL}/api/live/join`, {
    liveSeq,
    userName,
  });
};

exports.leaveToRoom = (liveSeq, userName) => {
  return axios.post(`${SERVER_URL}/api/live/withdraw`, {
    liveSeq,
    userName
  })
}

exports.getParticipantList = (liveSeq) => {
  return axios.get(`${SERVER_URL}/api/live/users`, {
    params: {
      liveSeq,
    },
  }).then(resp => {
    return {
      participantList : resp.data.body
    }
  }).catch(err => {
    return {
      err
    }
  });
};
