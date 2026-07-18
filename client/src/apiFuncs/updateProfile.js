import api from "../utils/axios";

// You'll build: PATCH /api/v1/users/me
const updateProfile = async ({ name }) => {
  try {
    const res = await api.patch("/users/me", { name });
    return res.data;
  } catch (err) {
    console.error("Error in updateProfile API execution:", err);
    throw err;
  }
};

export default updateProfile;
