import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"; // Ensure this import is here
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";
import { Loader } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen bg-[#1c1631]">
      <Loader className="size-10 animate-spin text-violet-500" />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      {/* Agar niche SignUpPage wali line hai, toh use delete kar dein ya LoginPage se replace karein */}
      <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;