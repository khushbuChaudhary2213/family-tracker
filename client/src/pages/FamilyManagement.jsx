import DashboardLayout from "../layouts/DashboardLayout";

export default function FamilyManagement() {
  return (
    <DashboardLayout>
      {/* Clean container utilizing Stitch's theme colors */}
      <div className="p-8 max-w-4xl mx-auto space-y-6 h-full overflow-y-auto custom-scrollbar">
        <h1 className="text-2xl font-bold text-on-surface">Manage Family</h1>

        {/* Example card mirroring the UI theme */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Invite Code Generation
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Share this crypto-secured token with family members to let them join
            your tracking ring.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value="6a3ebb64112c98f3f5"
              className="bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-2 text-sm text-secondary outline-none focus:border-primary"
            />
            <button className="bg-primary text-on-primary font-bold px-4 py-2 rounded-xl text-sm transition-all active:scale-95">
              Copy Code
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
