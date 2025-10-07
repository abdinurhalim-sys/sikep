import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

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
                  <FaTrash className="w-4 h-4 mr-2" />
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
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="mr-2" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <FaChevronRight className="ml-2" />
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
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                  currentPage === page
                    ? "bg-blue-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const ViewFq = ({ faqs, loading, fetchFaqs }) => {
  const { isAdmin, currentUser } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({
    id: null,
    question: "",
    answer: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah item per halaman

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openAddModal = () => {
    setCurrentFaq({ id: null, question: "", answer: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setCurrentFaq({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFaq({ ...currentFaq, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama saat search
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  // PERBAIKAN: Fungsi handleSubmit untuk tambah/update FAQ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi input
    if (!currentFaq.question.trim() || !currentFaq.answer.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Pertanyaan dan jawaban tidak boleh kosong!",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let response;
      if (isEditing) {
        // PERBAIKAN: Gunakan endpoint yang benar untuk update FAQ
        console.log("Mengupdate FAQ dengan ID:", currentFaq.id);
        response = await axios.put(
          `http://localhost:8080/api/admin/faq/${currentFaq.id}`,
          {
            question: currentFaq.question,
            answer: currentFaq.answer,
          },
          {
            withCredentials: true, // Pastikan cookie dikirim
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setAlert({
          show: true,
          type: "success",
          message: "FAQ berhasil diperbarui!",
        });
      } else {
        // PERBAIKAN: Gunakan endpoint yang benar untuk create FAQ
        console.log("Menambah FAQ baru");
        response = await axios.post(
          "http://localhost:8080/api/admin/faq",
          {
            question: currentFaq.question,
            answer: currentFaq.answer,
          },
          {
            withCredentials: true, // Pastikan cookie dikirim
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setAlert({
          show: true,
          type: "success",
          message: "FAQ berhasil ditambahkan!",
        });
      }

      console.log("API Response:", response.data);
      fetchFaqs(); // Refresh data
      closeModals();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      let errorMessage = "Gagal menyimpan FAQ. Silakan coba lagi.";

      if (error.response) {
        // Error dari server
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        if (error.response.status === 401) {
          errorMessage =
            "Anda tidak memiliki izin untuk melakukan aksi ini. Pastikan Anda login sebagai admin.";
        } else if (error.response.status === 404) {
          errorMessage =
            "Endpoint tidak ditemukan. Periksa konfigurasi server.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        // Tidak ada respons dari server
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }

      setAlert({
        show: true,
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // PERBAIKAN: Fungsi handleDelete untuk hapus FAQ
  // PERBAIKAN: Fungsi handleDelete untuk hapus FAQ
  const handleDelete = async () => {
    try {
      // PERBAIKAN: Gunakan endpoint yang benar untuk delete FAQ
      console.log("Menghapus FAQ dengan ID:", deleteId);
      await axios.delete(`http://localhost:8080/api/admin/faq/${deleteId}`, {
        withCredentials: true, // Pastikan cookie dikirim
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAlert({
        show: true,
        type: "success",
        message: "FAQ berhasil dihapus!",
      });
      fetchFaqs(); // Refresh data
      closeModals();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      let errorMessage = "Gagal menghapus FAQ. Silakan coba lagi.";

      if (error.response) {
        // Error dari server
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        if (error.response.status === 401) {
          errorMessage =
            "Anda tidak memiliki izin untuk melakukan aksi ini. Pastikan Anda login sebagai admin.";
        } else if (error.response.status === 404) {
          errorMessage =
            "Endpoint tidak ditemukan. Periksa konfigurasi server.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        // Tidak ada respons dari server
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }

      setAlert({
        show: true,
        type: "error",
        message: errorMessage,
      });
    }
  };

  // PERBAIKAN: Urutkan data FAQ berdasarkan ID terbesar (data terbaru) di paling depan
  const sortedFaqs = [...faqs].sort((a, b) => {
    // Jika ada created_at, urutkan berdasarkan tanggal
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    // Jika tidak ada created_at, urutkan berdasarkan ID terbesar
    return b.id - a.id;
  });

  // Filter FAQs based on search query
  const filteredFaqs = sortedFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hitung data untuk pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);

  // Handle perubahan halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Tutup FAQ yang sedang terbuka saat ganti halaman
    setOpenIndex(null);
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

  return (
    <>
      {/* Alert Component */}
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}

      <section className="container p-10 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-center md:text-left text-2xl font-bold lg:text-4xl bg-gradient-to-r from-blue-500 via-cyan-200 to-cyan-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FaPlus /> Tambah FAQ
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari FAQ..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : currentItems.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4">
              {currentItems.map((faq, index) => (
                <div
                  key={faq.id}
                  className="h-fit rounded-xl bg-gray-100 px-6 py-4 cursor-pointer transition-all duration-300 hover:shadow-md"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-semibold lg:text-lg">{faq.question}</h4>
                    <div className="flex items-center gap-3">
                      {isAdmin && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(faq);
                            }}
                            className="text-amber-500 hover:text-amber-700 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteConfirm(faq.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}

                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transform transition-transform duration-300 ${
                          openIndex === index ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                      </svg>
                    </div>
                  </div>

                  {openIndex === index && (
                    <p className="mt-4 border-t border-dashed border-gray-200 py-4">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            {filteredFaqs.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredFaqs.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "Tidak ada FAQ yang cocok dengan pencarian Anda."
                : "No FAQs available at the moment."}
            </p>
            {isAdmin && (
              <button
                onClick={openAddModal}
                className="mt-4 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaPlus /> Tambah FAQ Pertama
              </button>
            )}
          </div>
        )}
      </section>

      {/* Modal Add/Edit FAQ - menggunakan AnimatePresence untuk animasi */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModals}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex justify-between items-center">
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {isEditing ? "Edit FAQ" : "Tambah FAQ Baru"}
                  </h2>
                </div>
                <button
                  onClick={closeModals}
                  className="text-white hover:text-gray-200 rounded-full hover:bg-white hover:bg-opacity-20 p-1 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {isEditing
                      ? "Edit pertanyaan dan jawaban FAQ yang telah ada."
                      : "Tambahkan pertanyaan dan jawaban yang sering diajukan oleh pengguna."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Field Pertanyaan */}
                  <div className="space-y-2">
                    <label
                      htmlFor="question"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Pertanyaan
                    </label>
                    <div className="relative">
                      <input
                        id="question"
                        name="question"
                        type="text"
                        placeholder="Contoh: Bagaimana cara mendaftar?"
                        value={currentFaq.question}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Field Jawaban */}
                  <div className="space-y-2">
                    <label
                      htmlFor="answer"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Jawaban
                    </label>
                    <div className="relative">
                      <textarea
                        id="answer"
                        name="answer"
                        rows={4}
                        value={currentFaq.answer}
                        onChange={handleInputChange}
                        placeholder="Tulis jawaban lengkap di sini..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {isEditing
                        ? "Edit jawaban FAQ dengan informasi yang akurat."
                        : "Tulis jawaban yang jelas dan informatif."}
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="mr-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
                        isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg transform hover:-translate-y-0.5"
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
                      ) : isEditing ? (
                        <>
                          <FaSave className="w-5 h-5 mr-2" />
                          Update FAQ
                        </>
                      ) : (
                        <>
                          <FaSave className="w-5 h-5 mr-2" />
                          Simpan FAQ
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-10 transform -translate-x-12 translate-y-12"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={closeModals}
        onConfirm={handleDelete}
        itemName="FAQ ini"
      />
    </>
  );
};

export default ViewFq;
