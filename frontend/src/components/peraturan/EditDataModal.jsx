import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

// Komponen Alert yang dapat digunakan kembali
const Alert = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Tunggu animasi selesai sebelum menghapus dari DOM
  };

  // Auto close setelah 5 detik
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
  // State untuk alert
  // const [alert, setAlert] = useState({
  //   show: false,
  //   type: "",
  //   message: "",
  // });

  // State untuk file yang dipilih
  const [editSelectedFile, setEditSelectedFile] = useState(null);

  // State lokal untuk nama file
  const [editFileNameLocal, setEditFileNameLocal] = useState(
    editFileName || ""
  );

  // State untuk pesan submit
  const [submitMessageLocal, setSubmitMessageLocal] = useState({
    type: "",
    text: "",
  });

  // Tutup alert
  const closeAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  // Reset form saat modal ditutup
  const resetForm = () => {
    setEditSelectedFile(null);
    setEditFileNameLocal("");
    setEditSelectedKategoris([]);
    setSubmitMessageLocal({ type: "", text: "" });
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditData(false);
    resetForm();
  };

  // Effect untuk menampilkan alert ketika submitMessage berubah
  // useEffect(() => {
  //   if (submitMessage.text) {
  //     setAlert({
  //       show: true,
  //       type: submitMessage.type,
  //       message: submitMessage.text,
  //     });
  //   }
  // }, [submitMessage]);

  // Effect untuk memperbarui nama file lokal ketika prop berubah
  useEffect(() => {
    setEditFileNameLocal(editFileName || "");
  }, [editFileName]);

  if (!showEditData || !currentEditData) return null;

  // Filter kategori berdasarkan search term
  const filteredKategoris = staticKategoris.filter((kategori) =>
    kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Alert Component
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )} */}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 opacity-100">
          {/* Header Modal */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-cyan-600"
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
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
              </button>
            </div>
          </div>

          {/* Body Modal */}
          <div className="flex-1 overflow-y-auto p-6">
            <form
              id="formEditPeraturan"
              onSubmit={handleUpdatePeraturan}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-5">
                {/* Nomor Peraturan */}
                <div>
                  <label
                    htmlFor="editNomor"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nomor Peraturan
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
                      id="editNomor"
                      name="nomor"
                      type="text"
                      defaultValue={currentEditData.nomor}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Tanggal Ditetapkan */}
                <div>
                  <label
                    htmlFor="editTanggalDitetapkan"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Tanggal Ditetapkan
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
                      id="editTanggalDitetapkan"
                      name="tanggal_ditetapkan"
                      type="date"
                      defaultValue={
                        new Date(currentEditData.tanggal_ditetapkan)
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Judul */}
                <div>
                  <label
                    htmlFor="editJudul"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Judul Peraturan
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
                      id="editJudul"
                      name="judul"
                      type="text"
                      defaultValue={currentEditData.judul}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Instansi Pembuat */}
                <div>
                  <label
                    htmlFor="editInstansiPembuat"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Instansi Pembuat
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
                      id="editInstansiPembuat"
                      name="instansi_pembuat"
                      type="text"
                      defaultValue={currentEditData.instansi_pembuat}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Jenis Peraturan */}
                <div>
                  <label
                    htmlFor="editJenisPeraturan"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Jenis Peraturan
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <select
                      id="editJenisPeraturan"
                      name="jenis_peraturan"
                      defaultValue={currentEditData.jenis_peraturan}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
                      required
                    >
                      <option value="">Pilih Jenis Peraturan</option>
                      <option value="uu">Undang-Undang</option>
                      <option value="pp">Peraturan Pemerintah</option>
                      <option value="perpres">Peraturan Presiden</option>
                      <option value="permen">Peraturan Menteri</option>
                      <option value="perda">Peraturan Daerah</option>
                      <option value="perban">Peraturan Badan</option>
                      <option value="perka">Peraturan Kepala</option>
                      <option value="kepka">Keputusan Kepala</option>
                      <option value="persesma">
                        Peraturan Sekretaris Utama
                      </option>
                      <option value="se">Surat Edaran</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori Peraturan (Pilih satu atau lebih)
                  </label>

                  {/* Search input */}
                  <div className="relative mb-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Cari kategori..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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

                  {/* Two-column grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                    {filteredKategoris.map((kategori, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <input
                          type="checkbox"
                          name="kategori"
                          className="h-4 w-4 text-cyan-600 rounded focus:ring-cyan-500"
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
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {kategori}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Selected count and actions */}
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {editSelectedKategoris.length} kategori dipilih
                    </span>
                    {editSelectedKategoris.length > 0 && (
                      <button
                        type="button"
                        className="text-xs text-red-600 hover:text-red-800"
                        onClick={() => setEditSelectedKategoris([])}
                      >
                        Hapus semua
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload File */}
                <div>
                  <label
                    htmlFor="editUploadFile"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Upload File (Kosongkan jika tidak ingin mengganti)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
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
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Tampilkan nama file yang dipilih */}
                  {editFileNameLocal && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <svg
                        className="h-4 w-4 mr-1 text-green-500"
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
                      <span className="font-medium">{editFileNameLocal}</span>
                    </div>
                  )}
                </div>

                {/* Keterangan */}
                <div>
                  <label
                    htmlFor="editKeterangan"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Keterangan
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <textarea
                      id="editKeterangan"
                      name="keterangan"
                      rows={3}
                      defaultValue={currentEditData.keterangan || ""}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer Modal */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="formEditPeraturan"
                disabled={isEditing}
                className="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDataModal;
