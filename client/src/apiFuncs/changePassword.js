import api from "../utils/axios";

// You'll build: PATCH /api/v1/users/change-password
const changePassword = async ({ currentPassword, newPassword, confirmNewPassword }) => {
  try {
    const res = await api.patch("/users/change-password", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    return res.data;
  } catch (err) {
    console.error("Error in changePassword API execution:", err);
    throw err;
  }
};

export default changePassword;
