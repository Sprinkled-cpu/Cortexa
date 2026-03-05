import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLayout from "./components/PageLayout";
import ClickSpark from "./components/ClickSpark";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SkillInput from "./pages/SkillInput";
import AIAnalysis from "./pages/AIAnalysis";
import Roadmap from "./pages/Roadmap";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <PageLayout>
      <ClickSpark sparkColor="#a78bfa" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Landing />}
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillInput />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <AIAnalysis />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/landing"
            element={<Landing />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />

          <Route path="*" element={<Navigate to={user ? "/" : "/landing"} replace />} />
        </Routes>
      </ClickSpark>
    </PageLayout>
  );
}
