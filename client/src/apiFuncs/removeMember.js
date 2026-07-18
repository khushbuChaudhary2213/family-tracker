import api from "../utils/axios";

// Hits POST /api/v1/family/:familyId/removeMember
const removeMember = async (familyId, memberId) => {
  try {
    const res = await api.post(`/family/${familyId}/removeMember`, {
      memberId,
    });
    return res.data;
  } catch (err) {
    console.error("Error in removeMember API execution:", err);
    throw err;
  }
};

export default removeMember;
