import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import updateProfile from "../apiFuncs/updateProfile";
import changePassword from "../apiFuncs/changePassword";
import deleteAccount from "../apiFuncs/deleteAccount";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // ---------- Profile section ----------
  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSavingProfile(true);
    try {
      const res = await updateProfile({ name: name.trim() });
      const updatedUser = res?.data?.user;
      if (updatedUser) {
        setUser((prev) => ({ ...prev, name: updatedUser.name }));
      }
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ---------- Password section ----------
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  // ---------- Notification toggles (client-only for now) ----------
  const [notifLocation, setNotifLocation] = useState(true);
  const [notifSOS, setNotifSOS] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  // ---------- Danger zone ----------
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted. Goodbye!");
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in py-4">
      {/* <div>
        <p className="text-[10px] font-bold tracking-widest text-[#8c90a0] uppercase mb-1">
          Account
        </p>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Settings
        </h2>
      </div> */}

      {/* ================= PROFILE CARD ================= */}
      <div className="mt-20 bg-[#1e1e1e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#b0c6ff] text-[#002d6e] flex items-center justify-center font-bold text-xl shrink-0">
            {user?.name ? user.name[0].toUpperCase() : "S"}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Profile Information
            </h3>
            <p className="text-xs text-[#8c90a0] mt-0.5">
              Update your display name below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
              Name
            </label>
            <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
              <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                person
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 focus:ring-0 text-[#e5e2e1] text-sm outline-none"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
              Phone Number
            </label>
            <div className="relative bg-[#0e0e0e]/50 rounded-lg border border-white/5 flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[#8c90a0]/50 text-lg">
                phone
              </span>
              <input
                type="tel"
                value={user?.phoneNumber || ""}
                disabled
                className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-[#8c90a0] text-sm outline-none cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-[#8c90a0]/70 ml-1">
              Phone number is used for login and can't be changed here.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-3 bg-[#b0c6ff] hover:bg-[#9cb6ff] text-[#002d6e] rounded-xl font-bold text-xs tracking-wide transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ================= PASSWORD CARD ================= */}
      <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Change Password
          </h3>
          <p className="text-xs text-[#8c90a0] mt-0.5">
            Choose a strong password you haven't used before.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
              Current Password
            </label>
            <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
              <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                lock
              </span>
              <input
                required
                type={showPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 focus:ring-0 text-[#e5e2e1] text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
                New Password
              </label>
              <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
                <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                  gpp_good
                </span>
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 focus:ring-0 text-[#e5e2e1] text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
                Confirm New Password
              </label>
              <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
                <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                  gpp_good
                </span>
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 focus:ring-0 text-[#e5e2e1] text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="flex items-center gap-1.5 text-xs text-[#8c90a0] hover:text-[#e5e2e1] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {showPw ? "visibility_off" : "visibility"}
              </span>
              {showPw ? "Hide passwords" : "Show passwords"}
            </button>

            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-3 bg-[#b0c6ff] hover:bg-[#9cb6ff] text-[#002d6e] rounded-xl font-bold text-xs tracking-wide transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= NOTIFICATIONS CARD ================= */}
      <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Notifications
          </h3>
          <p className="text-xs text-[#8c90a0] mt-0.5">
            Local preview only — not wired to a backend yet.
          </p>
        </div>

        <ToggleRow
          label="Location Sharing Alerts"
          description="Get notified when a family member's location updates."
          checked={notifLocation}
          onChange={() => setNotifLocation((v) => !v)}
        />
        <ToggleRow
          label="SOS Alerts"
          description="Immediate alerts when a family member sends an SOS."
          checked={notifSOS}
          onChange={() => setNotifSOS((v) => !v)}
        />
      </div>

      {/* ================= DANGER ZONE ================= */}
      <div className="bg-[#1e1e1e]/80 border border-red-500/20 rounded-2xl p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">
          Danger Zone
        </h3>

        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0e0e0e]/40 border border-white/5">
          <div>
            <p className="text-sm font-semibold text-[#e5e2e1]">Sign Out</p>
            <p className="text-xs text-[#8c90a0]">
              End your session on this device.
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
          >
            Disconnect
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div>
            <p className="text-sm font-semibold text-red-400">Delete Account</p>
            <p className="text-xs text-[#8c90a0]">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="w-full max-w-sm bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400 text-2xl">
                warning
              </span>
              <h4 className="text-lg font-bold text-white">
                Delete Your Account?
              </h4>
            </div>
            <p className="text-sm text-[#8c90a0]">
              This permanently deletes your account, removes you from every
              family circle, and cannot be undone. Type{" "}
              <span className="text-white font-semibold">DELETE</span> to
              confirm.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-[#0e0e0e] border border-[#424654] rounded-lg py-3 px-4 text-sm text-[#e5e2e1] outline-none focus:border-red-400/50"
            />
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput("");
                }}
                disabled={deleting}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteInput !== "DELETE"}
                className="flex-1 py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0e0e0e]/40 border border-white/5">
      <div>
        <p className="text-sm font-semibold text-[#e5e2e1]">{label}</p>
        <p className="text-xs text-[#8c90a0]">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative shrink-0 transition-colors duration-300 ease-out cursor-pointer ${
          checked ? "bg-[#4edea3]" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
