import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const PeraturanList = ({
  loading,
  filteredPeraturans,
  peraturans,
  handleViewDocument,
  handleEditPeraturan,
  handleDeletePeraturan,
  parseKategori,
  setShowAddData,
  formatTanggal,
}) => {
  const { isAdmin } = useAuth();
  const [tanggalTerbaru, setTanggalTerbaru] = useState(null);
  const [showTanggalTerbaru, setShowTanggalTerbaru] = useState(false);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const peraturansPerPage = 10; // Jumlah item per halaman

  // Efek untuk mendapatkan peraturan dengan tanggal terbaru
  useEffect(() => {
    if (peraturans.length > 0) {
      // Mengurutkan peraturan berdasarkan tanggal_ditetapkan terbaru
      const sortedPeraturans = [...peraturans].sort((a, b) => {
        return new Date(b.tanggal_ditetapkan) - new Date(a.tanggal_ditetapkan);
      });

      setTanggalTerbaru(sortedPeraturans[0]);

      // Menampilkan peraturan terbaru selama 5 detik
      setShowTanggalTerbaru(true);
      const timer = setTimeout(() => {
        setShowTanggalTerbaru(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [peraturans]);

  // Reset ke halaman pertama saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPeraturans]);

  // Logika pagination
  const indexOfLastPeraturan = currentPage * peraturansPerPage;
  const indexOfFirstPeraturan = indexOfLastPeraturan - peraturansPerPage;
  const currentPeraturans = filteredPeraturans.slice(
    indexOfFirstPeraturan,
    indexOfLastPeraturan
  );
  const totalPages = Math.ceil(filteredPeraturans.length / peraturansPerPage);

  // Fungsi untuk ganti halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col items-center justify-center p-4 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800 relative">
      {/* Peraturan Terbaru Muncul di Sudut Kanan Bawah */}
      {showTanggalTerbaru && tanggalTerbaru && (
        <div className="absolute bottom-4 right-4 z-10 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 max-w-xs transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mr-2">
                <svg
                  className="w-4 h-4 text-cyan-600 dark:text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Peraturan Terbaru
              </h3>
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {tanggalTerbaru.judul}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ditetapkan:{" "}
              {new Date(tanggalTerbaru.tanggal_ditetapkan).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
            <div className="mt-2 flex justify-between items-center">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">
                {parseKategori(tanggalTerbaru.kategori)}
              </span>
              <button
                onClick={() => handleViewDocument(tanggalTerbaru)}
                className="text-xs text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
              >
                Lihat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Container untuk daftar peraturan */}
      <div className="lg:columns-2 columns-1 gap-4 w-full">
        {loading ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              Memuat data peraturan...
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Mohon tunggu sebentar
            </p>
          </div>
        ) : filteredPeraturans.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-12">
            <div className="mb-4 text-cyan-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {peraturans.length === 0
                ? "Belum ada data peraturan"
                : "Tidak ada peraturan yang sesuai dengan filter"}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 max-w-md text-center">
              {peraturans.length === 0
                ? "Silakan tambahkan peraturan baru menggunakan tombol '+' di bagian bawah"
                : "Coba ubah filter atau reset untuk melihat semua peraturan"}
            </p>
          </div>
        ) : (
          currentPeraturans.map((peraturan) => (
            <div
              key={peraturan.id}
              className="relative w-full break-inside-avoid mb-4 border p-4 border-gray-200 shadow rounded-md bg-white hover:shadow-md transition-all duration-300 hover:border-cyan-300 group"
            >
              <span className="absolute top-2 right-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 uppercase transition-colors duration-300 group-hover:bg-blue-100">
                {parseKategori(peraturan.kategori)}
              </span>
              <span className="absolute bottom-2 right-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 uppercase transition-colors duration-300 group-hover:bg-blue-100">
                {formatTanggal(peraturan.tanggal_ditetapkan)}
              </span>
              <p className="text-xs text-gray-800 uppercase transition-colors duration-300 group-hover:text-cyan-700">
                {peraturan.nomor}
              </p>
              <h1 className="text-base font-medium text-gray-900 mt-1 uppercase transition-colors duration-300 group-hover:text-cyan-800">
                {peraturan.judul}
              </h1>
              <p className="text-[10px] text-gray-600 font-semibold mt-1 uppercase transition-colors duration-300 group-hover:text-cyan-600">
                {peraturan.instansi_pembuat}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleViewDocument(peraturan)}
                  className="inline-flex items-center rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200 transition-all duration-300 hover:shadow-sm transform hover:-translate-y-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View
                </button>

                {/* Show Edit button only if user is logged in and is admin */}
                {isAdmin && (
                  <button
                    onClick={() => handleEditPeraturan(peraturan)}
                    className="inline-flex items-center rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 transition-all duration-300 hover:shadow-sm transform hover:-translate-y-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-3l-4 4 4 4v-3h2.828l-1.414-1.414z"
                      />
                    </svg>
                    Edit
                  </button>
                )}

                {/* Show Delete button only if user is logged in and is admin */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePeraturan(peraturan.id)}
                    className="inline-flex items-center rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 transition-all duration-300 hover:shadow-sm transform hover:-translate-y-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m0-6h6m-6 6h6"
                      />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls - Di luar container columns agar berada di bawah semua card */}
      {!loading && filteredPeraturans.length > peraturansPerPage && (
        <div className="w-full mt-6">
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
                  <span className="font-medium">
                    {indexOfFirstPeraturan + 1}
                  </span>{" "}
                  hingga{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastPeraturan, filteredPeraturans.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">
                    {filteredPeraturans.length}
                  </span>{" "}
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
        </div>
      )}

      {/* Custom CSS untuk animasi */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PeraturanList;
