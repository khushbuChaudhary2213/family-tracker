import Auth from "./pages/Auth";

export default function App() {
  // // 1. Manage which view is active ('dashboard' or 'family')
  // const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="w-screen h-screen bg-background text-on-surface antialiased overflow-hidden flex flex-col">
      <Auth />
    </div>
  );
}
