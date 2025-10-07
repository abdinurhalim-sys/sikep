import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Peraturan from "./pages/Peraturan";
import Fq from "./pages/Fq";
import FormPage from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import Tim from "./pages/Tim";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PejabatStruktural from "./pages/PajabatStruktural";
import BawahanPejabat from "./pages/BawahanPejabat";
import TimeoutWarning from "./components/TimeoutWarning";
import TimeoutModal from "./components/Modal/TimeoutModal";
// Tambahkan import untuk ManageUsers
import ManageUsers from "./pages/ManageUsers";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <TimeoutWarning />
          <TimeoutModal />
          <Routes>
            {/* Halaman publik (bisa diakses tanpa login) */}
            <Route path="/login" element={<Login />} />

            {/* Halaman yang memerlukan login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/peraturan"
              element={
                <ProtectedRoute>
                  <Peraturan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fq"
              element={
                <ProtectedRoute>
                  <Fq />
                </ProtectedRoute>
              }
            />
            <Route
              path="/formPage"
              element={
                <ProtectedRoute>
                  <FormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tim"
              element={
                <ProtectedRoute>
                  <Tim />
                </ProtectedRoute>
              }
            />

            {/* Halaman yang hanya bisa diakses oleh admin */}
            <Route
              path="/register"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Register />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/pejabat-struktural"
              element={
                <ProtectedRoute adminOnly={true}>
                  <PejabatStruktural />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pejabat-struktural/:pejabatId/bawahan"
              element={
                <ProtectedRoute adminOnly={true}>
                  <BawahanPejabat />
                </ProtectedRoute>
              }
            />
            {/* Tambahkan route untuk Manage Users */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            {/* Redirect ke dashboard jika sudah login, atau ke login jika belum login */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
