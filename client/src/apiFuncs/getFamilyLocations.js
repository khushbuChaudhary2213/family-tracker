import api from "../utils/axios";

const getFamilyLocations = async (familyId) => {
  try {
    const res = await api.get(`location/getFamilyLocations/${familyId}`);
    return res.data;
  } catch (err) {
    console.error("Error in getFamilyLocations API execution:", err);
    throw err;
  }
};

export default getFamilyLocations;
