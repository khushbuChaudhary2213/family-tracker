import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen flex relative">
      {/* App Side Drawer Navigation */}
      <Sidebar />

      {/* Core App View Container (Shifts layout right on large desktops to give space for fixed Sidebar) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative w-full z-10">
        {/* Main Application Workspace Frame */}
        <div className="flex-1 w-full bg-[#161616] relative flex items-center justify-center p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
