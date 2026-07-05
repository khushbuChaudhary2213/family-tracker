export default function DashboardLayout({ children }) {
  return (
    <div className="bg-background text-on-surface antialiased min-h-screen">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface/70 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-6">
          <span className="text-3xl font-bold tracking-tighter text-primary">
            SENTRY
          </span>
        </div>
      </header>

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex flex-col h-full fixed left-0 top-0 p-6 w-64 bg-surface-container border-r border-white/5 shadow-2xl z-40 mt-16">
        <nav className="flex flex-col gap-2 grow">
          <div className="text-secondary bg-white/5 rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="relative h-screen w-full lg:pl-64 pt-16 overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
