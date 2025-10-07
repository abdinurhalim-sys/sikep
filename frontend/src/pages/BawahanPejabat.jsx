import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const BawahanPejabat = () => {
  const { pejabatId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin, loading, isAuthenticated } = useAuth();
  const [pejabat, setPejabat] = useState(null);
  const [bawahanList, setBawahanList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Pengecekan autentikasi dan otorisasi
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (loading) {
          // Tunggu hingga status autentikasi selesai dimuat
          return;
        }

        if (!isAuthenticated || !currentUser) {
          // Jika tidak ada pengguna yang login, redirect ke halaman login
          navigate("/login");
          return;
        }

        if (!isAdmin) {
          // Jika bukan admin, redirect ke halaman dashboard
          navigate("/dashboard");
          return;
        }

        // Jika semua pengecekan lolos, set authLoading ke false
        setAuthLoading(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [currentUser, isAdmin, loading, isAuthenticated, navigate]);

  useEffect(() => {
    // Hanya ambil data jika autentikasi sudah selesai dicek dan pengguna adalah admin
    if (!authLoading && isAdmin && isAuthenticated) {
      const fetchPejabatData = async () => {
        try {
          // Bersihkan pejabatId dari karakter yang tidak diinginkan
          const cleanPejabatId = pejabatId.split(":")[0];

          // Validasi ID
          if (!cleanPejabatId || isNaN(cleanPejabatId)) {
            setError("ID pejabat tidak valid");
            setDataLoading(false);
            return;
          }

          // PERBAIKAN: Ambil data pejabat dari daftar pejabat yang sudah ada
          // karena endpoint untuk detail pejabat tidak tersedia
          const pejabatResponse = await api.get("/admin/pejabat-struktural");

          if (pejabatResponse.status === 200) {
            const allPejabat = pejabatResponse.data;
            const pejabatDetail = allPejabat.find(
              (p) => p.id.toString() === cleanPejabatId
            );

            if (pejabatDetail) {
              setPejabat(pejabatDetail);
            } else {
              // Data dummy jika tidak ditemukan
              setPejabat({
                id: cleanPejabatId,
                nama: "Pejabat",
                level_struktural: 1,
                jabatan: "Pejabat Struktural",
                is_plt: false,
              });
            }
          }

          // PERBAIKAN: Fetch semua bawahan dari seluruh hierarki, bukan hanya bawahan langsung
          const bawahanResponse = await api.get(
            `/admin/pejabat-struktural/${cleanPejabatId}/bawahan`
          );

          let bawahanData = [];
          if (bawahanResponse.status === 200) {
            bawahanData = bawahanResponse.data;
          }

          setBawahanList(bawahanData);
        } catch (err) {
          console.error("Error dalam fetchPejabatData:", err);
          setError(
            err.response?.data?.error || err.message || "Failed to fetch data"
          );
        } finally {
          setDataLoading(false);
        }
      };

      fetchPejabatData();
    }
  }, [pejabatId, authLoading, isAdmin, isAuthenticated]);

  const getLevelLabel = (level) => {
    switch (level) {
      case 1:
        return "Kepala Perwakilan";
      case 2:
        return "Kepala Bagian Umum";
      case 3:
        return "Koordinator Pengawas";
      case 4:
        return "Sub Koordinator Pengawas";
      case 5:
        return "Staff";
      default:
        return `Level ${level}`;
    }
  };

  // Tampilkan loading saat autentikasi sedang dicek
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memverifikasi hak akses...
          </p>
        </div>
      </div>
    );
  }

  // Tampilkan loading saat data sedang dimuat
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat data bawahan...
          </p>
        </div>
      </div>
    );
  }

  // Tampilkan pesan error jika ada
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Render komponen jika semua pengecekan lolos
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/pejabat-struktural"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Pejabat Struktural
          </Link>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {pejabat?.nama?.charAt(0) || "P"}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold mb-1">
                  Struktur Bawahan Lengkap dari {pejabat?.nama || "Pejabat"}
                </h1>
                <div className="flex items-center space-x-4">
                  {pejabat && (
                    <>
                      <span className="text-cyan-100">
                        {getLevelLabel(pejabat?.level_struktural)}
                      </span>
                      <span className="text-cyan-100">{pejabat?.jabatan}</span>
                      {pejabat?.is_plt && (
                        <span className="px-2 py-1 bg-white/20 rounded text-sm">
                          PLT. {pejabat?.plt_jabatan}
                        </span>
                      )}
                    </>
                  )}
                  {!pejabat && (
                    <span className="text-cyan-100">
                      ID Pejabat: {pejabatId.split(":")[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-cyan-600 dark:text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bawahanList.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Bawahan (Semua Level)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bawahanList.filter((b) => b.is_pejabat_struktural).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Pejabat Struktural
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bawahanList.filter((b) => !b.is_pejabat_struktural).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Pegawai Non-Struktural
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Bawahan */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Struktur Bawahan Lengkap
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Menampilkan semua bawahan dari semua tingkatan hierarki
            </p>
          </div>
          <div className="">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8"
                  >
                    Nama & Jabatan
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8"
                  >
                    Bidang
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {bawahanList.map((bawahan) => (
                  <tr
                    key={`${bawahan.id}-${bawahan.level || 0}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center">
                        <div
                          style={{ width: `${(bawahan.level || 0) * 24}px` }}
                          className="flex-shrink-0"
                        ></div>

                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                            <span className="text-cyan-800 dark:text-cyan-200 font-medium text-sm">
                              {bawahan.nama.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 text-left">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {bawahan.nama}
                            </div>
                            {bawahan.is_plt && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                                PLT
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {bawahan.jabatan}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {bawahan.bidang || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      {bawahan.is_pejabat_struktural ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                          Pejabat Struktural
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          Pegawai
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {bawahanList.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center mt-8">
            <div className="mx-auto h-24 w-24 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-cyan-600 dark:text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Tidak ada bawahan
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {pejabat?.nama || "Pejabat ini"} tidak memiliki bawahan saat ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BawahanPejabat;
