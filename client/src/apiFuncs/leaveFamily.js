import api from "../utils/axios";

// Hits POST /api/v1/family/:familyId/leaveFamily
const leaveFamily = async (familyId, memberId) => {
  try {
    const res = await api.post(`/family/${familyId}/leaveFamily`, {
      memberId,
    });
    return res.data;
  } catch (err) {
    console.error("Error in leaveFamily API execution:", err);
    throw err;
  }
};

export default leaveFamily;
