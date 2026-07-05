import { useState } from "react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 💡 New State
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      // Client-side validation check for password mismatch
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log("Registering:", { email, password, agreeToTerms });
      // TODO: Call your registration backend API route here
    } else {
      console.log("Logging in:", { email, password });
      // TODO: Call your login backend API route here
    }
  };

  return (
    <main className="relative h-screen w-screen max-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-on-surface antialiased overflow-hidden">
      {/* Atmospheric Background Element */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8Vu1ivi8o5m86R4vA9xg8JWVB187A35RRmQHp_km55Mymvxd205AtN53tj_rKruBC7fP06tovIoTe_f3HkfgfUMZ2-LglHinHVNGfSWamr4v5OiCwliGe_VYv_pHCDuckRw06SfhY2jEToS_JsFB0C24ULYdJPt9RUegiHtN2WgRiWVs1PNcAvLH6HVmbJfNxZ1maz0Fr61W3_3fNp4oMugnoBJkQk-cPQKhHdiCNYkR-pRluN2Q7F917rmA5aadq8F9gTgYOxjsm')",
          }}
        ></div>
      </div>

      {/* ================= LEFT SIDE: BRANDING & DETAILS ================= */}
      <div className="z-10 lg:col-span-5 flex flex-col justify-between p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-surface-container-lowest/40 backdrop-blur-md">
        {/* Top Minimal Branding */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            shield
          </span>
          <span className="text-sm font-bold tracking-widest text-outline">
            SECURE NETWORK
          </span>
        </div>

        {/* Centerpiece Project Info */}
        <div className="my-auto space-y-4 max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(176,198,255,0.15)] border border-primary/20">
            <span className="material-symbols-outlined text-primary text-[40px]">
              shield_person
            </span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-primary lg:text-6xl">
            SENTRY
          </h1>
          <p className="text-lg text-on-surface font-medium leading-relaxed">
            Premium Family Protection & Real-time Security.
          </p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Keep your inner circle connected and secure. Monitor real-time
            locations by default as an administrator, issue crypto-secured
            invite tokens, and manage role-based permissions seamlessly.
          </p>
        </div>

        {/* Encryption Status Footer */}
        <div className="flex items-center gap-2 text-xs text-outline">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#4edea3]"></span>
          <span>
            Protocol Status:{" "}
            <span className="text-secondary font-bold">256-bit AES Active</span>
          </span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: AUTHENTICATION FORM ================= */}
      <div className="z-10 lg:col-span-7 flex items-center justify-center p-6 lg:p-12 overflow-y-auto custom-scrollbar h-full">
        <div className="w-full max-w-[420px] my-auto">
          {/* Main Glass Panel Card */}
          <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-2xl bg-surface-container/60 backdrop-blur-xl">
            {/* Tab Toggles */}
            <div className="flex bg-surface-container-lowest rounded-lg p-1 mb-5">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-xs font-semibold tracking-wider rounded-md transition-all duration-300 ${
                  !isSignUp
                    ? "bg-secondary-container text-on-secondary-container shadow"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-xs font-semibold tracking-wider rounded-md transition-all duration-300 ${
                  isSignUp
                    ? "bg-secondary-container text-on-secondary-container shadow"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Core Access Forms */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Social Oauth Providers */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-surface-container-high py-2 rounded-lg hover:bg-surface-bright transition-colors border border-white/5 text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-sm">
                    google
                  </span>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-surface-container-high py-2 rounded-lg hover:bg-surface-bright transition-colors border border-white/5 text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-sm">
                    apps
                  </span>
                  Apple
                </button>
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-3 text-[9px] font-bold tracking-widest text-outline">
                  OR EMAIL
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wider text-on-surface-variant ml-1">
                  Email Address
                </label>
                <div className="input-glow relative bg-surface-container-lowest rounded-lg border border-outline-variant flex items-center transition-all duration-200">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-sm">
                    mail
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none py-2.5 pl-10 pr-4 focus:ring-0 text-on-surface text-sm placeholder:text-outline/40 outline-none"
                    placeholder="family@sentry.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-semibold tracking-wider text-on-surface-variant">
                    Password
                  </label>
                  {!isSignUp && (
                    <a
                      className="text-[9px] font-semibold tracking-wider text-primary hover:underline transition-all"
                      href="#forgot"
                    >
                      FORGOT PASSWORD?
                    </a>
                  )}
                </div>
                <div className="input-glow relative bg-surface-container-lowest rounded-lg border border-outline-variant flex items-center transition-all duration-200">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-sm">
                    lock
                  </span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-none py-2.5 pl-10 pr-10 focus:ring-0 text-on-surface text-sm placeholder:text-outline/40 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-outline hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Signup Exclusive Fields Block (Confirm Password & Terms Checkbox) */}
              <div
                className={`space-y-4 transition-all duration-300 ${isSignUp ? "block opacity-100" : "hidden opacity-0"}`}
              >
                {/* 💡 New Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-on-surface-variant ml-1">
                    Confirm Password
                  </label>
                  <div className="input-glow relative bg-surface-container-lowest rounded-lg border border-outline-variant flex items-center transition-all duration-200">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-sm">
                      lock_reset
                    </span>
                    <input
                      required={isSignUp}
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent border-none py-2.5 pl-10 pr-4 focus:ring-0 text-on-surface text-sm placeholder:text-outline/40 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Privacy Policy Checkbox Container */}
                <div className="flex items-start gap-2.5 px-1">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    required={isSignUp}
                    className="mt-0.5 h-3.5 w-3.5 rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <p className="text-xs text-on-surface-variant leading-tight">
                    I agree to the{" "}
                    <a
                      className="text-secondary hover:underline"
                      href="#privacy"
                    >
                      Privacy Sanctuary Agreement
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Submission Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-md shadow-primary/10 hover:scale-[1.01] active:scale-95 transition-all duration-200 mt-2"
              >
                {isSignUp ? "Create Sanctuary" : "Access Vault"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
