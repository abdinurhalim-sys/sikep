import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({
  isSidebarOpen,
  peraturansCount,
  faqsCount,
  suggestionsCount,
}) => {
  const location = useLocation();
  const { isAuthenticated, logout, user, isAdmin } = useAuth(); // Tambahkan isAdmin
  const [ripples, setRipples] = useState([]);

  // State untuk modal konfirmasi logout
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [logoutResult, setLogoutResult] = useState({
    success: false,
    message: "",
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fungsi untuk mengecek apakah link aktif
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fungsi untuk membuat efek ripple
  const addRipple = (e, path) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      path,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Hapus ripple setelah animasi selesai
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Animasi badge count
  const [animatedCounts, setAnimatedCounts] = useState({
    peraturans: 0,
    faqs: 0,
    suggestions: 0,
  });

  useEffect(() => {
    // Animasi counting up untuk badge
    const duration = 1000; // 1 detik
    const steps = 20;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedCounts({
        peraturans: Math.min(
          Math.floor((peraturansCount / steps) * step),
          peraturansCount
        ),
        faqs: Math.min(Math.floor((faqsCount / steps) * step), faqsCount),
        suggestions: Math.min(
          Math.floor((suggestionsCount / steps) * step),
          suggestionsCount
        ),
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedCounts({
          peraturans: peraturansCount,
          faqs: faqsCount,
          suggestions: suggestionsCount,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [peraturansCount, faqsCount, suggestionsCount]);

  // Fungsi untuk menangani logout
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmLogout = async () => {
    setShowConfirmModal(false);
    setIsLoggingOut(true);

    try {
      const result = await logout();
      if (result.success) {
        setLogoutResult({
          success: true,
          message:
            "Anda telah berhasil logout dari sistem. Anda akan diarahkan ke halaman dashboard dalam beberapa saat.",
        });
        setShowResultModal(true);

        // Tunggu 2 detik sebelum redirect
        setTimeout(() => {
          setShowResultModal(false);
          window.location.href = "/";
        }, 2000);
      } else {
        setLogoutResult({
          success: false,
          message: result.error || "Logout gagal. Silakan coba lagi.",
        });
        setShowResultModal(true);
      }
    } catch (error) {
      setLogoutResult({
        success: false,
        message: "Terjadi kesalahan saat logout. Silakan coba lagi.",
      });
      setShowResultModal(true);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setShowConfirmModal(false);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
  };

  return (
    <>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-all duration-500 ease-in-out bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        aria-label="Sidebar"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iIzA5ZSIvPgo8L3N2Zz4=')]" />
        </div>

        <div className="relative h-full px-4 pb-4 overflow-y-auto">
          <div className="mb-8 mt-4">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-cyan-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
              Menu Utama
            </h3>
          </div>

          <ul className="space-y-1">
            {[
              {
                path: "/",
                label: "Dashboard",
                icon: "M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002ZM12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z",
                count: null,
              },
              {
                path: "/peraturan",
                label: "Regulation",
                icon: "M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z",
                count: animatedCounts.peraturans,
              },
              {
                path: "/Fq",
                label: "FAQ",
                icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.45 9.45a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l9.45-9.45zM19.5 7.125L16.862 4.487M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
                count: animatedCounts.faqs,
              },
              {
                path: "/formPage",
                label: "Suggestion",
                icon: "m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z",
                count: animatedCounts.suggestions,
              },
              {
                path: "/tim",
                label: "Our Team",
                icon: "M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z",
                count: null,
              },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={(e) => addRipple(e, item.path)}
                  className={`relative flex items-center p-3 rounded-2xl transition-all duration-300 overflow-hidden group ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-cyan-50 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-[1.02]"
                  }`}
                >
                  {/* Efek Ripple */}
                  {ripples.map(
                    (ripple) =>
                      ripple.path === item.path && (
                        <span
                          key={ripple.id}
                          className="absolute block bg-white/30 rounded-full animate-ripple"
                          style={{
                            width: ripple.size,
                            height: ripple.size,
                            left: ripple.x,
                            top: ripple.y,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      )
                  )}

                  {/* Ikon dengan animasi */}
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-white/20 shadow-inner"
                        : "bg-cyan-100 dark:bg-gray-700 group-hover:bg-cyan-200 dark:group-hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive(item.path)
                          ? "text-white scale-110"
                          : "text-cyan-600 dark:text-cyan-400 group-hover:scale-110"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d={item.icon} />
                    </svg>
                  </div>

                  <span className="flex-1 ms-3 whitespace-nowrap font-medium transition-all duration-300">
                    {item.label}
                  </span>

                  {/* Badge Count */}
                  {item.count !== null && (
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                        isActive(item.path)
                          ? "bg-white/30 text-white shadow-inner"
                          : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}

                  {/* Indikator aktif */}
                  {isActive(item.path) && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-3/4 bg-white rounded-l-full shadow-lg"></div>
                  )}

                  {/* Efek glow untuk menu aktif */}
                  {isActive(item.path) && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-md -z-10"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Menu Admin - Hanya muncul jika user adalah admin */}
          {isAuthenticated && isAdmin && (
            <>
              {/* Garis Pemisah dengan animasi */}
              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-r from-cyan-500 to-blue-500 dark:bg-gray-800 text-gray-50 dark:text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-cyan-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Menu Administrator
                </h3>
              </div>

              <ul className="space-y-1">
                <li>
                  <Link
                    to="/admin/users"
                    onClick={(e) => addRipple(e, "/admin/users")}
                    className={`relative flex items-center p-3 rounded-2xl transition-all duration-300 overflow-hidden group ${
                      isActive("/admin/users")
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105"
                        : "text-gray-700 hover:bg-cyan-50 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-[1.02]"
                    }`}
                  >
                    {/* Efek Ripple */}
                    {ripples.map(
                      (ripple) =>
                        ripple.path === "/admin/users" && (
                          <span
                            key={ripple.id}
                            className="absolute block bg-white/30 rounded-full animate-ripple"
                            style={{
                              width: ripple.size,
                              height: ripple.size,
                              left: ripple.x,
                              top: ripple.y,
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        )
                    )}

                    {/* Ikon dengan animasi */}
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ${
                        isActive("/admin/users")
                          ? "bg-white/20 shadow-inner"
                          : "bg-cyan-100 dark:bg-gray-700 group-hover:bg-cyan-200 dark:group-hover:bg-gray-600"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive("/admin/users")
                            ? "text-white scale-110"
                            : "text-cyan-600 dark:text-cyan-400 group-hover:scale-110"
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                    </div>

                    <span className="flex-1 ms-3 whitespace-nowrap font-medium transition-all duration-300">
                      Manage Users
                    </span>

                    {/* Indikator aktif */}
                    {isActive("/admin/users") && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-3/4 bg-white rounded-l-full shadow-lg"></div>
                    )}

                    {/* Efek glow untuk menu aktif */}
                    {isActive("/admin/users") && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-md -z-10"></div>
                    )}
                  </Link>
                </li>
              </ul>
            </>
          )}

          {/* Garis Pemisah dengan animasi */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-r from-cyan-500 to-blue-500 dark:bg-gray-800 text-gray-50 dark:text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-cyan-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              Akun
            </h3>
          </div>

          <ul className="space-y-1">
            {/* Conditional rendering untuk menu Sign In/Sign Out */}
            {!isAuthenticated ? (
              <li>
                <Link
                  to="/login"
                  onClick={(e) => addRipple(e, "/login")}
                  className={`relative flex items-center p-3 rounded-2xl transition-all duration-300 overflow-hidden group ${
                    isActive("/login")
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-cyan-50 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-[1.02]"
                  }`}
                >
                  {/* Efek Ripple */}
                  {ripples.map(
                    (ripple) =>
                      ripple.path === "/login" && (
                        <span
                          key={ripple.id}
                          className="absolute block bg-white/30 rounded-full animate-ripple"
                          style={{
                            width: ripple.size,
                            height: ripple.size,
                            left: ripple.x,
                            top: ripple.y,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      )
                  )}

                  {/* Ikon dengan animasi */}
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ${
                      isActive("/login")
                        ? "bg-white/20 shadow-inner"
                        : "bg-cyan-100 dark:bg-gray-700 group-hover:bg-cyan-200 dark:group-hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive("/login")
                          ? "text-white scale-110"
                          : "text-cyan-600 dark:text-cyan-400 group-hover:scale-110"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 012 2v10a2 2 0 01-2 2h-3"
                      />
                    </svg>
                  </div>

                  <span className="flex-1 ms-3 whitespace-nowrap font-medium transition-all duration-300">
                    Sign In
                  </span>

                  {/* Indikator aktif */}
                  {isActive("/login") && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-3/4 bg-white rounded-l-full shadow-lg"></div>
                  )}

                  {/* Efek glow untuk menu aktif */}
                  {isActive("/login") && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-md -z-10"></div>
                  )}
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLogoutClick}
                  className={`relative flex items-center p-3 rounded-2xl transition-all duration-300 overflow-hidden group w-full text-left ${"text-gray-700 hover:bg-cyan-50 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-[1.02]"}`}
                  disabled={isLoggingOut}
                >
                  {/* Efek Ripple */}
                  {ripples.map(
                    (ripple) =>
                      ripple.path === "/logout" && (
                        <span
                          key={ripple.id}
                          className="absolute block bg-white/30 rounded-full animate-ripple"
                          style={{
                            width: ripple.size,
                            height: ripple.size,
                            left: ripple.x,
                            top: ripple.y,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      )
                  )}

                  {/* Ikon dengan animasi */}
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ${"bg-cyan-100 dark:bg-gray-700 group-hover:bg-cyan-200 dark:group-hover:bg-gray-600"}`}
                  >
                    {isLoggingOut ? (
                      <svg
                        className="animate-spin h-5 w-5 text-cyan-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0-4.418 4.03-8 9-8 4.418 0 8 3.582 8 8 0 1.042-.133 2.052-.382 3.016z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-4a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    )}
                  </div>

                  <span className="flex-1 ms-3 whitespace-nowrap font-medium transition-all duration-300">
                    {isLoggingOut ? "Logging out..." : "Sign Out"}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Custom CSS untuk animasi ripple */}
        <style>
          {`
          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(4);
              opacity: 0;
            }
          }
          .animate-ripple {
            animation: ripple 0.6s linear;
          }
        `}
        </style>
      </aside>

      {/* Modal Konfirmasi Logout */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-scale-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <svg
                  className="h-10 w-10 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">
                Konfirmasi Logout
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Apakah Anda yakin ingin logout dari sistem?
                </p>
              </div>
              <div className="mt-5 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={cancelLogout}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hasil Logout */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-scale-in">
            <div className="text-center">
              <div
                className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
                  logoutResult.success
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                <svg
                  className={`h-10 w-10 ${
                    logoutResult.success
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {logoutResult.success ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">
                {logoutResult.success ? "Logout Berhasil" : "Logout Gagal"}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {logoutResult.message}
                </p>
              </div>
              {logoutResult.success && (
                <div className="mt-5">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-2000 ease-out"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={closeResultModal}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                >
                  {logoutResult.success ? "Tunggu..." : "Tutup"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS untuk animasi modal */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
