import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios"; // Ensure you have axios installed and configured

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  // Reset state when closing
  const handleClose = () => {
    setStep(1);
    setPhone("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users/forgot-password", {
        phoneNumber: phone,
      });
      toast.success("OTP sent to your registered email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users/verify-otp", {
        phoneNumber: phone,
        otp,
      });
      toast.success("OTP Verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setIsLoading(true);
    try {
      await api.post("/users/reset-password", {
        phoneNumber: phone,
        otp,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      toast.success("Password reset successfully! You can now log in.");
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-[400px] bg-[#1e1e1e] border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#8c90a0] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* STEP 1: REQUEST OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#b0c6ff] tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-[#8c90a0] mt-1">
                Enter your registered phone number.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
                Phone Number
              </label>
              <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center focus-within:border-[#b0c6ff] transition-all">
                <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                  phone
                </span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-[#e5e2e1] text-sm outline-none"
                  placeholder="123456XXXX"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg font-bold text-sm bg-[#b0c6ff] text-[#002d6e] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? "Sending..." : "Send OTP to Email"}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#b0c6ff] tracking-tight">
                Verify Code
              </h2>
              <p className="text-xs text-[#8c90a0] mt-1">
                Enter the 6-digit code sent to your email.
              </p>
            </div>

            <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center focus-within:border-[#b0c6ff] transition-all">
              <input
                required
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-transparent border-none py-4 text-center tracking-[0.5em] text-lg text-[#e5e2e1] outline-none"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg font-bold text-sm bg-[#b0c6ff] text-[#002d6e] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#b0c6ff] tracking-tight">
                Create Sanctuary Key
              </h2>
              <p className="text-xs text-[#8c90a0] mt-1">
                Secure your account with a new password.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center focus-within:border-[#b0c6ff] transition-all">
                <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                  lock
                </span>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent border-none py-3.5 pl-12 pr-12 text-[#e5e2e1] text-sm outline-none"
                  placeholder="New Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#8c90a0] hover:text-[#e5e2e1]"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center focus-within:border-[#b0c6ff] transition-all">
                <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                  gpp_good
                </span>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-none py-3.5 pl-12 pr-12 text-[#e5e2e1] text-sm outline-none"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg font-bold text-sm bg-emerald-500 text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 mt-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {isLoading ? "Encrypting..." : "Confirm Reset"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
