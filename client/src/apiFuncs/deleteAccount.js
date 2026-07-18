import api from "../utils/axios";

// You'll build: DELETE /api/v1/users/me
const deleteAccount = async () => {
  try {
    const res = await api.delete("/users/me");
    return res.data;
  } catch (err) {
    console.error("Error in deleteAccount API execution:", err);
    throw err;
  }
};

export default deleteAccount;
