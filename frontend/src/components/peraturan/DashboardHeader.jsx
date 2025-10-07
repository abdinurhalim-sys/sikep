import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import abdi from "../../assets/profile/abdi.png";
import logo from "../../assets/images/komodo.png";

const DashboardHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const [showDropdownUser, setShowDropdownUser] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fungsi untuk mendapatkan inisial dari nama
  const getInitials = (name) => {
    if (!name) return "U"; // Default "U" untuk User jika nama tidak ada

    const names = name.split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (
        names[0].charAt(0).toUpperCase() +
        names[names.length - 1].charAt(0).toUpperCase()
      );
    }
  };

  // Fungsi untuk mendapatkan warna berdasarkan inisial
  const getColorClass = (initial) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ];

    // Mendapatkan index berdasarkan karakter kode inisial
    const charCode = initial.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // State untuk modal konfirmasi logout
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // State untuk modal hasil logout
  const [showResultModal, setShowResultModal] = useState(false);
  const [logoutResult, setLogoutResult] = useState({
    success: false,
    message: "",
  });

  const handleLogoutClick = () => {
    setShowDropdownUser(false);
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

  // Mendapatkan inisial dan kelas warna
  const initials = getInitials(currentUser?.fullName);
  const colorClass = getColorClass(initials);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-600 transition-all duration-200 transform hover:scale-105"
                aria-expanded={isSidebarOpen}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="/" className="flex ms-2 md:me-24 group">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mr-3 shadow-lg transform transition-transform duration-300 group-hover:rotate-6">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                        SIKep
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Sistem Informasi Kepegawaian
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Gunakan isAuthenticated dari useAuth untuk conditional rendering */}
            {isAuthenticated ? (
              <div className="flex items-center">
                <div
                  className="flex items-center ms-3 relative"
                  ref={dropdownRef}
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowDropdownUser(!showDropdownUser)}
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-600 transition-all duration-200 hover:ring-2 hover:ring-cyan-300 dark:hover:ring-cyan-600"
                      aria-expanded="false"
                      data-dropdown-toggle="dropdown-user"
                    >
                      <span className="sr-only">Open user menu</span>
                      {currentUser?.profileImage ? (
                        <img
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-lg"
                          src={currentUser.profileImage}
                          alt={currentUser?.fullName}
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-lg flex items-center justify-center text-white font-bold ${colorClass}`}
                        >
                          {initials}
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Dropdown menu with animation */}
                  <div
                    className={`z-50 absolute right-0 top-12 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-xl dark:bg-gray-700 dark:divide-gray-600 w-56 transition-all duration-300 transform ${
                      showDropdownUser
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {currentUser?.fullName || "User"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {currentUser?.email || "user@example.com"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Role: {currentUser?.role || "user"}
                      </p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-200"
                          role="menuitem"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v-4a1 1 0 00-1-1h-3m-6 0a1 1 0 001 1v3m0 0h-1m-4 0a1 1 0 01-1-1v-3m-6 0h6m-6 0h6"
                            />
                          </svg>
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-200"
                          role="menuitem"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-.426-1.756-2.924-1.756-3.35 0zM12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-200"
                          role="menuitem"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0 8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Earnings
                        </a>
                      </li>
                      <li className="border-t border-gray-100 dark:border-gray-600 my-1"></li>
                      <li>
                        <button
                          onClick={handleLogoutClick}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors duration-200 rounded-b-lg"
                          role="menuitem"
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
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
                                  d="M4 12a8 8 0 018-0V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0 4.418 4.03 8 9 8 4.418 0 8-3.582 8-8 0-1.042-.133-2.052-.382-3.016z"
                                ></path>
                              </svg>
                              Logging out...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-4a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Sign out
                            </>
                          )}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              // Hanya tampilkan tombol Login jika belum login
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="relative inline-flex items-center px-5 py-2.5 overflow-hidden text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg group"
                >
                  <span className="relative z-10 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 18 16"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 012 2v10a2 2 0 01-2 2h-3"
                      />
                    </svg>
                    Sign in
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-cyan-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  <div className="absolute top-0 right-0 w-12 h-full bg-white opacity-20 transform skew-x-12 translate-x-full group-hover:-translate-x-12 transition-transform duration-700"></div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

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

export default DashboardHeader;
