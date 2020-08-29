const common = require("./common");
const axios = require("axios");

// Get list of vehicles
// returns array of vehicles
const getVehicles = async (dataSetId) => {
   try {
      const url = common.BASE + `/${dataSetId}/vehicles`;

      const response = await axios({
         method: "get",
         url: url,
      });

      return response.data.vehicleIds;
   } catch (e) {
      console.log("Problem getting the vehicle list: ", e);
   }
};

// Gets information about specific vehicle based on vehicleId
// returns formatted vehicle data object and dealer id
const getVehicleData = async (vechicleId, dataSetId) => {
   try {
      const url = common.BASE + `/${dataSetId}/vehicles/${vechicleId}`;

      const { data } = await axios({
         method: "get",
         url: url,
      });

      const vehicleObj = {
         vehicleId: data.vehicleId,
         year: data.year,
         make: data.make,
         model: data.model,
      };

      return { vehicleObj: vehicleObj, dealerId: data.dealerId };
   } catch (e) {
      console.log("Problem getting the vehicle data: ", e);
   }
};

// Get's dealer information
// returns object with dealer's name
const getDealerNames = async (dealerId, dataSetId) => {
   const url = common.BASE + `/${dataSetId}/dealers/${dealerId}`;

   const { data } = await axios({
      method: "get",
      url: url,
   });

   return data.name;
};

// Takes dealer object and makes a parallel calls to get dealer info for unique dealers ids
// returns new dealer obj
const appendDealerNamesToDealerObj = async (dealerObj, dataSetId) => {
   await Promise.all(
      dealerObj.dealerIds.map(async (dealerId) => {
         try {
            const dealerName = await getDealerNames(dealerId, dataSetId);

            //Appending vehicle data to dealer object
            dealerObj[dealerId].name = dealerName;
         } catch (e) {
            console.log("Problem with the appending dealer name to object: ", e);
         }
      })
   );

   return dealerObj;
};

// Takes dealer object and makes a parallel calls to get vehicle info for unique vehicle ids
// returns new dealer obj
const appendVehiclesToDealerObj = async (dealerObj, dataSetId, vehiclesList) => {
   await Promise.all(
      vehiclesList.map(async (vehicleId) => {
         try {
            const { vehicleObj, dealerId } = await getVehicleData(vehicleId, dataSetId);

            //Appending vehicle data to dealer object
            if (!dealerObj[dealerId]) {
               dealerObj[dealerId] = {
                  dealerId: dealerId,
                  name: "",
                  vehicles: [vehicleObj],
               };
               dealerObj.dealerIds.push(dealerId);
            } else {
               dealerObj[dealerId].vehicles.push(vehicleObj);
            }
         } catch (e) {
            console.log("Problem with the appending vehicle data to object: ", e);
         }
      })
   );

   return dealerObj;
};

// Creates the object to keep track of what dealers contain which vehicles
// Could add a list of vehicles that failed and add a retry handler if you wanted to
const createDealerObj = async (dataSetId) => {
   let dealerObj = { dealerIds: [] };
   const vehiclesList = await getVehicles(dataSetId);

   //Using Promise.all to make API calls in parallel
   dealerObj = await appendVehiclesToDealerObj(dealerObj, dataSetId, vehiclesList);
   dealerObj = await appendDealerNamesToDealerObj(dealerObj, dataSetId);

   return { dealerObj: dealerObj, dataSetId: dataSetId };
};

module.exports = {
   createDealerObj,
};
