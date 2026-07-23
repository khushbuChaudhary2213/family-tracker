import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import "leaflet/dist/leaflet.css";
import { LocationProvider } from "./context/LocationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <App />
          {/* <AppCopy /> */}
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  </StrictMode>,
);
