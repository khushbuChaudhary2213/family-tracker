import { useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";
import Auth from "./pages/Auth.jsx";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Map from "./components/Map.jsx";

import { Toaster } from "react-hot-toast";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const showHeader = location.pathname != "/auth";

  const appState = location.pathname.split("/")[1];
  console.log(location.pathname.split("/")[1]);
  // const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'

  const handleTriggerAuth = (mode) => {
    navigate("/auth", { state: { initialMode: mode } });
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased [font-family:'Geist',sans-serif] relative overflow-x-hidden selection:bg-[#b0c6ff]/30">
      {/* // For PopUps */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1e1e",
            color: "#e5e2e1",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#00a572",
              secondary: "#1e1e1e",
            },
          },
        }}
      />
      {showHeader && (
        <Header
          activeTab={appState}
          onTriggerAuth={handleTriggerAuth}
          onSignOut={() => navigate("/landing")}
        />
      )}
      {/* ================= STATE 1: PUBLIC LANDING PAGE ================= */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 max-w-7xl mx-auto z-10">
              <Hero onTriggerAuth={handleTriggerAuth} />
              <Footer />
            </div>
          }
        />

        {/* ================= STATE 2: AUTHENTICATION INNER GATEWAY ================= */}
        <Route
          path="/auth"
          element={
            <div className="animate-fade-in relative z-10">
              {/* Note: Pass authMode as prop down to form state if your Auth card needs it, 
              and handle simulated success using standard callback events */}
              <Auth
                initialMode={"login"}
                onBackToLanding={() => navigate("/")}
                onAuthSuccess={() => navigate("/dashboard")}
              />

              <button
                onClick={() => navigate("/dashboard")}
                className="fixed bottom-4 right-4 bg-[#00a572] text-xs font-bold text-black px-3 py-2 rounded-md opacity-30 hover:opacity-100 z-50 transition-opacity"
              >
                Dev Bypass to Dashboard →
              </button>
            </div>
          }
        />

        {/* ================= STATE 3: INTERACTIVE PROTECTED HUB ================= */}

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Map />} />
        </Route>
      </Routes>
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none">
        <div
          className="w-full h-full bg-cover bg-center mix-blend-luminosity"
          style={{
            backgroundImage: "url('/img/kobu-agency-o8ZesB0MLFo-unsplash.jpg')",
          }}
        ></div>
      </div>
    </div>
  );
}
