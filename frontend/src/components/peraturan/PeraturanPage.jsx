import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";
import {
  FaSearch,
  FaTimes,
  FaCalendarAlt,
  FaTag,
  FaFileAlt,
  FaUndo,
  FaFilter,
  FaSlidersH,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

// Komponen Alert
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

  const alertVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
          <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`max-w-sm w-full backdrop-blur-lg rounded-xl pointer-events-auto ring-1 ring-white/20 overflow-hidden ${
              type === "success"
                ? "bg-gradient-to-r from-green-800/80 to-emerald-800/80"
                : "bg-gradient-to-r from-red-800/80 to-rose-800/80"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {type === "success" ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-300" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-300" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className={`text-sm font-medium text-white`}>
                    {type === "success" ? "Berhasil!" : "Gagal!"}
                  </p>
                  <p className={`mt-1 text-sm text-white/90`}>{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <motion.button
                    type="button"
                    className={`inline-flex rounded-md p-1 ${
                      type === "success"
                        ? "text-green-300 hover:text-white hover:bg-green-700/30"
                        : "text-red-300 hover:text-white hover:bg-red-700/30"
                    } focus:outline-none transition-colors duration-200`}
                    onClick={handleClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Komponen EditDataModal
const EditDataModal = ({
  showEditData,
  setShowEditData,
  currentEditData,
  staticKategoris,
  handleUpdatePeraturan,
  handleEditFileChange,
  handleEditKategoriChange,
  editSelectedKategoris,
  editFileName,
  isEditing,
  submitMessage,
  searchTerm,
  setSearchTerm,
  setEditSelectedKategoris,
}) => {
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editFileNameLocal, setEditFileNameLocal] = useState(
    editFileName || ""
  );
  const [submitMessageLocal, setSubmitMessageLocal] = useState({
    type: "",
    text: "",
  });

  const closeAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const resetForm = () => {
    setEditSelectedFile(null);
    setEditFileNameLocal("");
    setEditSelectedKategoris([]);
    setSubmitMessageLocal({ type: "", text: "" });
  };

  const handleCloseModal = () => {
    setShowEditData(false);
    resetForm();
  };

  useEffect(() => {
    if (submitMessage.text) {
      setAlert({
        show: true,
        type: submitMessage.type,
        message: submitMessage.text,
      });
    }
  }, [submitMessage]);

  useEffect(() => {
    setEditFileNameLocal(editFileName || "");
  }, [editFileName]);

  if (!showEditData || !currentEditData) return null;

  const filteredKategoris = staticKategoris.filter((kategori) =>
    kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}

      <AnimatePresence>
        {showEditData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>
              <motion.div
                className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/30 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.div>
              <motion.div
                className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/30 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.div>
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/20 blur-3xl"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              ></motion.div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/20"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-800/50 to-indigo-800/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Data Peraturan
                  </h2>
                  <motion.button
                    onClick={handleCloseModal}
                    className="text-blue-200 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-6 h-6"
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
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form
                  id="formEditPeraturan"
                  onSubmit={handleUpdatePeraturan}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 gap-5">
                    {/* Form fields tetap sama seperti sebelumnya */}
                    {/* Nomor Peraturan */}
                    <div>
                      <label
                        htmlFor="editNomor"
                        className="block text-sm font-medium text-blue-200 mb-2"
                      >
                        Nomor Peraturan
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        <motion.input
                          id="editNomor"
                          name="nomor"
                          type="text"
                          defaultValue={currentEditData.nomor}
                          className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white placeholder-blue-300"
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                      </div>
                    </div>

                    {/* Tanggal Ditetapkan */}
                    <div>
                      <label
                        htmlFor="editTanggalDitetapkan"
                        className="block text-sm font-medium text-blue-200 mb-2"
                      >
                        Tanggal Ditetapkan
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <motion.input
                          id="editTanggalDitetapkan"
                          name="tanggal_ditetapkan"
                          type="date"
                          defaultValue={
                            new Date(currentEditData.tanggal_ditetapkan)
                              .toISOString()
                              .split("T")[0]
                          }
                          className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white"
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                      </div>
                    </div>

                    {/* Judul */}
                    <div>
                      <label
                        htmlFor="editJudul"
                        className="block text-sm font-medium text-blue-200 mb-2"
                      >
                        Judul Peraturan
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <motion.input
                          id="editJudul"
                          name="judul"
                          type="text"
                          defaultValue={currentEditData.judul}
                          className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white placeholder-blue-300"
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                      </div>
                    </div>

                    {/* Instansi Pembuat */}
                    <div>
                      <label
                        htmlFor="editInstansiPembuat"
                        className="block text-sm font-medium text-blue-200 mb-2"
                      >
                        Instansi Pembuat
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
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
                        <motion.input
                          id="editInstansiPembuat"
                          name="instansi_pembuat"
                          type="text"
                          defaultValue={currentEditData.instansi_pembuat}
                          className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white placeholder-blue-300"
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                      </div>
                    </div>

                    {/* Jenis Peraturan */}
                    <div>
                      <label
                        htmlFor="editJenisPeraturan"
                        className="block text-sm font-medium text-blue-200 mb-2"
                      >
                        Jenis Peraturan
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <motion.select
                          id="editJenisPeraturan"
                          name="jenis_peraturan"
                          defaultValue={currentEditData.jenis_peraturan}
                          className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white appearance-none"
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        >
                          <option value="" className="bg-gray-800">
                            Pilih Jenis Peraturan
                          </option>
                          <option value="uu" className="bg-gray-800">
                            Undang-Undang
                          </option>
                          <option value="pp" className="bg-gray-800">
                            Peraturan Pemerintah
                          </option>
                          <option value="perpres" className="bg-gray-800">
                            Peraturan Presiden
                          </option>
                          <option value="permen" className="bg-gray-800">
                            Peraturan Menteri
                          </option>
                          <option value="perda" className="bg-gray-800">
                            Peraturan Daerah
                          </option>
                          <option value="perban" className="bg-gray-800">
                            Peraturan Badan
                          </option>
                          <option value="perka" className="bg-gray-800">
                            Peraturan Kepala
                          </option>
                          <option value="kepka" className="bg-gray-800">
                            Keputusan Kepala
                          </option>
                          <option value="persesma" className="bg-gray-800">
                            Peraturan Sekretaris Utama
                          </option>
                          <option value="se" className="bg-gray-800">
                            Surat Edaran
                          </option>
                          <option value="lainnya" className="bg-gray-800">
                            Lainnya
                          </option>
                        </motion.select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Kategori Peraturan */}
                    <div className="mt-1">
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Kategori Peraturan (Pilih satu atau lebih)
                      </label>

                      <div className="relative mb-2">
                        <input
                          type="text"
                          className="w-full px-3 py-2 pl-10 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white placeholder-blue-300"
                          placeholder="Cari kategori..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-white/20 rounded-lg bg-white/5">
                        {filteredKategoris.map((kategori, index) => (
                          <label
                            key={index}
                            className="flex items-center space-x-2 p-1 rounded hover:bg-white/10"
                          >
                            <input
                              type="checkbox"
                              name="kategori"
                              className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                              value={kategori.toLowerCase().replace(/ /g, " ")}
                              checked={editSelectedKategoris.includes(
                                kategori.toLowerCase().replace(/ /g, " ")
                              )}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (e.target.checked) {
                                  setEditSelectedKategoris([
                                    ...editSelectedKategoris,
                                    value,
                                  ]);
                                } else {
                                  setEditSelectedKategoris(
                                    editSelectedKategoris.filter(
                                      (item) => item !== value
                                    )
                                  );
                                }
                              }}
                            />
                            <span className="text-sm text-blue-200">
                              {kategori}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-sm text-blue-300">
                          {editSelectedKategoris.length} kategori dipilih
                        </span>
                        {editSelectedKategoris.length > 0 && (
                          <motion.button
                            type="button"
                            className="text-xs text-red-300 hover:text-red-100"
                            onClick={() => setEditSelectedKategoris([])}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Hapus semua
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Upload File */}
                    <div>
                      <label
                        htmlFor="editUploadFile"
                        className="block text-sm font-medium text-blue-200 mb-2"
                      >
                        Upload File (Kosongkan jika tidak ingin mengganti)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <motion.input
                          id="editUploadFile"
                          name="file"
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setEditSelectedFile(file);
                              setEditFileNameLocal(file.name);
                              if (handleEditFileChange) handleEditFileChange(e);
                            }
                          }}
                          className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white"
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                      </div>

                      {editFileNameLocal && (
                        <div className="mt-2 text-sm text-blue-300 flex items-center">
                          <svg
                            className="h-4 w-4 mr-1 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          File saat ini:{" "}
                          <span className="font-medium text-white">
                            {editFileNameLocal}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Keterangan */}
                    <div>
                      <label
                        htmlFor="editKeterangan"
                        className="block text-sm font-medium text-blue-200 mb-2"
                      >
                        Keterangan
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                          <svg
                            className="h-5 w-5 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <motion.textarea
                          id="editKeterangan"
                          name="keterangan"
                          rows={3}
                          defaultValue={currentEditData.keterangan || ""}
                          className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/10 text-white placeholder-blue-300"
                          variants={inputVariants}
                          whileFocus="focus"
                        ></motion.textarea>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/10 bg-gradient-to-r from-blue-900/50 to-indigo-900/50">
                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white/10 text-blue-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    form="formEditPeraturan"
                    disabled={isEditing}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isEditing ? (
                      <div className="flex items-center">
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
                        Memperbarui...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Simpan Perubahan
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Komponen FilterSection
const FilterSection = ({
  searchTerm,
  setSearchTerm,
  jenisPeraturanFilter,
  setJenisPeraturanFilter,
  kategoriFilter,
  setKategoriFilter,
  tahunFilter,
  setTahunFilter,
  resetFilters,
  peraturans,
}) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    search: searchTerm !== "",
    jenis: jenisPeraturanFilter !== "",
    kategori: kategoriFilter !== "",
    tahun: tahunFilter !== "",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);

  React.useEffect(() => {
    setActiveFilters({
      search: searchTerm !== "",
      jenis: jenisPeraturanFilter !== "",
      kategori: kategoriFilter !== "",
      tahun: tahunFilter !== "",
    });
  }, [searchTerm, jenisPeraturanFilter, kategoriFilter, tahunFilter]);

  React.useEffect(() => {
    if (peraturans && peraturans.length > 0) {
      const years = new Set();
      peraturans.forEach((peraturan) => {
        if (peraturan.tanggal_ditetapkan) {
          const year = new Date(peraturan.tanggal_ditetapkan).getFullYear();
          years.add(year);
        }
      });

      const sortedYears = Array.from(years)
        .sort((a, b) => b - a)
        .map(String);
      setAvailableYears(sortedYears);
    }
  }, [peraturans]);

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const filterContentVariants = {
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center p-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative w-full max-w-6xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-indigo-800/20 backdrop-blur-sm rounded-2xl"></div>

        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>

          <motion.div
            className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "loop",
            }}
          ></motion.div>
        </div>

        <motion.div
          className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between p-5 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <motion.div
                className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white mr-4 shadow-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <FaFilter className="text-xl" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Filter Peraturan
                </h2>
                <p className="text-sm text-blue-200">
                  Temukan peraturan yang Anda butuhkan
                </p>
              </div>
            </div>

            <div className="flex items-center mt-2 md:mt-0">
              {activeFilterCount > 0 && (
                <motion.div
                  className="flex items-center px-4 py-2 bg-blue-700/50 rounded-full mr-3 backdrop-blur-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-medium text-white mr-2">
                    {activeFilterCount} filter aktif
                  </span>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetFilters();
                    }}
                    className="text-xs text-blue-200 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Hapus semua
                  </motion.button>
                </motion.div>
              )}

              <motion.div
                className="p-3 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 transition-colors duration-300"
                whileHover={{ rotate: isExpanded ? 180 : 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="overflow-hidden"
            variants={filterContentVariants}
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
          >
            <div className="px-6 pb-6">
              <div className="space-y-5">
                <motion.div className="relative group" variants={itemVariants}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch
                      className={`h-6 w-6 transition-all duration-300 ${
                        focusedInput === "search"
                          ? "text-blue-300 scale-110"
                          : "text-blue-200 group-hover:text-blue-300"
                      }`}
                    />
                  </div>
                  <motion.input
                    type="text"
                    className="block w-full pl-12 pr-12 py-4 border-2 border-white/10 rounded-xl leading-5 bg-white/10 backdrop-blur-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-500/50"
                    placeholder="Cari peraturan berdasarkan judul atau nomor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setFocusedInput("search")}
                    onBlur={() => setFocusedInput(null)}
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                  {searchTerm && (
                    <motion.button
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-200 hover:text-white transition-colors duration-300"
                      onClick={() => setSearchTerm("")}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <FaTimes className="h-6 w-6" />
                    </motion.button>
                  )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <motion.div
                    className="relative group"
                    variants={itemVariants}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaFileAlt
                        className={`h-5 w-5 transition-all duration-300 ${
                          focusedInput === "jenis"
                            ? "text-blue-300 scale-110"
                            : "text-blue-200 group-hover:text-blue-300"
                        }`}
                      />
                    </div>
                    <motion.select
                      className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                        jenisPeraturanFilter
                          ? "border-blue-500 bg-blue-900/30 focus:ring-blue-500 shadow-sm"
                          : "border-white/10 focus:ring-blue-500 group-hover:border-blue-500/50"
                      }`}
                      value={jenisPeraturanFilter}
                      onChange={(e) => setJenisPeraturanFilter(e.target.value)}
                      onFocus={() => setFocusedInput("jenis")}
                      onBlur={() => setFocusedInput(null)}
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <option value="" className="bg-gray-800">
                        Pilih Jenis Peraturan
                      </option>
                      <option value="uu" className="bg-gray-800">
                        Undang-Undang
                      </option>
                      <option value="pp" className="bg-gray-800">
                        Peraturan Pemerintah
                      </option>
                      <option value="perpres" className="bg-gray-800">
                        Peraturan Presiden
                      </option>
                      <option value="permen" className="bg-gray-800">
                        Peraturan Menteri
                      </option>
                      <option value="perda" className="bg-gray-800">
                        Peraturan Daerah
                      </option>
                      <option value="perban" className="bg-gray-800">
                        Peraturan Badan
                      </option>
                      <option value="perka" className="bg-gray-800">
                        Peraturan Kepala
                      </option>
                      <option value="kepka" className="bg-gray-800">
                        Keputusan Kepala
                      </option>
                      <option value="persesma" className="bg-gray-800">
                        Peraturan Sekretaris Utama
                      </option>
                      <option value="se" className="bg-gray-800">
                        Surat Edaran
                      </option>
                      <option value="lainnya" className="bg-gray-800">
                        Lainnya
                      </option>
                    </motion.select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-blue-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative group"
                    variants={itemVariants}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaTag
                        className={`h-5 w-5 transition-all duration-300 ${
                          focusedInput === "kategori"
                            ? "text-blue-300 scale-110"
                            : "text-blue-200 group-hover:text-blue-300"
                        }`}
                      />
                    </div>
                    <motion.select
                      className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                        kategoriFilter
                          ? "border-blue-500 bg-blue-900/30 focus:ring-blue-500 shadow-sm"
                          : "border-white/10 focus:ring-blue-500 group-hover:border-blue-500/50"
                      }`}
                      value={kategoriFilter}
                      onChange={(e) => setKategoriFilter(e.target.value)}
                      onFocus={() => setFocusedInput("kategori")}
                      onBlur={() => setFocusedInput(null)}
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <option value="" className="bg-gray-800">
                        Semua Kategori
                      </option>
                      <option value="angka kredit" className="bg-gray-800">
                        Angka Kredit
                      </option>
                      <option value="disiplin pegawai" className="bg-gray-800">
                        Disiplin Pegawai
                      </option>
                      <option
                        value="perpindahan pegawai"
                        className="bg-gray-800"
                      >
                        Perpindahan Pegawai
                      </option>
                      <option
                        value="pernikahan & perceraian pns"
                        className="bg-gray-800"
                      >
                        Pernikahan & Perceraian PNS
                      </option>
                      <option value="cuti" className="bg-gray-800">
                        Cuti
                      </option>
                      <option
                        value="izin & tugas belajar"
                        className="bg-gray-800"
                      >
                        Izin & Tugas Belajar
                      </option>
                      <option value="pensiun" className="bg-gray-800">
                        Pensiun
                      </option>
                      <option
                        value="penilaian kinerja pns"
                        className="bg-gray-800"
                      >
                        Penilaian Kinerja PNS
                      </option>
                      <option value="jaminan kesehatan" className="bg-gray-800">
                        Jaminan Kesehatan
                      </option>
                      <option value="kompetensi jfa" className="bg-gray-800">
                        Kompetensi JFA
                      </option>
                      <option
                        value="kenaikan pangkat pns"
                        className="bg-gray-800"
                      >
                        Kenaikan Pangkat PNS
                      </option>
                      <option value="lainnya" className="bg-gray-800">
                        Lainnya
                      </option>
                    </motion.select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-blue-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative group"
                    variants={itemVariants}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaCalendarAlt
                        className={`h-5 w-5 transition-all duration-300 ${
                          focusedInput === "tahun"
                            ? "text-blue-300 scale-110"
                            : "text-blue-200 group-hover:text-blue-300"
                        }`}
                      />
                    </div>
                    <motion.select
                      className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                        tahunFilter
                          ? "border-blue-500 bg-blue-900/30 focus:ring-blue-500 shadow-sm"
                          : "border-white/10 focus:ring-blue-500 group-hover:border-blue-500/50"
                      }`}
                      value={tahunFilter}
                      onChange={(e) => setTahunFilter(e.target.value)}
                      onFocus={() => setFocusedInput("tahun")}
                      onBlur={() => setFocusedInput(null)}
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <option value="" className="bg-gray-800">
                        Semua Tahun
                      </option>
                      {availableYears.length > 0 ? (
                        availableYears.map((year) => (
                          <option
                            key={year}
                            value={year}
                            className="bg-gray-800"
                          >
                            {year}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled className="bg-gray-800">
                          Tidak ada data tahun
                        </option>
                      )}
                    </motion.select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-blue-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="flex justify-center mt-2"
                  variants={itemVariants}
                >
                  <motion.button
                    className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={resetFilters}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaUndo className="mr-2" />
                    Reset Filter
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Komponen PeraturanList
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
  const [tanggalTerbaru, setTanggalTerbaru] = useState(null);
  const [showTanggalTerbaru, setShowTanggalTerbaru] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (peraturans.length > 0) {
      const sortedPeraturans = [...peraturans].sort((a, b) => {
        return new Date(b.tanggal_ditetapkan) - new Date(a.tanggal_ditetapkan);
      });

      setTanggalTerbaru(sortedPeraturans[0]);

      setShowTanggalTerbaru(true);
      const timer = setTimeout(() => {
        setShowTanggalTerbaru(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [peraturans]);

  const bgVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        variants={bgVariants}
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>

        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "loop",
          }}
        ></motion.div>
      </motion.div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <motion.div
          className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
        >
          <AnimatePresence>
            {showTanggalTerbaru && tanggalTerbaru && (
              <motion.div
                className="absolute bottom-4 right-4 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-4 max-w-xs transform transition-all duration-300 hover:scale-105 border border-white/20">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/30 flex items-center justify-center mr-2">
                      <svg
                        className="w-4 h-4 text-cyan-300"
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
                    <h3 className="text-sm font-bold text-white">
                      Peraturan Terbaru
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-white truncate">
                    {tanggalTerbaru.judul}
                  </p>
                  <p className="text-xs text-blue-200 mt-1">
                    Ditetapkan:{" "}
                    {new Date(
                      tanggalTerbaru.tanggal_ditetapkan
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="inline-flex items-center rounded-md bg-blue-500/30 px-2 py-1 text-[10px] font-medium text-blue-200">
                      {parseKategori(tanggalTerbaru.kategori)}
                    </span>
                    <button
                      onClick={() => handleViewDocument(tanggalTerbaru)}
                      className="text-xs text-cyan-300 hover:text-cyan-100 font-medium"
                    >
                      Lihat
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="lg:columns-2 columns-1 gap-4">
            {loading ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
                <p className="text-white text-lg font-medium">
                  Memuat data peraturan...
                </p>
                <p className="text-blue-200 text-sm mt-2">
                  Mohon tunggu sebentar
                </p>
              </div>
            ) : filteredPeraturans.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-12">
                <div className="mb-4 text-cyan-400">
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
                <p className="text-white text-lg font-medium">
                  {peraturans.length === 0
                    ? "Belum ada data peraturan"
                    : "Tidak ada peraturan yang sesuai dengan filter"}
                </p>
                <p className="text-blue-200 text-sm mt-2 max-w-md text-center">
                  {peraturans.length === 0
                    ? "Silakan tambahkan peraturan baru menggunakan tombol '+' di bagian bawah"
                    : "Coba ubah filter atau reset untuk melihat semua peraturan"}
                </p>
                {/* {peraturans.length === 0 && isAdmin && (
                  <motion.button
                    onClick={() => setShowAddData(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                )} */}
              </div>
            ) : (
              filteredPeraturans.map((peraturan) => (
                <motion.div
                  key={peraturan.id}
                  className="relative w-full break-inside-avoid mb-4 border p-4 border-white/20 shadow rounded-md bg-white/10 hover:shadow-md transition-all duration-300 hover:border-cyan-300 group"
                  variants={itemVariants}
                >
                  <span className="absolute top-2 right-2 inline-flex items-center rounded-md bg-blue-500/30 px-2 py-1 text-[10px] font-medium text-blue-200 uppercase transition-colors duration-300 group-hover:bg-blue-500/40">
                    {parseKategori(peraturan.kategori)}
                  </span>
                  <span className="absolute bottom-2 right-2 inline-flex items-center rounded-md bg-blue-500/30 px-2 py-1 text-[10px] font-medium text-blue-200 uppercase transition-colors duration-300 group-hover:bg-blue-500/40">
                    {formatTanggal(peraturan.tanggal_ditetapkan)}
                  </span>
                  <p className="text-xs text-blue-200 uppercase transition-colors duration-300 group-hover:text-cyan-300">
                    {peraturan.nomor}
                  </p>
                  <h1 className="text-base font-medium text-white mt-1 uppercase transition-colors duration-300 group-hover:text-cyan-200">
                    {peraturan.judul}
                  </h1>
                  <p className="text-[10px] text-blue-200 font-semibold mt-1 uppercase transition-colors duration-300 group-hover:text-cyan-300">
                    {peraturan.instansi_pembuat}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <motion.button
                      onClick={() => handleViewDocument(peraturan)}
                      className="inline-flex items-center rounded-md bg-green-500/30 px-3 py-1 text-xs font-medium text-green-200 hover:bg-green-500/40 transition-all duration-300 hover:shadow-sm transform hover:-translate-y-0.5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                    </motion.button>
                    <motion.button
                      onClick={() => handleEditPeraturan(peraturan)}
                      className="inline-flex items-center rounded-md bg-amber-500/30 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/40 transition-all duration-300 hover:shadow-sm transform hover:-translate-y-0.5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeletePeraturan(peraturan.id)}
                      className="inline-flex items-center rounded-md bg-red-500/30 px-3 py-1 text-xs font-medium text-red-200 hover:bg-red-500/40 transition-all duration-300 hover:shadow-sm transform hover:-translate-y-0.5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Komponen ViewDocumentModal
const ViewDocumentModal = ({
  showViewDocument,
  setShowViewDocument,
  currentDocument,
  handleDownloadDocument,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setZoomLevel(100);
    setIsLoading(true);
    if (showViewDocument) {
      setIsAnimating(true);
    }
  }, [currentDocument, showViewDocument]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setShowViewDocument(false), 300);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!showViewDocument || !currentDocument) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <AnimatePresence>
      {showViewDocument && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>
            <motion.div
              className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -30, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl"
              animate={{
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "loop",
              }}
            ></motion.div>
          </motion.div>

          <motion.div
            className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/20 ${
              isFullscreen ? "fixed inset-4 max-h-none max-w-none z-50" : ""
            }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-800/50 to-indigo-800/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white truncate max-w-md">
                {currentDocument.judul}
              </h3>
              <div className="flex space-x-2">
                {currentDocument.nama_file &&
                  currentDocument.nama_file.toLowerCase().endsWith(".pdf") && (
                    <>
                      <motion.button
                        onClick={handleZoomOut}
                        className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
                        title="Zoom Out"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MagnifyingGlassMinusIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        onClick={handleZoomIn}
                        className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
                        title="Zoom In"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MagnifyingGlassPlusIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
                        title="Fullscreen"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <ArrowsPointingOutIcon className="h-5 w-5" />
                      </motion.button>
                    </>
                  )}
                <motion.button
                  onClick={() => handleDownloadDocument(currentDocument)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Download
                </motion.button>
                <motion.button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
                  title="Close"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 relative">
              {isLoading &&
                currentDocument.nama_file &&
                currentDocument.nama_file.toLowerCase().endsWith(".pdf") && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20 z-10">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-3"></div>
                      <p className="text-blue-200">Memuat dokumen...</p>
                    </div>
                  </div>
                )}

              <div className="h-full">
                {currentDocument.nama_file &&
                currentDocument.nama_file.toLowerCase().endsWith(".pdf") ? (
                  <div className="relative h-full">
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                      {zoomLevel}%
                    </div>
                    <iframe
                      src={`http://localhost:8080/api/peraturan/file/${currentDocument.id}#view=FitH&toolbar=0&navpanes=0&scrollbar=0&zoom=${zoomLevel}`}
                      className="w-full h-full border-0 rounded"
                      title={currentDocument.judul}
                      onLoad={handleIframeLoad}
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: "top center",
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-white/10">
                    <div className="bg-blue-500/20 p-4 rounded-full mb-6">
                      <DocumentIcon className="h-16 w-16 text-blue-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Pratinjau Tidak Tersedia
                    </h3>
                    <p className="text-blue-200 mb-6 text-center max-w-md">
                      Dokumen ini tidak dapat dipratinjau di browser. Silakan
                      download untuk melihat kontennya.
                    </p>
                    <motion.button
                      onClick={() => handleDownloadDocument(currentDocument)}
                      className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Download
                      Dokumen
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-b-2xl">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="inline-block w-20 font-medium text-blue-200">
                      Nomor:
                    </span>
                    <span className="text-white font-medium">
                      {currentDocument.nomor}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-20 font-medium text-blue-200">
                      Instansi:
                    </span>
                    <span className="text-white">
                      {currentDocument.instansi_pembuat}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="inline-block w-20 font-medium text-blue-200">
                      Tanggal:
                    </span>
                    <span className="text-white font-medium">
                      {new Date(
                        currentDocument.tanggal_ditetapkan
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-20 font-medium text-blue-200">
                      Jenis:
                    </span>
                    <span className="inline-block px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-medium">
                      {currentDocument.jenis_peraturan}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function PeraturanPage() {
  // State untuk sidebar dan UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isAdmin = useAuth();

  // State untuk form
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const [showAddData, setShowAddData] = useState(false);

  // State untuk kategori (multiple select)
  const [selectedKategoris, setSelectedKategoris] = useState([]);

  // State untuk edit
  const [showEditData, setShowEditData] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [editFileName, setEditFileName] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editSelectedKategoris, setEditSelectedKategoris] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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
  const [documentLoading, setDocumentLoading] = useState(false);

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisPeraturanFilter, setJenisPeraturanFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState("");
  const [filteredPeraturans, setFilteredPeraturans] = useState([]);

  // State untuk data FAQ
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);

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

      const response = await axios.get(
        `http://localhost:8080/api/peraturan/filter?${params.toString()}`
      );
      setPeraturans(response.data.data || []);
    } catch (error) {
      console.error("Error fetching peraturans:", error);
      setSubmitMessage({
        type: "error",
        text: "Gagal mengambil data peraturan",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data FAQ dari backend
  const fetchFaqs = async () => {
    try {
      setFaqsLoading(true);
      const response = await axios.get("http://localhost:8080/api/faq");
      setFaqs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setFaqsLoading(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    setIsMounted(true);
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

      const response = await axios.post(
        "http://localhost:8080/api/peraturan",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitMessage({
        type: "success",
        text: "Data peraturan berhasil disimpan!",
      });
      // Reset form
      document.getElementById("formPeraturan").reset();
      setFileName("");
      setSelectedFile(null);
      setSelectedKategoris([]);
      // Tutup modal setelah 1.5 detik
      setTimeout(() => {
        setShowAddData(false);
        setSubmitMessage({ type: "", text: "" });
        // Refresh data
        fetchPeraturans();
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage({
        type: "error",
        text: error.response?.data?.error || "Gagal menyimpan data peraturan",
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
      setSubmitMessage({
        type: "error",
        text: "Gagal mengunduh dokumen",
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

  // Fungsi untuk handle delete
  const handleDeletePeraturan = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus peraturan ini?")) {
      try {
        // Pastikan ID adalah string
        const idStr = String(id);
        console.log("Deleting peraturan with ID:", idStr);
        await axios.delete(`http://localhost:8080/api/peraturan/${idStr}`);
        setSubmitMessage({
          type: "success",
          text: "Peraturan berhasil dihapus!",
        });
        // Refresh data setelah delete
        fetchPeraturans();
      } catch (error) {
        console.error("Error deleting peraturan:", error);
        if (error.response) {
          if (error.response.status === 404) {
            setSubmitMessage({
              type: "error",
              text: "Endpoint tidak ditemukan. Pastikan backend sudah berjalan dengan benar.",
            });
          } else {
            setSubmitMessage({
              type: "error",
              text: error.response.data?.error || "Gagal menghapus peraturan",
            });
          }
        } else {
          setSubmitMessage({
            type: "error",
            text: "Tidak dapat terhubung ke server",
          });
        }
      }
    }
  };

  // Fungsi untuk handle edit - menggunakan data yang sudah ada di state
  const handleEditPeraturan = (peraturan) => {
    // Gunakan data yang sudah ada di state peraturans
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

      // Pastikan ID adalah string
      const idStr = String(currentEditData.id);
      console.log("Updating peraturan with ID:", idStr);
      const response = await axios.put(
        `http://localhost:8080/api/peraturan/${idStr}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitMessage({
        type: "success",
        text: "Peraturan berhasil diperbarui!",
      });

      setTimeout(() => {
        setShowEditData(false);
        setSubmitMessage({ type: "", text: "" });
        // Refresh data setelah update
        fetchPeraturans();
      }, 1500);
    } catch (error) {
      console.error("Error updating peraturan:", error);
      if (error.response) {
        if (error.response.status === 404) {
          setSubmitMessage({
            type: "error",
            text: "Endpoint tidak ditemukan. Pastikan backend sudah berjalan dengan benar.",
          });
        } else {
          setSubmitMessage({
            type: "error",
            text: error.response.data?.error || "Gagal memperbarui peraturan",
          });
        }
      } else {
        setSubmitMessage({
          type: "error",
          text: "Tidak dapat terhubung ke server",
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

  // Di komponen Peraturan, tambahkan fungsi untuk menghitung statistik kategori
  const getKategoriStats = () => {
    const kategoriCount = {};
    let total = 0;

    // Hitung jumlah peraturan per kategori
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

    // Ubah menjadi array dan tambahkan persentase
    return Object.entries(kategoriCount)
      .map(([kategori, jumlah]) => ({
        kategori,
        jumlah,
        persentase: total > 0 ? Math.round((jumlah / total) * 100) : 0,
      }))
      .sort((a, b) => b.jumlah - a.jumlah); // Urutkan dari yang terbanyak
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

  // Variabel animasi untuk container utama
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Variabel animasi untuk setiap elemen
  const itemVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Variabel animasi untuk background
  const bgVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  // Variabel animasi untuk tombol floating
  const floatingButtonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.8,
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <>
      {/* Background animasi */}
      <motion.div
        className="fixed inset-0 z-0"
        variants={bgVariants}
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>

        {/* Animated shapes */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "loop",
          }}
        ></motion.div>
      </motion.div>

      <motion.section
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
      >
        {/* Tombol Add Data - Dipindahkan ke sini agar fixed terhadap viewport */}
        {isAdmin && (
          <motion.button
            onClick={() => setShowAddData(true)}
            className="fixed z-50 right-8 bottom-8 inline-flex items-center px-6 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
            variants={floatingButtonVariants}
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
            whileHover="hover"
            whileTap="tap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-1 mr-3 h-6 w-6"
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
          </motion.button>
        )}

        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          peraturansCount={peraturans.length}
          faqsCount={faqs.length}
        />

        <motion.div className="p-4 md:ml-64" variants={itemVariants}>
          <motion.div
            className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19 bg-white/5 backdrop-blur-sm"
            variants={itemVariants}
          >
            <motion.div variants={itemVariants}>
              <DashboardStats
                peraturansCount={peraturans.length}
                kategoriStats={getKategoriStats()}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <PeraturanList
                setShowAddData={setShowAddData}
                loading={loading}
                filteredPeraturans={filteredPeraturans}
                peraturans={peraturans}
                handleViewDocument={handleViewDocument}
                handleEditPeraturan={handleEditPeraturan}
                handleDeletePeraturan={handleDeletePeraturan}
                parseKategori={parseKategori}
                formatTanggal={formatTanggal}
              />
            </motion.div>

            <Footer />
          </motion.div>
        </motion.div>
      </motion.section>

      <AnimatePresence>
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
          submitMessage={submitMessage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedKategoris={setSelectedKategoris}
        />
      </AnimatePresence>

      <AnimatePresence>
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
          submitMessage={submitMessage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setEditSelectedKategoris={setEditSelectedKategoris}
        />
      </AnimatePresence>

      <AnimatePresence>
        <ViewDocumentModal
          showViewDocument={showViewDocument}
          setShowViewDocument={setShowViewDocument}
          currentDocument={currentDocument}
          handleDownloadDocument={handleDownloadDocument}
        />
      </AnimatePresence>
    </>
  );
}
