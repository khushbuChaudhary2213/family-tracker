import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import removeMember from "../apiFuncs/removeMember";
import leaveFamilyApi from "../apiFuncs/leaveFamily";
import updateMemberPermissions from "../apiFuncs/updateMemberPermissions";

export default function Family() {
  const { user, activeFamily, initializeSession } = useAuth();

  const [confirmTarget, setConfirmTarget] = useState(null); // { id, name, action: "remove" | "leave" }
  const [accessTarget, setAccessTarget] = useState(null); // member object being edited
  const [selectedIds, setSelectedIds] = useState([]);
  const [busy, setBusy] = useState(false);

  // ================= EMPTY STATE =================
  if (!activeFamily) {
    return (
      <div className="w-full bg-background max-w-2xl mx-auto py-16 text-center space-y-4">
        <span className="material-symbols-outlined text-[#b0c6ff] text-5xl">
          diversity_1
        </span>
        <h3 className="text-xl font-bold text-white">
          No Active Family Circle
        </h3>
        <p className="text-sm text-[#8c90a0] max-w-md mx-auto">
          You haven't created or joined a family circle yet. Head back to the
          dashboard home to create one or join with an invite link.
        </p>
      </div>
    );
  }

  const members = activeFamily.members || [];
  const adminIds = new Set((activeFamily.admins || []).map((a) => a._id));
  const isCurrentUserAdmin = adminIds.has(user?._id);

  const getInviteLink = (code) => `${window.location.origin}/join/${code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getInviteLink(activeFamily.inviteCode));
    toast.success("Invitation link copied to clipboard!");
  };

  const refresh = async () => {
    await initializeSession(user);
  };

  // ================= REMOVE / LEAVE =================
  const openConfirm = (member) => {
    const isSelf = member._id === user?._id;
    // console.log(isSelf);
    setConfirmTarget({
      id: member._id,
      name: member.name,
      action: isSelf ? "leave" : "remove",
    });
    console.log(confirmTarget);
  };

  const handleConfirmedAction = async () => {
    if (!confirmTarget) return;
    setBusy(true);
    try {
      if (confirmTarget.action === "leave") {
        await leaveFamilyApi(activeFamily.familyId, confirmTarget.id);
        toast.success("You left the family circle.");
      } else {
        await removeMember(activeFamily.familyId, confirmTarget.id);
        toast.success(`${confirmTarget.name} was removed from the circle.`);
      }
      await refresh();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${confirmTarget.action} member.`,
      );
    } finally {
      setBusy(false);
      setConfirmTarget(null);
    }
  };

  // ================= LOCATION ACCESS =================
  const openAccessModal = (member) => {
    setAccessTarget(member);
    setSelectedIds(member.canViewLocationsOf || []);
  };

  const toggleSelected = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSaveAccess = async () => {
    if (!accessTarget) return;
    setBusy(true);
    try {
      await updateMemberPermissions(
        activeFamily.familyId,
        accessTarget._id,
        selectedIds,
      );
      toast.success(`Updated visibility permissions for ${accessTarget.name}.`);
      await refresh();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update permissions.",
      );
    } finally {
      setBusy(false);
      setAccessTarget(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in py-4">
      {/* ================= HEADER CARD ================= */}
      <div className="bg-[#1e1e1e]/80 border border-[#b0c6ff]/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_25px_rgba(176,198,255,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-[#8c90a0] uppercase mb-1">
            Family Circle
          </p>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {activeFamily.familyName}
          </h2>
          <p className="text-xs text-[#8c90a0] mt-1">
            {members.length} member{members.length !== 1 ? "s" : ""} ·{" "}
            {isCurrentUserAdmin ? "You are an admin" : "You are a member"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:items-end">
          <span className="text-[10px] font-bold tracking-widest text-[#b0c6ff] uppercase bg-[#b0c6ff]/10 px-2.5 py-1 rounded border border-[#b0c6ff]/20 self-start sm:self-end">
            Invite Active
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#b0c6ff] hover:bg-[#9cb6ff] text-[#002d6e] rounded-xl font-bold text-xs tracking-wide transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              content_copy
            </span>
            Copy Invite Link
          </button>
        </div>
      </div>

      {/* ================= MEMBERS LIST ================= */}
      <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Members
        </h3>

        <div className="flex flex-col gap-2.5">
          {members.map((member) => {
            const isSelf = member._id === user?._id;
            const isMemberAdmin = adminIds.has(member._id);

            return (
              <div
                key={member._id}
                className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#0e0e0e]/50 border border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#b0c6ff] text-[#002d6e] flex items-center justify-center font-bold text-sm shrink-0">
                    {member.name ? member.name[0].toUpperCase() : "S"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#e5e2e1] text-sm truncate">
                        {member.name}
                        {isSelf && (
                          <span className="text-[#8c90a0] font-normal">
                            {" "}
                            (You)
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
                          isMemberAdmin
                            ? "text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/20"
                            : "text-[#c2c6d7] bg-white/5 border-white/10"
                        }`}
                      >
                        {isMemberAdmin ? "Admin" : "Member"}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">
                      {member.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCurrentUserAdmin && !isSelf && (
                    <button
                      onClick={() => openAccessModal(member)}
                      title="Manage location access"
                      className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#b0c6ff] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                    </button>
                  )}

                  {(isSelf || (isCurrentUserAdmin && !isMemberAdmin)) && (
                    <button
                      onClick={() => openConfirm(member)}
                      title={isSelf ? "Leave family" : "Remove member"}
                      className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isSelf ? "logout" : "person_remove"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= REMOVE / LEAVE CONFIRM MODAL ================= */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="w-full max-w-sm bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400 text-2xl">
                warning
              </span>
              <h4 className="text-lg font-bold text-white">
                {confirmTarget.action === "leave"
                  ? "Leave Family Circle?"
                  : "Remove Member?"}
              </h4>
            </div>
            <p className="text-sm text-[#8c90a0]">
              {confirmTarget.action === "leave"
                ? "You will lose access to this circle's shared locations and permissions. This can't be undone."
                : `${confirmTarget.name} will be removed from the circle and lose all location access. This can't be undone.`}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmTarget(null)}
                disabled={busy}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedAction}
                disabled={busy}
                className="flex-1 py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {busy ? "Working..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LOCATION ACCESS MODAL ================= */}
      {accessTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="w-full max-w-sm bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h4 className="text-lg font-bold text-white">
                Location Access for {accessTarget.name}
              </h4>
              <p className="text-xs text-[#8c90a0] mt-1">
                Choose which members {accessTarget.name} is allowed to see the
                location of.
              </p>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {members
                .filter((m) => m._id !== accessTarget._id)
                .map((m) => (
                  <label
                    key={m._id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0e0e0e]/50 border border-white/5 cursor-pointer hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(m._id)}
                      onChange={() => toggleSelected(m._id)}
                      className="accent-[#b0c6ff]"
                    />
                    <span className="text-sm text-[#e5e2e1]">{m.name}</span>
                  </label>
                ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setAccessTarget(null)}
                disabled={busy}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAccess}
                disabled={busy}
                className="flex-1 py-2.5 bg-[#b0c6ff] hover:bg-[#9cb6ff] text-[#002d6e] rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
