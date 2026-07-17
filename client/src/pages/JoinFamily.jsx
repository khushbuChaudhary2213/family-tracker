import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import joinFamily from "../apiFuncs/joinFamily";

export default function JoinFamily() {
  const { inviteCode } = useParams();
  const { user, initializeSession, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  const hasTriggered = useRef(false);

  const userId = user?._id;
  const familyId = user?.familyId || user?.family?._id;

  useEffect(() => {
    // 1. CRITICAL: Give the AuthContext up to 300ms to mount and inject user data
    // before asserting that the user is completely logged out.
    if (loading) return;

    let isMounted = true;

    // Shared handler when a user is verified as an active member
    const handleAlreadyMember = () => {
      if (!isMounted) return;
      setStatus("syncing");
      toast.success(
        "You are already A Member of this Family! Welcome back! Entering family space...",
      );
      localStorage.removeItem("pendingInvite");
      navigate("/dashboard", { replace: true });
    };

    // Delay evaluation by one frame to prevent React Context batching racing issues
    const evaluationTimer = setTimeout(() => {
      if (!isMounted) return;

      // 2. Verified Guest Profile (Truly Unauthenticated)
      if (!user && !userId) {
        localStorage.setItem("pendingInvite", inviteCode);
        toast.error("Please log in or sign up to join this family circle.");
        navigate("/auth", { replace: true });
        return;
      }

      // 3. User is Logged In & Already Part of a Family Circle (Early Client-side Catch)
      if (familyId) {
        handleAlreadyMember();
        return;
      }

      // 4. Strict Mode Concurrency Protection Lock
      if (hasTriggered.current) return;
      hasTriggered.current = true;

      // 5. User Logged In & New User Joining a Family (Network Sync)
      const executeAutoJoin = async () => {
        try {
          console.log("Dispatching join network request...");
          const res = await joinFamily(inviteCode);

          if (
            res &&
            res.success === false &&
            res.message?.toLowerCase().includes("already a member")
          ) {
            handleAlreadyMember();
            return;
          }

          if (!isMounted) return;

          const familyData =
            res?.data?.joinedFamily || res?.data?.family || res?.family;
          toast.success("Successfully joined the family circle!");

          await initializeSession(user);

          localStorage.removeItem("pendingInvite");
          navigate("/dashboard", { replace: true });
        } catch (err) {
          if (!isMounted) return;

          console.error("Caught error within component boundary:", err);

          // Parse backend custom ErrorHandler json instance {"success":false,"message":"..."}
          const serverMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.response?.data ||
            err.message ||
            "";

          const normalizedMsg =
            typeof serverMessage === "string"
              ? serverMessage.toLowerCase()
              : "";

          // Catch backend status 400 rejection for active family node
          if (
            normalizedMsg.includes("already a member") ||
            normalizedMsg.includes("already member") ||
            normalizedMsg.includes("member of this family")
          ) {
            handleAlreadyMember();
          } else {
            hasTriggered.current = false;
            setStatus("error");
            toast.error(
              typeof serverMessage === "string"
                ? serverMessage
                : "Invalid or expired invitation link.",
            );
          }
        }
      };

      executeAutoJoin();
    }, 150); // Safe delay buffer for context dehydration

    return () => {
      isMounted = false;
      clearTimeout(evaluationTimer);
    };
  }, [inviteCode, user, userId, familyId, loading, navigate]);

  // View States Render Tree
  if (loading || status === "verifying") {
    return (
      <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <span className="material-symbols-outlined text-[#b0c6ff] text-5xl mb-4 animate-spin">
          sync
        </span>
        <h2 className="text-lg font-bold tracking-wide">
          Verifying Identity...
        </h2>
        <p className="text-xs text-[#8c90a0] mt-1">
          Decrypting secure invite credentials and verifying token status.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <span className="material-symbols-outlined text-red-400 text-5xl mb-4">
          gpp_bad
        </span>
        <h2 className="text-xl font-bold mb-2">Link Synchronization Failed</h2>
        <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
          The token provided might be invalid, altered, or expired. Request a
          new link from your circle administrator.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
        >
          Return to Hub Home
        </button>
      </div>
    );
  }

  if (status === "syncing") {
    return (
      <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <span className="material-symbols-outlined text-emerald-400 text-5xl mb-4 animate-pulse">
          verified_user
        </span>
        <h2 className="text-lg font-bold tracking-wide">Access Granted</h2>
        <p className="text-xs text-[#8c90a0] mt-1">
          Synchronizing workspace node. Redirecting to workspace view maps...
        </p>
      </div>
    );
  }

  return null;
}
