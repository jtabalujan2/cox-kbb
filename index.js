const common = require("./src/common");
const vehicles = require("./src/vehicles");

const createDealerObject = async () => {
   const dataSetId = await common.getDataSetId();
   const dealerObj = await vehicles.createDealerObj(dataSetId);
   return { dataSetId, dealerObj };
};

const createAnswerPayload = ({ dealerObj }) => {
   const answerPayload = { dealers: [] };

   for (let dealerId of dealerObj.dealerIds) {
      answerPayload.dealers.push(dealerObj[dealerId]);
   }

   return answerPayload;
};

const main = async () => {
   const { dataSetId, dealerObj } = await createDealerObject();
   const answerPayload = await createAnswerPayload(dealerObj);

   const response = await common.postAnswer(dataSetId, answerPayload);
   // const check = await util.cheat();

   console.log(response);
};

main();
