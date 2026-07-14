import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();

  // Extra safety fallback: If no user managed to slip past the guard, boot them out
  if (!user) return <Navigate to="/auth" replace />;
  return (
    <div className="min-h-screen flex relative bg-[#131313]">
      {/* App Side Drawer Navigation */}
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative w-full z-10 bg-[#161616] overflow-hidden">
        {/* Main Application Workspace Frame */}

        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none select-none mix-blend-luminosity">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/img/Dashboard background.jpg')",
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full flex-1 flex items-center justify-center p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
