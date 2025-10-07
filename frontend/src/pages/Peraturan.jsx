import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import DashboardHeader from "../components/peraturan/DashboardHeader";
import Sidebar from "../components/Sidebar";
import FilterSection from "../components/peraturan/FilterSection";
import PeraturanList from "../components/peraturan/PeraturanList";
import AddDataModal from "../components/peraturan/AddDataModal";
import EditDataModal from "../components/peraturan/EditDataModal";
import ViewDocumentModal from "../components/peraturan/ViewDocumentModal";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
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
      className={`fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-[9999] transition-opacity duration-300 ${
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
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

const Peraturan = () => {
  // State untuk sidebar dan UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAdmin, isAuthenticated } = useAuth();

  // State untuk form
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddData, setShowAddData] = useState(false);

  // State untuk kategori (multiple select)
  const [selectedKategoris, setSelectedKategoris] = useState([]);

  // State untuk edit
  const [showEditData, setShowEditData] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [editFileName, setEditFileName] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editSelectedKategoris, setEditSelectedKategoris] = useState([]);

  // Static kategori options
  const staticKategoris = [
    "Angka Kredit",
    "Disiplin Pegawai",
    "Perpindahan Pegawai",
    "Pernikahan & Perceraian PNS",
    "Cuti",
    "Izin & Tugas Belajar",
    "Pensiun",
    "Penilaian Kinerja PNS",
    "Jaminan Kesehatan",
    "Kompetensi JFA",
    "Kenaikan Pangkat PNS",
    "Lainnya",
  ];

  // State untuk data peraturan
  const [peraturans, setPeraturans] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal view dokumen
  const [showViewDocument, setShowViewDocument] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisPeraturanFilter, setJenisPeraturanFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState("");
  const [filteredPeraturans, setFilteredPeraturans] = useState([]);

  // State untuk data FAQ
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);

  // STATE GLOBAL UNTUK ALERT
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // State untuk modal konfirmasi delete
  const [deleteId, setDeleteId] = useState(null);

  // Auto-close alert setelah 5 detik
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Filter kategori berdasarkan search term
  const filteredKategoris = staticKategoris.filter((kategori) =>
    kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi untuk mengambil data peraturan dari backend
  const fetchPeraturans = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (jenisPeraturanFilter) params.append("jenis", jenisPeraturanFilter);
      if (kategoriFilter) params.append("kategori", kategoriFilter);
      if (tahunFilter) params.append("tahun", tahunFilter);

      const response = await api.get(`/peraturan/filter?${params.toString()}`);
      // PERBAIKAN: Urutkan data berdasarkan tanggal_ditetapkan (terbaru di depan)
      const sortedData = response.data.data.sort((a, b) => {
        return new Date(b.tanggal_ditetapkan) - new Date(a.tanggal_ditetapkan);
      });
      setPeraturans(sortedData || []);
    } catch (error) {
      console.error("Error fetching peraturans:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Gagal mengambil data peraturan",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data FAQ dari backend
  const fetchFaqs = async () => {
    try {
      setFaqsLoading(true);
      const response = await api.get("/faq");
      setFaqs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setFaqsLoading(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchPeraturans();
    fetchFaqs();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  // Fungsi untuk menangani perubahan kategori
  const handleKategoriChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedKategoris(selectedValues);
  };

  // Fungsi untuk parse kategori dari JSON string
  const parseKategori = (kategoriStr) => {
    try {
      const kategoriArray = JSON.parse(kategoriStr);
      return Array.isArray(kategoriArray)
        ? kategoriArray.join(", ")
        : kategoriStr;
    } catch (e) {
      return kategoriStr;
    }
  };

  // Fungsi untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("nomor", document.getElementById("nomor").value);
      formData.append(
        "tanggal_ditetapkan",
        document.getElementById("tanggalDitetapkan").value
      );
      formData.append("judul", document.getElementById("judul").value);
      formData.append(
        "instansi_pembuat",
        document.getElementById("instansiPembuat").value
      );
      formData.append(
        "jenis_peraturan",
        document.getElementById("jenisPeraturan").value
      );

      // Kirim kategori sebagai JSON string
      formData.append("kategori", JSON.stringify(selectedKategoris));

      formData.append(
        "keterangan",
        document.getElementById("keterangan").value
      );
      formData.append("nama_file", fileName);

      // Tambahkan file jika ada
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await api.post("/admin/peraturan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({
        show: true,
        type: "success",
        message: "Data peraturan berhasil disimpan!",
      });

      // Reset form
      document.getElementById("formPeraturan").reset();
      setFileName("");
      setSelectedFile(null);
      setSelectedKategoris([]);

      // Tutup modal setelah 1.5 detik
      setTimeout(() => {
        setShowAddData(false);
        fetchPeraturans();
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({
        show: true,
        type: "error",
        message:
          error.response?.data?.error || "Gagal menyimpan data peraturan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk menangani klik tombol View
  const handleViewDocument = (peraturan) => {
    setCurrentDocument(peraturan);
    setShowViewDocument(true);
  };

  // Fungsi untuk mendownload dokumen
  const handleDownloadDocument = async (peraturan) => {
    try {
      window.open(
        `http://localhost:8080/api/peraturan/download/${peraturan.id}`,
        "_blank"
      );
    } catch (error) {
      console.error("Error downloading document:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Gagal mengunduh dokumen",
      });
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

  // Fungsi untuk membuka modal konfirmasi delete
  const openDeleteConfirm = (id) => {
    setDeleteId(id);
  };

  // Fungsi untuk menutup modal
  const closeModals = () => {
    setDeleteId(null);
  };

  // Fungsi untuk handle delete
  const handleDeletePeraturan = async () => {
    try {
      const idStr = String(deleteId);
      console.log("Deleting peraturan with ID:", idStr);

      await api.delete(`/admin/peraturan/${idStr}`);

      setAlert({
        show: true,
        type: "success",
        message: "Peraturan berhasil dihapus!",
      });
      fetchPeraturans();
      closeModals();
    } catch (error) {
      console.error("Error deleting peraturan:", error);
      if (error.response) {
        if (error.response.status === 404) {
          setAlert({
            show: true,
            type: "error",
            message:
              "Endpoint tidak ditemukan. Pastikan backend sudah berjalan dengan benar.",
          });
        } else {
          setAlert({
            show: true,
            type: "error",
            message: error.response.data?.error || "Gagal menghapus peraturan",
          });
        }
      } else {
        setAlert({
          show: true,
          type: "error",
          message: "Tidak dapat terhubung ke server",
        });
      }
      closeModals();
    }
  };

  // Fungsi untuk handle edit
  const handleEditPeraturan = (peraturan) => {
    setCurrentEditData(peraturan);
    setEditFileName(peraturan.nama_file || "");
    setEditSelectedFile(null);

    // Parse kategori
    try {
      const kategoriArray = JSON.parse(peraturan.kategori);
      setEditSelectedKategoris(
        Array.isArray(kategoriArray) ? kategoriArray : []
      );
    } catch (e) {
      setEditSelectedKategoris([]);
    }

    setShowEditData(true);
  };

  // Fungsi untuk handle update
  const handleUpdatePeraturan = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const formData = new FormData();
      formData.append("nomor", document.getElementById("editNomor").value);
      formData.append(
        "tanggal_ditetapkan",
        document.getElementById("editTanggalDitetapkan").value
      );
      formData.append("judul", document.getElementById("editJudul").value);
      formData.append(
        "instansi_pembuat",
        document.getElementById("editInstansiPembuat").value
      );
      formData.append(
        "jenis_peraturan",
        document.getElementById("editJenisPeraturan").value
      );
      formData.append("kategori", JSON.stringify(editSelectedKategoris));
      formData.append(
        "keterangan",
        document.getElementById("editKeterangan").value
      );
      formData.append("nama_file", editFileName);

      if (editSelectedFile) {
        formData.append("file", editSelectedFile);
      }

      const idStr = String(currentEditData.id);
      console.log("Updating peraturan with ID:", idStr);

      const response = await api.put(`/admin/peraturan/${idStr}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({
        show: true,
        type: "success",
        message: "Peraturan berhasil diperbarui!",
      });

      setTimeout(() => {
        setShowEditData(false);
        fetchPeraturans();
      }, 1500);
    } catch (error) {
      console.error("Error updating peraturan:", error);
      if (error.response) {
        if (error.response.status === 404) {
          setAlert({
            show: true,
            type: "error",
            message:
              "Endpoint tidak ditemukan. Pastikan backend sudah berjalan dengan benar.",
          });
        } else {
          setAlert({
            show: true,
            type: "error",
            message:
              error.response.data?.error || "Gagal memperbarui peraturan",
          });
        }
      } else {
        setAlert({
          show: true,
          type: "error",
          message: "Tidak dapat terhubung ke server",
        });
      }
    } finally {
      setIsEditing(false);
    }
  };

  // Fungsi untuk handle file change di edit
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditSelectedFile(file);
      setEditFileName(file.name);
    }
  };

  // Fungsi untuk handle kategori change di edit
  const handleEditKategoriChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setEditSelectedKategoris(selectedValues);
  };

  // Fungsi untuk menerapkan filter dan search
  const applyFilters = () => {
    let result = [...peraturans];

    // Filter berdasarkan search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (peraturan) =>
          peraturan.judul.toLowerCase().includes(term) ||
          peraturan.nomor.toLowerCase().includes(term) ||
          peraturan.instansi_pembuat.toLowerCase().includes(term)
      );
    }

    // Filter berdasarkan jenis peraturan
    if (jenisPeraturanFilter) {
      result = result.filter(
        (peraturan) => peraturan.jenis_peraturan === jenisPeraturanFilter
      );
    }

    // Filter berdasarkan kategori
    if (kategoriFilter) {
      result = result.filter((peraturan) => {
        try {
          const kategoriArray = JSON.parse(peraturan.kategori);
          return (
            Array.isArray(kategoriArray) &&
            kategoriArray.includes(kategoriFilter)
          );
        } catch (e) {
          return peraturan.kategori === kategoriFilter;
        }
      });
    }

    // Filter berdasarkan tahun
    if (tahunFilter) {
      result = result.filter(
        (peraturan) =>
          new Date(peraturan.tanggal_ditetapkan).getFullYear().toString() ===
          tahunFilter
      );
    }

    setFilteredPeraturans(result);
  };

  // Terapkan filter saat data peraturan berubah atau filter berubah
  useEffect(() => {
    applyFilters();
  }, [
    peraturans,
    searchTerm,
    jenisPeraturanFilter,
    kategoriFilter,
    tahunFilter,
  ]);

  // Fungsi untuk reset filter
  const resetFilters = () => {
    setSearchTerm("");
    setJenisPeraturanFilter("");
    setKategoriFilter("");
    setTahunFilter("");
  };

  // Fungsi untuk menghitung statistik kategori
  const getKategoriStats = () => {
    const kategoriCount = {};
    let total = 0;

    peraturans.forEach((peraturan) => {
      try {
        const kategoriArray = JSON.parse(peraturan.kategori);
        if (Array.isArray(kategoriArray)) {
          kategoriArray.forEach((kat) => {
            kategoriCount[kat] = (kategoriCount[kat] || 0) + 1;
            total++;
          });
        } else {
          kategoriCount[peraturan.kategori] =
            (kategoriCount[peraturan.kategori] || 0) + 1;
          total++;
        }
      } catch (e) {
        kategoriCount[peraturan.kategori] =
          (kategoriCount[peraturan.kategori] || 0) + 1;
        total++;
      }
    });

    return Object.entries(kategoriCount)
      .map(([kategori, jumlah]) => ({
        kategori,
        jumlah,
        persentase: total > 0 ? Math.round((jumlah / total) * 100) : 0,
      }))
      .sort((a, b) => b.jumlah - a.jumlah);
  };

  function formatTanggal(tanggal) {
    if (!tanggal) return "";
    const d = new Date(tanggal);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Fungsi untuk menutup alert
  const closeAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  return (
    <>
      {/* Alert Component */}
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}

      <section className="">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          peraturansCount={peraturans.length}
          faqsCount={faqs.length}
          suggestionsCount={faqs.length}
        />

        <div className="p-4 md:ml-64">
          <div className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19">
            {/* Tombol Add Data */}
            {isAuthenticated && isAdmin && (
              <div className="fixed z-40 right-8 bottom-4 flex justify-end mb-4">
                <button
                  onClick={() => setShowAddData(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Tambah Peraturan Baru
                </button>
              </div>
            )}

            <FilterSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              jenisPeraturanFilter={jenisPeraturanFilter}
              setJenisPeraturanFilter={setJenisPeraturanFilter}
              kategoriFilter={kategoriFilter}
              setKategoriFilter={setKategoriFilter}
              tahunFilter={tahunFilter}
              setTahunFilter={setTahunFilter}
              resetFilters={resetFilters}
              peraturans={peraturans}
            />

            <PeraturanList
              setShowAddData={setShowAddData}
              loading={loading}
              filteredPeraturans={filteredPeraturans}
              peraturans={peraturans}
              handleViewDocument={handleViewDocument}
              handleEditPeraturan={handleEditPeraturan}
              handleDeletePeraturan={openDeleteConfirm} // Mengganti dengan fungsi openDeleteConfirm
              parseKategori={parseKategori}
              formatTanggal={formatTanggal}
            />

            <Footer />
          </div>
        </div>
      </section>

      <AddDataModal
        showAddData={showAddData}
        setShowAddData={setShowAddData}
        staticKategoris={staticKategoris}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        handleKategoriChange={handleKategoriChange}
        selectedKategoris={selectedKategoris}
        fileName={fileName}
        isSubmitting={isSubmitting}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSelectedKategoris={setSelectedKategoris}
      />

      <EditDataModal
        showEditData={showEditData}
        setShowEditData={setShowEditData}
        currentEditData={currentEditData}
        staticKategoris={staticKategoris}
        handleUpdatePeraturan={handleUpdatePeraturan}
        handleEditFileChange={handleEditFileChange}
        handleEditKategoriChange={handleEditKategoriChange}
        editSelectedKategoris={editSelectedKategoris}
        editFileName={editFileName}
        isEditing={isEditing}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setEditSelectedKategoris={setEditSelectedKategoris}
      />

      <ViewDocumentModal
        showViewDocument={showViewDocument}
        setShowViewDocument={setShowViewDocument}
        currentDocument={currentDocument}
        handleDownloadDocument={handleDownloadDocument}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={closeModals}
        onConfirm={handleDeletePeraturan}
        itemName="peraturan ini"
      />
    </>
  );
};

export default Peraturan;
