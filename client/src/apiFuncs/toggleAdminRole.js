import api from "../utils/axios"; // or your configured axios instance

export const makeAdmin = async (familyId, targetMemberId) => {
  const response = await api.patch(`/family/${familyId}/makeAdmin`, {
    targetMemberId,
  });
  return response.data;
};

export const revokeAdmin = async (familyId, targetMemberId) => {
  const response = await api.patch(`/family/${familyId}/revokeAdmin`, {
    targetMemberId,
  });
  return response.data;
};
