import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Map from "./components/Map.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Auth from "./pages/Auth.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";

import { Toaster } from "react-hot-toast";
import OnboardingCrossroads from "./pages/OnboardingCrossroads.jsx";

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
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e1e1e",
            color: "#e5e2e1",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: "16px",
            fontWeight: "500",
            padding: "16px 28px",
            maxWidth: "500px",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
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
          onSignOut={() => navigate("/")}
        />
      )}
      {/* ================= STATE 1: PUBLIC LANDING PAGE ================= */}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <div className="relative min-h-screen w-full">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none select-none">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('/img/kobu-agency-o8ZesB0MLFo-unsplash.jpg')",
                    }}
                  ></div>
                </div>
                <div className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 max-w-7xl mx-auto z-10">
                  <Hero onTriggerAuth={handleTriggerAuth} />
                  <Footer />
                </div>
              </div>
            </PublicRoute>
          }
        />

        {/* ================= STATE 2: AUTHENTICATION ROUTE ================= */}

        <Route
          path="/auth"
          element={
            <PublicRoute>
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
            </PublicRoute>
          }
        />

        {/* ================= STATE 3: MAIN DASHBOARD ROUTE ================= */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<OnboardingCrossroads />} />
          <Route path="map" element={<Map />} />
        </Route>
      </Routes>
    </div>
  );
}
