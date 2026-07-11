import { useState } from "react";

export default function OnboardingCrossroads() {
  // Input fields state
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  // Loading/Feedback flags for async backend operations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Handler for POST /api/family/create (or your custom route)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!familyName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // API integration boilerplate setup
      // const res = await axios.post('/api/family/create', { name: familyName });
      // const { inviteCode, familyDoc } = res.data;
      console.log("Creating family:", familyName);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create family circle.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Handler for POST /api/family/join (or your custom route)
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // API integration join loop configuration
      // const res = await axios.post('/api/family/join', { inviteCode });
      console.log("Joining with code:", inviteCode);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid invitation token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Dynamic Error Messaging Alert Bar */}
      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Main Grid Wrapper for Side-By-Side Aspect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* CARD ROW 1: CREATE A FAMILY COMPONENT */}
        <div className="bg-[#0e0e0e]/60 border border-white/5 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#b0c6ff]/10 text-[#b0c6ff] rounded-xl flex items-center justify-center border border-[#b0c6ff]/20">
              <span className="material-symbols-outlined">add_moderator</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Create a Family Circle
              </h3>
              <p className="text-xs text-[#8c90a0] mt-1 leading-relaxed">
                Setup an encrypted admin node hub. You will generate a unique
                security access code to distribute to your family network.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8c90a0] uppercase tracking-wider">
                Circle Name
              </label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="e.g., The Smith Family"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#b0c6ff] disabled:opacity-50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#b0c6ff] hover:bg-[#9cb6ff] text-[#002d6e] rounded-xl font-bold text-sm tracking-wide transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 text-center"
            >
              {loading ? "Generating Hub..." : "Initialize Circle"}
            </button>
          </form>
        </div>

        {/* CARD ROW 2: JOIN A FAMILY COMPONENT */}
        <div className="bg-[#0e0e0e]/60 border border-white/5 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/5 text-[#c2c6d7] rounded-xl flex items-center justify-center border border-white/10">
              <span className="material-symbols-outlined">vpn_key</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Join Existing Circle
              </h3>
              <p className="text-xs text-[#8c90a0] mt-1 leading-relaxed">
                Enter the operational invite network key shared by your
                designated administrator to sync live updates instantly.
              </p>
            </div>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8c90a0] uppercase tracking-wider">
                Invitation Code
              </label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="SNT-XXXXXX"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white uppercase tracking-widest font-mono placeholder:text-[#52525b] focus:outline-none focus:border-[#b0c6ff] disabled:opacity-50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-sm tracking-wide transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 text-center"
            >
              {loading ? "Verifying..." : "Sync Encryption Key"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
