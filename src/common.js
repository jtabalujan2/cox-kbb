const axios = require("axios");

const BASE = `http://api.coxauto-interview.com/api`;
// const api = {
//    VEHICLE_INFO_API: BASE + `/${datasetId}/vehicles/${altId}`,
//
// };

const getDataSetId = async () => {
   const url = BASE + `/datasetId`;

   const response = await axios({
      method: "get",
      url: url,
   });

   return response.data.datasetId;
};

const postAnswer = async (dataSetId, answerObj) => {
   const url = BASE + `/${dataSetId}/answer`;
   const { data } = await axios({
      method: "post",
      url: url,
      data: answerObj,
   });

   return data;
};

const cheat = async () => {
   const result = await axios.get("http://api.coxauto-interview.com/api/SW-VigpL2Ag/cheat");
   return result;
};

module.exports = {
   getDataSetId,
   postAnswer,
   cheat,
   BASE,
};
