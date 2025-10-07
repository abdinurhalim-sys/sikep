// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")); // Tambahkan state token
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [timeoutModal, setTimeoutModal] = useState(false);
  const [timeoutDuration] = useState(10 * 60 * 1000); // 10 menit dalam milidetik
  const [warningDuration] = useState(1 * 60 * 1000); // 1 menit warning sebelum timeout

  // Fungsi untuk memperbarui aktivitas terakhir
  const updateLastActivity = () => {
    setLastActivity(Date.now());
    setTimeoutWarning(false);
    setTimeoutModal(false);
    localStorage.setItem("lastActivity", Date.now().toString());
  };

  // Efek untuk memantau aktivitas pengguna
  useEffect(() => {
    const handleUserActivity = () => {
      updateLastActivity();
    };

    // Tambahkan event listener untuk aktivitas pengguna
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Bersihkan event listener saat komponen dilepas
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  // Efek untuk memeriksa timeout
  useEffect(() => {
    if (!currentUser || !lastActivity || timeoutModal) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      // Tampilkan warning 1 menit sebelum timeout
      if (
        timeSinceLastActivity >= timeoutDuration - warningDuration &&
        !timeoutWarning
      ) {
        setTimeoutWarning(true);
      }

      // Tampilkan modal saat timeout
      if (timeSinceLastActivity >= timeoutDuration && !timeoutModal) {
        setTimeoutModal(true);
      }
    }, 1000); // Periksa setiap detik

    return () => clearInterval(interval);
  }, [currentUser, lastActivity, timeoutWarning, timeoutModal]);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        // Periksa apakah sudah timeout
        const lastActivityData = localStorage.getItem("lastActivity");
        if (lastActivityData) {
          const lastActivityTime = parseInt(lastActivityData);
          const now = Date.now();
          const timeSinceLastActivity = now - lastActivityTime;

          if (timeSinceLastActivity >= timeoutDuration) {
            localStorage.removeItem("lastActivity");
            localStorage.removeItem("token"); // Hapus token juga
            setCurrentUser(null);
            setToken(null); // Reset token
            setLoading(false);
            return;
          }
        }

        // Periksa token di localStorage
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);

          // Set token ke default header axios
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;

          const response = await api.get("/auth/me");
          setCurrentUser(response.data);

          // Set last activity dari localStorage jika ada
          if (lastActivityData) {
            setLastActivity(parseInt(lastActivityData));
          } else {
            // Jika tidak ada, set ke waktu sekarang
            updateLastActivity();
          }
        }
      } catch (error) {
        // User is not logged in
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem("lastActivity");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });
      const { user, token } = response.data; // Pastikan backend mengirim token

      // Simpan token ke localStorage dan state
      localStorage.setItem("token", token);
      setToken(token);

      // Set token ke default header axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);

      // Set last activity saat login
      updateLastActivity();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
      setCurrentUser(null);
      setToken(null);
      setLastActivity(null);
      setTimeoutWarning(false);
      setTimeoutModal(false);
      localStorage.removeItem("lastActivity");
      localStorage.removeItem("token");

      // Hapus token dari default header axios
      delete api.defaults.headers.common["Authorization"];

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      // Tetap logout meskipun ada error
      setCurrentUser(null);
      setToken(null);
      setLastActivity(null);
      setTimeoutWarning(false);
      setTimeoutModal(false);
      localStorage.removeItem("lastActivity");
      localStorage.removeItem("token");

      // Hapus token dari default header axios
      delete api.defaults.headers.common["Authorization"];

      return {
        success: false,
        error: error.response?.data?.error || "Logout failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/api/register", userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  // Fungsi untuk menangani timeout setelah modal ditutup
  const handleTimeout = () => {
    logout();
    // Redirect ke halaman login
    window.location.href = "/login";
  };

  const value = {
    currentUser,
    token, // Tambahkan token ke context value
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
    timeoutWarning,
    timeoutModal,
    updateLastActivity,
    handleTimeout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
