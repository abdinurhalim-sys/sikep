import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const EmployeeManagers = () => {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPegawai, setCurrentPegawai] = useState(null);
  const [selectedAtasan, setSelectedAtasan] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [ripples, setRipples] = useState([]);

  // Mengambil data pegawai dari API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/employees");
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setPegawaiList(data);
        setFilteredData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fungsi untuk membuat efek ripple
  const addRipple = (e, callback) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Hapus ripple setelah animasi selesai
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    // Eksekusi callback
    if (callback) callback();
  };

  // Fungsi untuk membuka modal ubah atasan
  const handleUbahAtasan = (pegawai) => {
    setCurrentPegawai(pegawai);
    setSelectedAtasan(pegawai.atasan_langsung_id?.toString() || "");
    setShowModal(true);
  };

  // Fungsi untuk menyimpan perubahan atasan
  const handleSimpanAtasan = async () => {
    if (!currentPegawai) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/employees/${currentPegawai.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...currentPegawai,
            atasan_langsung_id: selectedAtasan
              ? parseInt(selectedAtasan)
              : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      // Refresh data setelah update
      const updatedResponse = await fetch(
        "http://localhost:8080/api/employees"
      );
      const updatedData = await updatedResponse.json();
      setPegawaiList(updatedData);
      setFilteredData(updatedData);

      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fungsi untuk filter hanya pegawai yang memiliki atasan
  const filterWithManager = () => {
    const withManager = pegawaiList.filter(
      (pegawai) => pegawai.atasan_langsung_id !== null
    );
    setFilteredData(withManager);
  };

  // Fungsi untuk filter pegawai tanpa atasan
  const filterWithoutManager = () => {
    const withoutManager = pegawaiList.filter(
      (pegawai) => pegawai.atasan_langsung_id === null
    );
    setFilteredData(withoutManager);
  };

  // Fungsi untuk tampilkan semua data
  const tampilkanSemua = () => {
    setFilteredData(pegawaiList);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat data pegawai...
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan efek gradient */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Hubungan Atasan-Bawahan
              </h1>
              <p className="text-cyan-100">
                Kelola struktur organisasi dan hubungan atasan-bawahan
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={(e) => addRipple(e, tampilkanSemua)}
                className="relative overflow-hidden px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-all duration-300 flex items-center"
              >
                {ripples.map(
                  (ripple) =>
                    ripple.id === Date.now() && (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Tampilkan Semua
              </button>
              <button
                onClick={(e) => addRipple(e, filterWithManager)}
                className="relative overflow-hidden px-4 py-2 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:hover:bg-cyan-800/50 text-cyan-800 dark:text-cyan-200 font-medium rounded-lg transition-all duration-300 flex items-center"
              >
                {ripples.map(
                  (ripple) =>
                    ripple.id === Date.now() && (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Punya Atasan
              </button>
              <button
                onClick={(e) => addRipple(e, filterWithoutManager)}
                className="relative overflow-hidden px-4 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-800 dark:text-purple-200 font-medium rounded-lg transition-all duration-300 flex items-center"
              >
                {ripples.map(
                  (ripple) =>
                    ripple.id === Date.now() && (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Tanpa Atasan
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Data Pegawai */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    NIP
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Jabatan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Atasan Langsung
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((pegawai) => (
                  <tr
                    key={pegawai.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {pegawai.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                            <span className="text-cyan-800 dark:text-cyan-200 font-medium">
                              {pegawai.nama.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {pegawai.nama}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {pegawai.nip}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pegawai.kel_jab === "Struktural"
                            ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                        }`}
                      >
                        {pegawai.jabatan.length > 30
                          ? `${pegawai.jabatan.substring(0, 30)}...`
                          : pegawai.jabatan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {pegawai.atasan_langsung ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              <span className="text-purple-800 dark:text-purple-200 text-xs font-medium">
                                {pegawai.atasan_langsung.nama.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {pegawai.atasan_langsung.nama}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {pegawai.atasan_langsung.id}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUbahAtasan(pegawai)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
                        title="Ubah Atasan"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
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
              Tidak ada data pegawai
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Silakan pilih filter lainnya atau tambahkan data pegawai baru.
            </p>
            <div className="mt-6">
              <button
                onClick={(e) => addRipple(e, tampilkanSemua)}
                className="relative overflow-hidden inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                {ripples.map(
                  (ripple) =>
                    ripple.id === Date.now() && (
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
                Tampilkan Semua Data
              </button>
            </div>
          </div>
        )}

        {/* Modal Ubah Atasan */}
        {showModal && currentPegawai && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scale-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Ubah Atasan Langsung
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg mb-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                        <span className="text-cyan-800 dark:text-cyan-200 font-medium">
                          {currentPegawai.nama.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentPegawai.nama}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {currentPegawai.id} -{" "}
                        {currentPegawai.jabatan.length > 30
                          ? `${currentPegawai.jabatan.substring(0, 30)}...`
                          : currentPegawai.jabatan}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="atasan"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Pilih Atasan Langsung
                    </label>
                    <select
                      id="atasan"
                      value={selectedAtasan}
                      onChange={(e) => setSelectedAtasan(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md shadow-sm"
                    >
                      <option value="">-- Tidak ada atasan --</option>
                      {pegawaiList
                        .filter((p) => p.id !== currentPegawai.id)
                        .map((pegawai) => (
                          <option key={pegawai.id} value={pegawai.id}>
                            {pegawai.nama} (ID: {pegawai.id})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSimpanAtasan}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom CSS untuk animasi */}
        <style jsx>{`
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
        `}</style>
      </div>
    </div>
  );
};

export default EmployeeManagers;
