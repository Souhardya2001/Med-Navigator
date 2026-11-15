import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  return isLoading ? (
    <div className="grid min-h-screen place-items-center text-ink">
      Loading MedNavigator…
    </div>
  ) : isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  return isLoading ? null : isAuthenticated ? (
    <Navigate to="/chat" replace />
  ) : (
    children
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
