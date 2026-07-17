import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import createFamily from "../apiFuncs/createFamily";
// import joinFamily from "../apiFuncs/joinFamily";

export default function OnboardingCrossroads() {
  const { user, initializeSession } = useAuth();
  // Input fields state
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentFamily =
    user?.family?.family !== undefined ? user.family.family : user.family;
  // console.log(currentFamily);

  const familyAdmins = currentFamily?.admins || [];

  const isCircleAdmin =
    familyAdmins?.some((admin) => admin._id === user?._id) || false;

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
      const newFamily = res?.data?.family;

      if (newFamily) {
        // console.log(res);
        toast.success(`${newFamily.familyName} created successfully!`);

        // setUser((prevUser) => ({
        //   ...prevUser,
        //   family: newFamily,
        // }));
        await initializeSession(user);
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

      {/* Main Grid Wrapper for Side-By-Side Aspect */}
      <div className="grid grid-cols-2 gap-4 items-stretch">
        {/* {currentFamily == null && ( */}
        <div className="flex flex-col w-full justify-between bg-[#1e1e1e]/80 border border-[#b0c6ff]/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_25px_rgba(176,198,255,0.05)]">
          <div className="flex flex-col items-start gap-4">
            <div className="w-10 h-10 bg-[#b0c6ff]/10 text-[#b0c6ff] rounded-lg flex items-center justify-center border border-[#b0c6ff]/20 shrink-0">
              <span className="material-symbols-outlined">add_moderator</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                Create a Family Circle
              </h4>
              <p className="text-sm text-[#8c90a0] leading-relaxed">
                Setup an encrypted admin hub. You will generate a unique
                security access code to distribute to your family network.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-col gap-4 items-stretch mt-6"
          >
            <div className="space-y-1.5">
              {/* <label className="text-[10px] font-bold text-[#8c90a0] uppercase tracking-wider pl-1">
                Circle Name
              </label> */}
              <div className="bg-[#0c0c0e] border border-white/5 rounded-xl transition-all focus-within:border-[#b0c6ff]/30">
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="e.g., The Smith Family"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full py-3 px-4 bg-transparent text-sm text-white placeholder:text-[#52525b] focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-4 bg-[#b0c6ff] hover:bg-[#9cb6ff] text-[#002d6e] rounded-xl font-bold text-xs tracking-wide transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              {loading ? "Generating Hub..." : "Initialize Circle"}
            </button>
          </form>
        </div>

        {currentFamily != null && (
          <div className="flex flex-col justify-between w-full bg-[#1e1e1e]/80 border border-[#b0c6ff]/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_25px_rgba(176,198,255,0.05)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {/* Icon Box Container */}
                <div className="w-10 h-10 bg-[#b0c6ff]/10 text-[#b0c6ff] rounded-lg flex items-center justify-center border border-[#b0c6ff]/20 shrink-0">
                  <span className="material-symbols-outlined">
                    share_reviews
                  </span>
                </div>
                {/* Typography Label */}
                <p className="text-md font-semibold text-white tracking-wide">
                  Family Name :{" "}
                  <span className="text-[#b0c6ff] font-bold">
                    {currentFamily.familyName}
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                  Invite Your Members
                </h4>
                <p className="text-sm text-[#8c90a0] leading-relaxed">
                  Send this secure invitation link to your family members. When
                  they click it, they will automatically join{" "}
                  <strong>{currentFamily.familyName}</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-stretch mt-6">
              <div className=" bg-[#0c0c0e] border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between gap-4">
                <span className="text-xs font-mono text-zinc-400 truncate select-all">
                  {getInviteLink(currentFamily.inviteCode)}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#b0c6ff] uppercase bg-[#b0c6ff]/10 px-2.5 py-1 rounded border border-[#b0c6ff]/20 shrink-0">
                  Active Link
                </span>
              </div>
              <button
                onClick={() => handleCopyLink(currentFamily.inviteCode)}
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
        {/* {currentFamily != null && !isCircleAdmin && (
          <div className="bg-[#0e0e0e]/40 border border-white/5 rounded-2xl p-8 text-center text-[#babfd4] text-sm tracking-wide">
            Connected to {currentFamily.familyName} network mesh as a protected
            endnode.
          </div>
        )} */}
      </div>
      {/* )} */}
    </div>
  );
}
