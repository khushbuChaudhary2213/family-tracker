import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import createFamily from "../apiFuncs/createFamily";
import joinFamily from "../apiFuncs/joinFamily";

export default function OnboardingCrossroads() {
  const { user } = useAuth();
  // Input fields state
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [createdFamily, setCreatedFamily] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getInviteLink = (code) => {
    return `${window.location.origin}/join/${code}`;
  };

  const handleCopyLink = (code) => {
    const link = getInviteLink(code);
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard!");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!familyName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await createFamily(familyName);
      const familyData = res?.data?.family;

      if (familyData) {
        // console.log(res);
        setCreatedFamily(familyData);
        toast.success(`${familyName} created successfully!`);
        setFamilyName("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create family circle.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await joinFamily(inviteCode.trim());
      if (res && res.success) {
        toast.success("Successfully joined the family circle!");
        console.log(res);
        setInviteCode("");
        console.log("Joining with code:", inviteCode);
      }
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
      {/* ================= SUCCESS LINK DISPLAY CARD ================= */}
      {createdFamily && (
        <div className="w-full bg-[#1e1e1e]/80 border border-[#b0c6ff]/20 rounded-2xl p-6 backdrop-blur-md space-y-4 shadow-[0_0_25px_rgba(176,198,255,0.05)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#b0c6ff]/10 text-[#b0c6ff] rounded-lg flex items-center justify-center border border-[#b0c6ff]/20 shrink-0">
              <span className="material-symbols-outlined">share_reviews</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Invite Your Members
              </h4>
              <p className="text-xs text-[#8c90a0] leading-relaxed">
                Send this secure invitation link to your family members. When
                they click it, they will automatically join{" "}
                <strong>{createdFamily.familyName}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1 bg-[#0c0c0e] border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-zinc-400 truncate select-all">
                {getInviteLink(createdFamily.inviteCode)}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#b0c6ff] uppercase bg-[#b0c6ff]/10 px-2.5 py-1 rounded border border-[#b0c6ff]/20 shrink-0">
                Active Link
              </span>
            </div>
            <button
              onClick={() => handleCopyLink(createdFamily.inviteCode)}
              className="px-6 py-3 bg-[#b0c6ff] hover:bg-[#9cb6ff] text-[#002d6e] rounded-xl font-bold text-xs tracking-wide transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                content_copy
              </span>
              Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Wrapper for Side-By-Side Aspect */}
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
    </div>
  );
}
