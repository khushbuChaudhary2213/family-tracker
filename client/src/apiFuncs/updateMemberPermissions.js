import api from "../utils/axios";

// Hits PATCH /api/v1/family/:familyId/permissions
const updateMemberPermissions = async (
  familyId,
  targetMemberId,
  newAllowedIds,
) => {
  try {
    const res = await api.patch(`/family/${familyId}/permissions`, {
      targetMemberId,
      newAllowedIds,
    });
    return res.data;
  } catch (err) {
    console.error("Error in updateMemberPermissions API execution:", err);
    throw err;
  }
};

export default updateMemberPermissions;
