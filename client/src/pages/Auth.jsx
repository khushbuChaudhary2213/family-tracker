import { useEffect, useState } from "react";
import signUpUser from "../apiFuncs/signUpUser";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import loginUser from "../apiFuncs/loginUser";
import getCurrentUser from "../apiFuncs/getCurrentUser";
import joinFamily from "../apiFuncs/joinFamily";

export default function Auth() {
  const { initializeSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const incomingMode = location.state?.initialMode || "login";

  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(incomingMode === "signup");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsSignUp(incomingMode === "signup");
  }, [incomingMode]);

  // State for controlled inputs
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (name, phone, password, confirmPassword) => {
    try {
      const res = await signUpUser({
        name,
        phoneNumber: phone,
        password,
        confirmPassword,
      });

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        setError("");

        const updatedUser = await initializeSession(res.data.user);

        const pendingInvite = localStorage.getItem("pendingInvite");

        if (pendingInvite) {
          const currentFamilyId =
            updatedUser?.family?.familyId || updatedUser?.family?._id;

          // For a brand new user, this will hit immediately
          if (!currentFamilyId) {
            toast.success(
              "Account created! Connecting you to the family network...",
            );
            navigate(`/join/${pendingInvite}`, { replace: true });
            return; // Terminate early so we don't flash the dashboard view
          } else {
            localStorage.removeItem("pendingInvite");
          }
        }

        toast.success("Account created successfully! Welcome to Sentry.");
        navigate("/dashboard", { replace: true });
      } else {
        const errorMsg = res?.message || "Signup failed. Please try again.";
        toast.error(errorMsg);
      }
      toast.success("Account created successfully! Welcome to Sentry.");
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleLogin = async (phone, password) => {
    try {
      const res = await loginUser({ phoneNumber: phone, password });

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        setError("");
        // console.log(res);

        const updatedUser = await initializeSession(res.data.user);

        const pendingInvite = localStorage.getItem("pendingInvite");

        // 2. Check if there is an active invite pending evaluation
        if (pendingInvite) {
          const currentFamilyId =
            updatedUser?.family?.familyId || updatedUser?.family?._id;

          if (!currentFamilyId) {
            toast.success(
              "Authentication verified. Redirecting to join network...",
            );
            navigate(`/join/${pendingInvite}`, { replace: true });
            return;
          } else {
            // User is already a member of a circle, discard the invite cleanly
            localStorage.removeItem("pendingInvite");
          }
        }

        // 3. Fallback standard redirect if no conditional overrides triggered
        toast.success("Access Granted. Welcome back to the SENTRY!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Authentication failed.");
      }
    } catch (err) {
      console.error("Login catch triggered: ", err);
      const errorMsg =
        err.response?.data?.message ||
        "Invalid credentials or network failure.";
      toast.error(errorMsg);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const cleanedPhone = String(phone || "").replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setError("Phone number must be exactly 10 digits.!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be of at least 6 chars.!");
      return;
    }
    if (isSignUp) {
      if (password != confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      handleSignUp(name, phone, password, confirmPassword);
    } else {
      handleLogin(phone, password);
    }
  };

  return (
    <main className="relative min-h-screen w-screen grid grid-cols-1 lg:grid-cols-12 bg-[#131313] text-[#e5e2e1] antialiased overflow-y-auto lg:overflow-hidden select-none [font-family:'Geist',sans-serif]">
      {/* Atmospheric Background Element */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/img/kobu-agency-o8ZesB0MLFo-unsplash.jpg')",
          }}
        ></div>
      </div>

      {/* ================= LEFT SIDE: BRANDING, LAYOUT PARAGRAPH & MOBILE TRIGGER ================= */}
      <div className="hidden lg:flex z-10 lg:col-span-5 flex-col justify-between p-6 md:p-12 border-r border-white/5 bg-[#0e0e0e]/40 backdrop-blur-md">
        {/* Center Descriptive Paragraph Block */}
        <div className="lg:my-auto space-y-6 max-w-md">
          <div className="w-16 h-16 bg-[#b0c6ff] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(176,198,255,0.3)]">
            <span className="material-symbols-outlined text-[#002d6e] text-[40px]">
              shield_person
            </span>
          </div>

          <h1 className="text-[48px] font-bold tracking-tighter text-[#b0c6ff] leading-[1.1]">
            SENTRY
          </h1>

          {/* Flex Container Layout: Paragraph Description + Dynamic Continue Button on the Right Edge */}
          <div className="flex flex-row items-center justify-between gap-4 lg:block lg:space-y-4">
            <div className="flex flex-col flex-1">
              <span className="text-[14px] font-medium text-[#c2c6d7] leading-[1.5]">
                Premium Family Protection & Real-time Security
              </span>
              <p className="text-[14px] text-[#8c90a0] leading-[1.5] mt-2 hidden sm:block">
                Keep your inner circle connected and secure. Monitor real-time
                endpoints, issue crypto-secured invites, and manage access
                privileges under strict 256-bit AES protection matrices.
              </p>
            </div>
          </div>
        </div>

        {/* Info Area Footer Status */}
        <div className="flex items-center gap-2 text-[12px] text-[#8c90a0]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.6)]"></span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: AUTHENTICATION INTERACTIVE FORM ================= */}
      <div className="z-10 col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12 lg:overflow-y-auto lg:h-full">
        <div className="w-full max-w-[440px] lg:my-auto auth-card perspective-1000">
          {/* Mobile Back/Return Navigation Anchor Link */}
          {/* <button
            type="button"
            onClick={() => setShowMobileForm(false)}
            className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-[#8c90a0] hover:text-[#e5e2e1] mb-5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to Overview
          </button> */}

          {/* Master Glass Panel Card Container */}
          <div className="backdrop-blur-[20px] bg-[#1e1e1e]/70 border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl">
            {/* Tab Navigation Switches */}
            <div className="flex bg-[#0e0e0e] rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-[12px] font-semibold tracking-wider rounded-md transition-all duration-300 ${
                  !isSignUp
                    ? "bg-[#00a572] text-[#00311f] shadow"
                    : "text-[#c2c6d7] hover:text-[#e5e2e1]"
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-[12px] font-semibold tracking-wider rounded-md transition-all duration-300 ${
                  isSignUp
                    ? "bg-[#00a572] text-[#00311f] shadow"
                    : "text-[#c2c6d7] hover:text-[#e5e2e1]"
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Authentication Action Forms Workspace */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Federated Social Identity Access Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-[#2a2a2a] py-2.5 rounded-lg hover:bg-[#393939] transition-colors border border-white/5 text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-base">
                    google
                  </span>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-[#2a2a2a] py-2.5 rounded-lg hover:bg-[#393939] transition-colors border border-white/5 text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-base">
                    apps
                  </span>
                  Apple
                </button>
              </div>

              {/* Styled Divider Segment */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] font-semibold tracking-widest text-[#8c90a0]">
                  OR PHONE
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-lg p-3.5 tracking-wide animate-pulse">
                  {error}
                </div>
              )}

              <div
                className={`grid transition-all duration-500 ease-out ${
                  isSignUp
                    ? "grid-rows-[1fr] opacity-100 mt-2 mb-2"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0 mb-0"
                }`}
              >
                <div className="overflow-hidden space-y-1.5">
                  <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
                    Name
                  </label>
                  <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
                    <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                      person
                    </span>
                    <input
                      required={isSignUp}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 focus:ring-0 text-[#e5e2e1] text-sm placeholder:text-[#8c90a0]/30 outline-none"
                      placeholder="Alex Mercer"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address Parameter Layout */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
                  Phone Number
                </label>
                <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
                  <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                    phone
                  </span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 focus:ring-0 text-[#e5e2e1] text-sm placeholder:text-[#8c90a0]/50 outline-none"
                    placeholder="123456XXXX"
                  />
                </div>
              </div>

              {/* Password Credentials Parameter Layout */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7]">
                    Password
                  </label>
                  {!isSignUp && (
                    <a
                      className="text-[10px] font-semibold text-[#b0c6ff] hover:underline transition-all"
                      href="#forgot"
                    >
                      FORGOT PASSWORD?
                    </a>
                  )}
                </div>
                <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
                  <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                    lock
                  </span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-12 focus:ring-0 text-[#e5e2e1] text-sm placeholder:text-[#8c90a0]/50 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#8c90a0] hover:text-[#e5e2e1] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Conditional Registration Section Wrapper Block */}
              <div
                className={`grid transition-all duration-500 ease-out ${
                  isSignUp
                    ? "grid-rows-[1fr] opacity-100 mt-4 mb-2"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0 mb-0"
                }`}
              >
                <div className="overflow-hidden space-y-4">
                  {/* 1. Confirm Password Field */}
                  <div className="space-y-1.5 transition-all duration-300 transform">
                    <label className="text-[12px] font-semibold tracking-wide text-[#c2c6d7] ml-1">
                      Confirm Password
                    </label>
                    <div className="relative bg-[#0e0e0e] rounded-lg border border-[#424654] flex items-center transition-all duration-200 focus-within:border-[#b0c6ff] focus-within:shadow-[0_0_15px_rgba(176,198,255,0.2)]">
                      <span className="material-symbols-outlined absolute left-4 text-[#8c90a0] text-lg">
                        gpp_good
                      </span>
                      <input
                        required={isSignUp}
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 focus:ring-0 text-[#e5e2e1] text-sm placeholder:text-[#8c90a0]/50 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Dynamic Core Submit Execution Action Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#b0c6ff] text-[#002d6e] rounded-xl font-bold text-base shadow-lg shadow-[#b0c6ff]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-4"
              >
                {isSignUp ? "Create Sanctuary" : "Access Vault"}
              </button>
            </form>
          </div>

          {/* Global Cryptographic Context Security Badge Label */}
          <p className="mt-6 text-center text-xs text-[#8c90a0]">
            Encryption Status:{" "}
            <span className="text-[#4edea3] font-bold">256-bit AES Active</span>
          </p>
        </div>
      </div>
    </main>
  );
}
