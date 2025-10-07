import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import Footer from "../components/Footer";

// Import components
import DashboardHeader from "../components/peraturan/DashboardHeader";
import Sidebar from "../components/Sidebar";

const ManageUsers = () => {
  // State untuk sidebar dan UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAdmin, isAuthenticated } = useAuth();

  // State untuk data users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk notifikasi
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // State untuk search dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // State untuk menyimpan jumlah item di sidebar
  const [sidebarCounts, setSidebarCounts] = useState({
    peraturans: 0,
    faqs: 0,
    suggestions: 0,
  });

  // Cek apakah user adalah admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setError("Anda tidak memiliki akses ke halaman ini");
      setLoading(false);
      return;
    }

    fetchUsers();
    fetchSidebarCounts();
  }, [isAdmin, isAuthenticated]);

  // Fungsi untuk mengambil data counts untuk sidebar
  const fetchSidebarCounts = async () => {
    try {
      const peraturanResponse = await api.get("/peraturan/count");
      const peraturansCount = peraturanResponse.data.count || 0;

      const faqResponse = await api.get("/faq");
      const faqsCount = faqResponse.data.data?.length || 0;

      const suggestionsResponse = await api.get("/suggestions");
      const suggestionsCount = suggestionsResponse.data.length || 0;

      setSidebarCounts({
        peraturans: peraturansCount,
        faqs: faqsCount,
        suggestions: suggestionsCount,
      });
    } catch (err) {
      console.error("Error fetching sidebar counts:", err);
    }
  };

  // Mengambil data users dari API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
      setCurrentPage(1); // Reset ke halaman pertama saat refresh data
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.error || "Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  // Filter users berdasarkan search term dan role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name &&
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Fungsi untuk ganti halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Fungsi untuk toggle role user
  const toggleUserRole = async (userId, currentRole) => {
    try {
      // Tentukan role baru (toggle antara admin dan user)
      const newRole = currentRole === "admin" ? "user" : "admin";

      // Optimistic update - update UI dulu sebelum response dari server
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      // Update ke API
      const response = await api.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      if (response.data.success) {
        // Tampilkan notifikasi sukses
        const user = users.find((u) => u.id === userId);
        setNotification({
          show: true,
          type: "success",
          message: `Role ${
            user?.username || "pengguna"
          } berhasil diubah menjadi ${newRole}`,
        });

        // Sembunyikan notifikasi setelah 3 detik
        setTimeout(() => {
          setNotification({ show: false, type: "", message: "" });
        }, 3000);
      } else {
        // Rollback jika gagal
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: currentRole } : user
          )
        );
        setNotification({
          show: true,
          type: "error",
          message: response.data.message || "Gagal mengubah role pengguna",
        });
        setTimeout(() => {
          setNotification({ show: false, type: "", message: "" });
        }, 3000);
      }
    } catch (err) {
      console.error("Error updating user role:", err);

      // Rollback jika error
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: currentRole } : user
        )
      );

      let errorMessage = "Gagal mengubah role pengguna";

      if (err.response) {
        errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else {
        errorMessage = err.message || "Terjadi kesalahan tidak diketahui";
      }

      setNotification({
        show: true,
        type: "error",
        message: errorMessage,
      });
      setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
    }
  };

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Menutup sidebar saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebar = document.getElementById("logo-sidebar");
      const toggleButton = document.querySelector(
        '[data-drawer-toggle="logo-sidebar"]'
      );
      if (
        isSidebarOpen &&
        sidebar &&
        !sidebar.contains(e.target) &&
        !toggleButton.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Menghitung statistik role
  const getRoleStats = () => {
    const roleCount = {};
    let total = 0;

    users.forEach((user) => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
      total++;
    });

    return Object.entries(roleCount).map(([role, jumlah]) => ({
      role,
      jumlah,
      persentase: total > 0 ? Math.round((jumlah / total) * 100) : 0,
    }));
  };

  if (loading) {
    return (
      <>
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          peraturansCount={sidebarCounts.peraturans}
          faqsCount={sidebarCounts.faqs}
          suggestionsCount={sidebarCounts.suggestions}
        />

        <div className="p-4 md:ml-64">
          <div className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Memuat data pengguna...
                </p>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          peraturansCount={sidebarCounts.peraturans}
          faqsCount={sidebarCounts.faqs}
          suggestionsCount={sidebarCounts.suggestions}
        />

        <div className="p-4 md:ml-64">
          <div className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Terjadi Kesalahan
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  const roleStats = getRoleStats();

  return (
    <>
      <DashboardHeader
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        peraturansCount={sidebarCounts.peraturans}
        faqsCount={sidebarCounts.faqs}
        suggestionsCount={sidebarCounts.suggestions}
      />

      <div className="p-4 md:ml-64">
        <div className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19">
          {/* Header dengan efek gradient */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Manage Users
                </h1>
                <p className="text-cyan-100">
                  Kelola pengguna dan role akses sistem
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={fetchUsers}
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300"
                >
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Statistik Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Pengguna
                  </h2>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.length}
                  </p>
                </div>
              </div>
            </div>

            {roleStats.map((stat) => (
              <div
                key={stat.role}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full p-3 ${
                      stat.role === "admin"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "bg-green-100 dark:bg-green-900/30"
                    }`}
                  >
                    <svg
                      className={`h-6 w-6 ${
                        stat.role === "admin"
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {stat.role}
                    </h2>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.jumlah}{" "}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({stat.persentase}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notifikasi */}
          {notification.show && (
            <div
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
                notification.show
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              } ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {notification.type === "success" ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {notification.type === "success" ? "Berhasil!" : "Gagal!"}
                  </p>
                  <p className="text-sm">{notification.message}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() =>
                        setNotification({ show: false, type: "", message: "" })
                      }
                      className={`inline-flex rounded-md p-1.5 ${
                        notification.type === "success"
                          ? "text-green-500 hover:bg-green-100"
                          : "text-red-500 hover:bg-red-100"
                      } focus:outline-none focus:ring-2 ${
                        notification.type === "success"
                          ? "focus:ring-green-500"
                          : "focus:ring-red-500"
                      }`}
                    >
                      <span className="sr-only">Tutup</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search dan Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Cari berdasarkan username, email, atau nama..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset ke halaman pertama saat search
                    }}
                  />
                </div>

                <div className="w-full md:w-48">
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setCurrentPage(1); // Reset ke halaman pertama saat filter
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md"
                  >
                    <option value="">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan {currentUsers.length} dari {filteredUsers.length}{" "}
                pengguna
              </div>
            </div>
          </div>

          {/* Tabel Data Users */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Pengguna
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                <span className="text-cyan-800 dark:text-cyan-200 font-medium">
                                  {user.full_name
                                    ? user.full_name.charAt(0)
                                    : user.username.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.full_name || "-"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* Toggle Switch untuk Role */}
                          <div className="inline-flex items-center">
                            <span className="mr-2 text-xs text-gray-500 dark:text-gray-400">
                              User
                            </span>
                            <button
                              onClick={() => toggleUserRole(user.id, user.role)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                                user.role === "admin"
                                  ? "bg-purple-600"
                                  : "bg-gray-200"
                              }`}
                              role="switch"
                              aria-checked={user.role === "admin"}
                            >
                              <span
                                className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  user.role === "admin"
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              >
                                <span
                                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                    user.role === "admin"
                                      ? "opacity-0 ease-out duration-100"
                                      : "opacity-100 ease-in duration-200"
                                  }`}
                                  aria-hidden="true"
                                >
                                  <svg
                                    className="h-3 w-3 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 12 12"
                                  >
                                    <path
                                      d="M4 8l2-2m0 0l2-2m-2 2l2 2m-2-2l-2 2"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                                <span
                                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                    user.role === "admin"
                                      ? "opacity-100 ease-in duration-200"
                                      : "opacity-0 ease-out duration-100"
                                  }`}
                                  aria-hidden="true"
                                >
                                  <svg
                                    className="h-3 w-3 text-purple-600"
                                    fill="currentColor"
                                    viewBox="0 0 12 12"
                                  >
                                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-4.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                  </svg>
                                </span>
                              </span>
                            </button>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              Admin
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada pengguna yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > usersPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Menampilkan{" "}
                    <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                    hingga{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredUsers.length)}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium">{filteredUsers.length}</span>{" "}
                    hasil
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-cyan-50 border-cyan-500 text-cyan-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
