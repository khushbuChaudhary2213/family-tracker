import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isMapRoute = location.pathname.startsWith("/dashboard/map");

  if (!user) return <Navigate to="/auth" replace />;
  return (
    <div className="min-h-screen flex relative bg-[#131313]">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative w-full z-10 bg-[#161616] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none select-none mix-blend-luminosity">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/img/Dashboard background.jpg')" }}
          ></div>
        </div>

        <div
          className={`relative z-10 w-full flex-1 flex ${
            isMapRoute
              ? "pt-32 pb-16 lg:pt-16 lg:pb-0"
              : "items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-24 lg:pb-8"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
