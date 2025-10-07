import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  TrashIcon,
  EyeIcon,
  XCircleIcon,
  XMarkIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  EyeSlashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api"; // Ganti axios dengan api

// Komponen Alert yang dapat digunakan kembali
const Alert = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === "success" ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
              ) : (
                <XCircleIcon
                  className="h-6 w-6 text-red-400"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p
                className={`text-sm font-medium ${
                  type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {type === "success" ? "Berhasil!" : "Gagal!"}
              </p>
              <p
                className={`mt-1 text-sm ${
                  type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                className={`inline-flex rounded-md ${
                  type === "success"
                    ? "bg-green-50 text-green-500 hover:bg-green-100"
                    : "bg-red-50 text-red-500 hover:bg-red-100"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === "success"
                    ? "focus:ring-green-500"
                    : "focus:ring-red-500"
                }`}
                onClick={handleClose}
              >
                <span className="sr-only">Tutup</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
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
    </div>
  );
};

// Komponen Konfirmasi Delete Modal
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "data ini",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 mr-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Konfirmasi Hapus
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 rounded-full hover:bg-white hover:bg-opacity-20 p-1 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Apakah Anda yakin?
                </h3>
                <p className="text-gray-500">
                  Tindakan ini akan menghapus {itemName} secara permanen. Data
                  yang telah dihapus tidak dapat dikembalikan.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={onConfirm}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors font-medium flex items-center"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Hapus
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Komponen Pagination
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  // Hitung item yang ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Math.min(indexOfLastItem, totalItems);

  // Fungsi untuk generate nomor halaman
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Jika total halaman kurang dari atau sama dengan maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Jika total halaman lebih dari maxVisiblePages
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Menampilkan{" "}
            <span className="font-medium">{indexOfFirstItem + 1}</span> hingga{" "}
            <span className="font-medium">{currentItems}</span> dari{" "}
            <span className="font-medium">{totalItems}</span> hasil
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                  currentPage === page
                    ? "bg-cyan-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default function ViewForm() {
  const { isAdmin, token, isAuthenticated } = useAuth();
  // State untuk menyimpan data form dari database
  const [suggestions, setSuggestions] = useState([]);
  // State untuk form input
  const [inputData, setInputData] = useState({
    nama: "",
    nip: "",
    unit: "",
    bidang: "Choose One",
    saran: "",
  });
  // State untuk loading dan error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State untuk modal saran lengkap
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  // State untuk alert
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  // State untuk submitting form
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State untuk mengontrol visibilitas form modal
  const [showFormModal, setShowFormModal] = useState(false);
  // State untuk konfirmasi delete
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
    itemName: "",
  });

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah item per halaman

  // Fetch data dari database saat komponen dimuat
  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Reset halaman saat data berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [suggestions]);

  // Fungsi untuk mengambil data suggestions dari API
  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/suggestions"); // Gunakan instance api
      setSuggestions(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi input
    if (
      !inputData.nama.trim() ||
      !inputData.nip.trim() ||
      !inputData.unit.trim() ||
      inputData.bidang === "Choose One" ||
      !inputData.saran.trim()
    ) {
      setAlert({
        show: true,
        type: "error",
        message: "Semua field harus diisi!",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/suggestions", {
        // Gunakan instance api
        nama: inputData.nama,
        nip: inputData.nip,
        unit: inputData.unit,
        bidang: inputData.bidang,
        saran: inputData.saran,
      });

      // Reset form
      setInputData({
        nama: "",
        nip: "",
        unit: "",
        bidang: "Choose One",
        saran: "",
      });

      // Tutup modal setelah submit berhasil
      setShowFormModal(false);

      // Refresh data dari server
      fetchSuggestions();
      setAlert({
        show: true,
        type: "success",
        message:
          "Data berhasil disimpan! Terima kasih atas masukan dan saran Anda.",
      });
    } catch (err) {
      console.error("Error saving suggestion:", err);
      setAlert({
        show: true,
        type: "error",
        message: "Gagal menyimpan data. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tutup alert
  const closeAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  // Tandai sebagai sudah dibaca
  const markAsRead = async (id) => {
    try {
      // Ambil token langsung dari localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setAlert({
          show: true,
          type: "error",
          message: "Anda tidak memiliki akses. Silakan login terlebih dahulu.",
        });
        return;
      }

      // Kirim request dengan token
      await api.put(
        `/suggestions/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuggestions(
        suggestions.map((item) =>
          item.id === id ? { ...item, sudah_dibaca: true } : item
        )
      );
      setAlert({
        show: true,
        type: "success",
        message: "Status berhasil diperbarui!",
      });
    } catch (err) {
      console.error("Error marking as read:", err);
      setAlert({
        show: true,
        type: "error",
        message: "Gagal memperbarui status. Silakan coba lagi.",
      });
    }
  };

  // Buka konfirmasi delete
  const openConfirmDelete = (id, itemName) => {
    setConfirmDelete({
      isOpen: true,
      id,
      itemName,
    });
  };

  // Tutup konfirmasi delete
  const closeConfirmDelete = () => {
    setConfirmDelete({
      isOpen: false,
      id: null,
      itemName: "",
    });
  };

  // Ganti fungsi confirmAndDelete dengan ini
  const confirmAndDelete = async () => {
    const { id } = confirmDelete;
    closeConfirmDelete();

    try {
      // Ambil token langsung dari localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setAlert({
          show: true,
          type: "error",
          message: "Anda tidak memiliki akses. Silakan login terlebih dahulu.",
        });
        return;
      }

      // Kirim request dengan token
      await api.delete(`/admin/suggestions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuggestions(suggestions.filter((item) => item.id !== id));
      setAlert({
        show: true,
        type: "success",
        message: "Data berhasil dihapus!",
      });
    } catch (err) {
      console.error("Error deleting suggestion:", err);
      setAlert({
        show: true,
        type: "error",
        message: "Gagal menghapus data. Silakan coba lagi.",
      });
    }
  };
  // Format tanggal untuk ditampilkan
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Buka modal untuk melihat saran lengkap
  const openSuggestionModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  // Tutup modal
  const closeSuggestionModal = () => {
    setSelectedSuggestion(null);
  };

  // Buka modal form
  const openFormModal = () => {
    setShowFormModal(true);
    // Reset form saat membuka modal
    setInputData({
      nama: "",
      nip: "",
      unit: "",
      bidang: "Choose One",
      saran: "",
    });
  };

  // Tutup modal form
  const closeFormModal = () => {
    setShowFormModal(false);
  };

  // Handle perubahan halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Badge colors for different bidang
  const getBidangColor = (bidang) => {
    const colors = {
      Umum: "bg-blue-100 text-blue-800",
      IPP: "bg-green-100 text-green-800",
      APD: "bg-yellow-100 text-yellow-800",
      AN: "bg-purple-100 text-purple-800",
      INVES: "bg-pink-100 text-pink-800",
      P3A: "bg-indigo-100 text-indigo-800",
    };
    return colors[bidang] || "bg-gray-100 text-gray-800";
  };

  // Animasi untuk modal
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Hitung data untuk pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = suggestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(suggestions.length / itemsPerPage);

  return (
    <>
      {/* Alert Component */}
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={confirmDelete.isOpen}
        onClose={closeConfirmDelete}
        onConfirm={confirmAndDelete}
        itemName={confirmDelete.itemName}
      />

      {/* Tombol untuk menampilkan form modal */}
      <div className="w-full mx-auto mb-6 flex justify-end">
        <button
          onClick={openFormModal}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5 text-white shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Tambah Masukan & Saran
        </button>
      </div>

      {/* Modal Form - menggunakan AnimatePresence untuk animasi */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFormModal}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-500 to-blue-500 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 mr-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Masukan & Saran
                  </h2>
                </div>
                <button
                  onClick={closeFormModal}
                  className="text-white hover:text-gray-200 rounded-full hover:bg-white hover:bg-opacity-20 p-1 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Fitur ini disediakan sebagai wadah resmi bagi setiap pegawai
                    untuk menyampaikan ide, kritik, maupun saran yang membangun.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Field Nama */}
                    <div className="space-y-2">
                      <label
                        htmlFor="nama"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-cyan-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Nama
                      </label>
                      <div className="relative">
                        <input
                          id="nama"
                          name="nama"
                          type="text"
                          placeholder="Abdi Nurhalim"
                          value={inputData.nama}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </div>

                    {/* Field NIP */}
                    <div className="space-y-2">
                      <label
                        htmlFor="nip"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-cyan-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                        NIP
                      </label>
                      <div className="relative">
                        <input
                          id="nip"
                          name="nip"
                          type="number"
                          placeholder="199706081001"
                          value={inputData.nip}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </div>

                    {/* Field Bidang */}
                    <div className="space-y-2">
                      <label
                        htmlFor="bidang"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-cyan-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Bidang
                      </label>
                      <div className="relative">
                        <select
                          id="bidang"
                          name="bidang"
                          value={inputData.bidang}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 appearance-none"
                        >
                          <option>Choose One</option>
                          <option>Umum</option>
                          <option>IPP</option>
                          <option>APD</option>
                          <option>AN</option>
                          <option>INVES</option>
                          <option>P3A</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDownIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Field Unit Perwakilan */}
                    <div className="space-y-2">
                      <label
                        htmlFor="unit"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-cyan-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Unit Perwakilan
                      </label>
                      <div className="relative">
                        <input
                          id="unit"
                          name="unit"
                          type="text"
                          placeholder="Perwakilan BPKP Nusa Tenggara Timur"
                          value={inputData.unit}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field Masukan & Saran */}
                  <div className="space-y-2">
                    <label
                      htmlFor="saran"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-cyan-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      Masukan & Saran
                    </label>
                    <div className="relative">
                      <textarea
                        id="saran"
                        name="saran"
                        rows={4}
                        value={inputData.saran}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Tulis masukan & saran terbaik Anda untuk kemajuan bersama.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={closeFormModal}
                      className="mr-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
                        isSubmitting
                          ? "bg-cyan-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5"
                      } text-white`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Kirim Masukan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-10 transform -translate-x-12 translate-y-12"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabel untuk menampilkan data */}
      <div className="w-full mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
          <h3 className="text-xl font-bold text-white">
            Daftar Masukan & Saran
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-50">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchSuggestions}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50">
            <p className="text-gray-500 text-lg">
              Belum ada data masukan & saran.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tanggal
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nama
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      NIP
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Unit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Bidang
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Masukan & Saran
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        item.sudah_dibaca ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.tanggal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.nip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBidangColor(
                            item.bidang
                          )}`}
                        >
                          {item.bidang}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-500 max-w-xs cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => openSuggestionModal(item)}
                      >
                        <div
                          className="truncate"
                          title="Klik untuk melihat selengkapnya"
                        >
                          {item.saran}
                        </div>
                        <div className="text-xs text-blue-500 mt-1">
                          Klik untuk melihat selengkapnya
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {isAdmin ? (
                            // Untuk admin: tampilkan tombol jika belum dibaca, status jika sudah dibaca
                            !item.sudah_dibaca ? (
                              <button
                                onClick={() => markAsRead(item.id)}
                                className="text-cyan-600 hover:text-cyan-900 flex items-center"
                                title="Tandai sebagai dibaca"
                              >
                                <EyeIcon className="h-5 w-5 mr-1" />
                                <span>Baca</span>
                              </button>
                            ) : (
                              <span className="text-green-600 flex items-center">
                                <CheckCircleIcon className="h-5 w-5 mr-1" />
                                <span>Sudah dibaca</span>
                              </span>
                            )
                          ) : // Untuk non-admin: hanya tampilkan status tanpa tombol
                          !item.sudah_dibaca ? (
                            <span className="text-red-500 flex items-center">
                              <EyeSlashIcon className="h-5 w-5 mr-1" />
                              <span>Belum dibaca</span>
                            </span>
                          ) : (
                            <span className="text-green-600 flex items-center">
                              <CheckCircleIcon className="h-5 w-5 mr-1" />
                              <span>Sudah dibaca</span>
                            </span>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() =>
                                openConfirmDelete(
                                  item.id,
                                  `masukan dari ${item.nama}`
                                )
                              }
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Hapus"
                            >
                              <TrashIcon className="h-5 w-5 mr-1" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={suggestions.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>

      {/* Modal untuk menampilkan saran lengkap */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Detail Masukan & Saran
                </h3>
                <button
                  onClick={closeSuggestionModal}
                  className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-1 transition-colors"
                  title="Tutup"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Nama</h4>
                    <p className="text-lg font-semibold">
                      {selectedSuggestion.nama}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">NIP</h4>
                    <p className="text-lg font-semibold">
                      {selectedSuggestion.nip}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Unit Perwakilan
                    </h4>
                    <p className="text-lg font-semibold">
                      {selectedSuggestion.unit}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Bidang
                    </h4>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBidangColor(
                        selectedSuggestion.bidang
                      )}`}
                    >
                      {selectedSuggestion.bidang}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tanggal</h4>
                  <p className="text-lg font-semibold">
                    {formatDate(selectedSuggestion.tanggal)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Masukan & Saran
                  </h4>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedSuggestion.saran}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    onClick={closeSuggestionModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Tutup
                  </button>

                  <div className="flex space-x-3">
                    {isAdmin ? (
                      // Untuk admin: tampilkan tombol jika belum dibaca, status jika sudah dibaca
                      !selectedSuggestion.sudah_dibaca ? (
                        <button
                          onClick={() => {
                            markAsRead(selectedSuggestion.id);
                            closeSuggestionModal();
                          }}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2"
                        >
                          <EyeIcon className="h-5 w-5" />
                          <span>Tandai sebagai dibaca</span>
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Sudah dibaca</span>
                        </span>
                      )
                    ) : // Untuk non-admin: hanya tampilkan status tanpa tombol
                    !selectedSuggestion.sudah_dibaca ? (
                      <span className="px-4 py-2 bg-gray-100 text-red-500 rounded-lg flex items-center gap-2">
                        <EyeSlashIcon className="h-5 w-5" />
                        <span>Belum dibaca</span>
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Sudah dibaca</span>
                      </span>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          openConfirmDelete(
                            selectedSuggestion.id,
                            `masukan dari ${selectedSuggestion.nama}`
                          );
                          closeSuggestionModal();
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
