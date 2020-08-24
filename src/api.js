const axios = require("axios");
const config = require("../config/config.json");

const SERVER_URL = config.SERVER_URL;

// 채팅방 참여
exports.liveJoin = (liveSeq, userName) => {
  return axios.post(`${SERVER_URL}/api/live/join`, {
    liveSeq,
    userName,
  });
};

exports.liveLeave = (liveSeq, userName) => {
  return axios.post(`${SERVER_URL}/api/live/withdraw`, {
    liveSeq,
    userName,
  });
};
exports.vodJoin = (vodSeq, userName) => {
  return axios.post(`${SERVER_URL}/api/vod/join`, {
    vodSeq,
    userName,
  });
};

exports.vodLeave = (vodSeq, userName) => {
  return axios.post(`${SERVER_URL}/api/vod/withdraw`, {
    vodSeq,
    userName,
  });
};

exports.getLiveParticipantList = (liveSeq) => {
  return axios
    .get(`${SERVER_URL}/api/live/users`, {
      params: {
        liveSeq,
      },
    })
    .then((resp) => {
      return {
        participantList: resp.data.body,
      };
    })
    .catch((err) => {
      return {
        err,
      };
    });
};
exports.getVodParticipantList = (vodSeq) => {
  return axios
    .get(`${SERVER_URL}/api/vod/users`, {
      params: {
        vodSeq,
      },
    })
    .then((resp) => {
      return {
        participantList: resp.data.body,
      };
    })
    .catch((err) => {
      return {
        err,
      };
    });
};

exports.liveChatLog = (liveSeq, userName, message) => {
  return axios.get(`${SERVER_URL}/api/log/chat`, {
    params: {
      liveSeq,
      userName,
      message,
    },
  });
};
exports.vodChatLog = (vodSeq, userName, message) => {
  return axios.get(`${SERVER_URL}/api/log/chat`, {
    params: {
      vodSeq,
      userName,
      message,
    },
  });
};