import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api"; // Import instance api

const PejabatStruktural = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, loading, isAuthenticated } = useAuth();

  // Tambahkan state untuk loading autentikasi
  const [authLoading, setAuthLoading] = useState(true);

  const [pejabatList, setPejabatList] = useState([]);
  const [availablePegawai, setAvailablePegawai] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPLTModal, setShowPLTModal] = useState(false);
  const [selectedPejabat, setSelectedPejabat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPegawai, setFilteredPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedAtasan, setSelectedAtasan] = useState("");
  const [pegawaiTerpilih, setPegawaiTerpilih] = useState(null);

  // PLT related states
  const [pltJabatan, setPLTJabatan] = useState("");
  const [pltBidang, setPLTBidang] = useState("");

  // State untuk bawahan berdasarkan bidang
  const [bawahanByBidang, setBawahanByBidang] = useState({});

  // State untuk modal edit
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [editFilteredPegawai, setEditFilteredPegawai] = useState([]);
  const [editSelectedPegawai, setEditSelectedPegawai] = useState(null);

  // Fungsi untuk membuka modal tambah pejabat
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setPegawaiTerpilih(null);
    setSearchTerm("");
    setSelectedPegawai("");
    setSelectedLevel("");
    setSelectedAtasan("");
  };

  // Fungsi untuk membuka modal edit pejabat
  const handleEditPejabat = (pejabat) => {
    setSelectedPejabat(pejabat);
    setSelectedLevel(pejabat.level_struktural?.toString() || "");
    setSelectedAtasan(pejabat.atasan_langsung_id?.toString() || "");
    setEditSelectedPegawai(pejabat);
    setEditSearchTerm(pejabat.nama);
    setShowEditModal(true);
  };

  // Fungsi untuk membuka modal PLT
  const handleManagePLT = (pejabat) => {
    setSelectedPejabat(pejabat);
    if (pejabat.is_plt) {
      setPLTJabatan(pejabat.plt_jabatan || "");
      setPLTBidang(pejabat.plt_bidang || "");
    } else {
      setPLTJabatan("");
      setPLTBidang("");
    }
    setShowPLTModal(true);
  };

  // Fungsi untuk menangani pemilihan pegawai dari hasil pencarian
  const handlePilihPegawai = (pegawai) => {
    setPegawaiTerpilih(pegawai);
    setSelectedPegawai(pegawai.id.toString());
    setSearchTerm("");
  };

  // Fungsi untuk mengubah input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (pegawaiTerpilih) {
      setPegawaiTerpilih(null);
      setSelectedPegawai("");
    }
  };

  // Fungsi untuk menangani pemilihan pegawai dari hasil pencarian di modal edit
  const handleEditPilihPegawai = (pegawai) => {
    setEditSelectedPegawai(pegawai);
    setEditSearchTerm(pegawai.nama);
  };

  // Fungsi untuk mengubah input pencarian di modal edit
  const handleEditSearchChange = (e) => {
    setEditSearchTerm(e.target.value);
    if (editSelectedPegawai) {
      setEditSelectedPegawai(null);
    }
  };

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

  // Mengambil data pejabat struktural dari API
  useEffect(() => {
    // Hanya ambil data jika autentikasi sudah selesai dicek dan pengguna adalah admin
    if (!authLoading && isAdmin && isAuthenticated) {
      const fetchPejabatStruktural = async () => {
        try {
          // PERBAIKAN: Gunakan instance api yang sudah dikonfigurasi
          const response = await api.get("/admin/pejabat-struktural");
          setPejabatList(response.data);

          // Setelah mendapatkan data pejabat, kelompokkan berdasarkan bidang
          const bidangGroups = {};
          response.data.forEach((pejabat) => {
            const bidang = pejabat.bidang || "Tidak ada bidang";
            if (!bidangGroups[bidang]) {
              bidangGroups[bidang] = [];
            }
            bidangGroups[bidang].push(pejabat);
          });
          setBawahanByBidang(bidangGroups);
        } catch (err) {
          console.error("Error fetching pejabat struktural:", err);
          setError(
            err.response?.data?.error || "Failed to fetch pejabat struktural"
          );
        } finally {
          setDataLoading(false);
        }
      };

      const fetchAvailablePegawai = async () => {
        try {
          // PERBAIKAN: Gunakan instance api yang sudah dikonfigurasi
          const response = await api.get("/admin/pejabat-struktural/available");
          setAvailablePegawai(response.data);
          setFilteredPegawai(response.data);
          setEditFilteredPegawai(response.data);
        } catch (err) {
          console.error("Error fetching available employees:", err);
          setError(
            err.response?.data?.error || "Failed to fetch available employees"
          );
        }
      };

      fetchPejabatStruktural();
      fetchAvailablePegawai();
    }
  }, [authLoading, isAdmin, isAuthenticated]);

  // Filter pegawai berdasarkan search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPegawai(availablePegawai);
    } else {
      const filtered = availablePegawai.filter(
        (pegawai) =>
          pegawai.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pegawai.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pegawai.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPegawai(filtered);
    }
  }, [searchTerm, availablePegawai]);

  // Filter pegawai berdasarkan search term di modal edit
  useEffect(() => {
    if (editSearchTerm === "") {
      setEditFilteredPegawai(availablePegawai);
    } else {
      const filtered = availablePegawai.filter(
        (pegawai) =>
          pegawai.nama.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
          pegawai.nip.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
          pegawai.jabatan.toLowerCase().includes(editSearchTerm.toLowerCase())
      );
      setEditFilteredPegawai(filtered);
    }
  }, [editSearchTerm, availablePegawai]);

  // Fungsi untuk menambah pejabat struktural
  const handleSimpanPejabat = async () => {
    if (!selectedPegawai || !selectedLevel) return;

    try {
      // PERBAIKAN: Gunakan instance api yang sudah dikonfigurasi
      // 1. Tambah pejabat struktural baru
      const response = await api.post("/admin/pejabat-struktural", {
        employee_id: parseInt(selectedPegawai),
        level_struktural: parseInt(selectedLevel),
        atasan_id: selectedAtasan ? parseInt(selectedAtasan) : null,
      });

      // 2. Refresh data setelah update
      const updatedResponse = await api.get("/admin/pejabat-struktural");
      setPejabatList(updatedResponse.data);

      // Update available pegawai
      const availableResponse = await api.get(
        "/admin/pejabat-struktural/available"
      );
      setAvailablePegawai(availableResponse.data);
      setFilteredPegawai(availableResponse.data);
      setEditFilteredPegawai(availableResponse.data);

      // Update bawahan by bidang
      const bidangGroups = {};
      updatedResponse.data.forEach((pejabat) => {
        const bidang = pejabat.bidang || "Tidak ada bidang";
        if (!bidangGroups[bidang]) {
          bidangGroups[bidang] = [];
        }
        bidangGroups[bidang].push(pejabat);
      });
      setBawahanByBidang(bidangGroups);

      setShowAddModal(false);
      setPegawaiTerpilih(null);
      setSearchTerm("");
      setSelectedPegawai("");
      setSelectedLevel("");
      setSelectedAtasan("");
    } catch (err) {
      console.error("Error adding pejabat struktural:", err);
      setError(err.response?.data?.error || "Failed to add pejabat struktural");
    }
  };

  // Fungsi untuk mengupdate pejabat struktural
  const handleUpdatePejabat = async () => {
    if (!editSelectedPegawai || !selectedLevel) return;

    try {
      // PERBAIKAN: Gunakan instance api yang sudah dikonfigurasi
      // Cek apakah pegawai berubah
      const isPegawaiChanged = editSelectedPegawai.id !== selectedPejabat.id;

      // 1. Update pejabat struktural
      const response = await api.put(
        `/admin/pejabat-struktural/${selectedPejabat.id}`,
        {
          employee_id: editSelectedPegawai.id,
          level_struktural: parseInt(selectedLevel),
          atasan_id: selectedAtasan ? parseInt(selectedAtasan) : null,
        }
      );

      // 2. Jika pegawai berubah, atur ulang hubungan atasan-bawahan
      if (isPegawaiChanged) {
        // 2a. Dapatkan semua bawahan dari pejabat lama (seluruh hierarki)
        try {
          const bawahanResponse = await api.get(
            `/admin/pejabat-struktural/${selectedPejabat.id}/bawahan`
          );
          if (bawahanResponse.status === 200) {
            const allBawahan = bawahanResponse.data;

            // 2b. Atur ulang atasan untuk setiap bawahan
            for (const bawahan of allBawahan) {
              try {
                let newAtasanId = null;

                // Jika bawahan adalah pejabat struktural dan levelnya lebih rendah dari pejabat baru
                if (
                  bawahan.is_pejabat_struktural &&
                  bawahan.level_struktural >
                    editSelectedPegawai.level_struktural
                ) {
                  // Jika pejabat baru berada di bidang yang sama, atur sebagai atasan
                  if (bawahan.bidang === editSelectedPegawai.bidang) {
                    newAtasanId = editSelectedPegawai.id;
                  } else {
                    // Jika bidang berbeda, cari atasan yang sesuai di bidang yang sama
                    // dengan level yang lebih tinggi atau sama
                    const pejabatDiBidangYangSama = await api.get(
                      "/admin/pejabat-struktural"
                    );
                    if (pejabatDiBidangYangSama.status === 200) {
                      const pejabatList = pejabatDiBidangYangSama.data;
                      const atasanYangTersedia = pejabatList.find(
                        (p) =>
                          p.bidang === bawahan.bidang &&
                          p.level_struktural <= bawahan.level_struktural &&
                          p.id !== bawahan.id // Bukan dirinya sendiri
                      );

                      if (atasanYangTersedia) {
                        newAtasanId = atasanYangTersedia.id;
                      }
                    }
                  }
                } else {
                  // Untuk bawahan non-pejabat, atur ke pejabat baru jika di bidang yang sama
                  if (bawahan.bidang === editSelectedPegawai.bidang) {
                    newAtasanId = editSelectedPegawai.id;
                  }
                }

                // Update atasan untuk bawahan
                if (newAtasanId) {
                  await api.put(
                    `/admin/employees/${bawahan.employee_id}/atasan`,
                    {
                      atasan_id: newAtasanId,
                    }
                  );
                  console.log(
                    `Berhasil mengatur atasan untuk ${bawahan.nama} ke ID: ${newAtasanId}`
                  );
                }
              } catch (err) {
                console.error(
                  `Gagal mengatur atasan untuk ${bawahan.nama}:`,
                  err
                );
              }
            }
          }
        } catch (err) {
          console.error("Gagal mendapatkan data bawahan:", err);
        }

        // 2c. Atur pegawai lama (pejabat yang digantikan) sebagai bawahan pejabat baru
        // jika mereka berada di bidang yang sama dan levelnya lebih rendah
        if (
          selectedPejabat.bidang === editSelectedPegawai.bidang &&
          selectedPejabat.level_struktural <
            editSelectedPegawai.level_struktural
        ) {
          try {
            await api.put(
              `/admin/employees/${selectedPejabat.employee_id}/atasan`,
              {
                atasan_id: editSelectedPegawai.id,
              }
            );
            console.log(
              `Berhasil mengatur atasan untuk ${selectedPejabat.nama} ke ${editSelectedPegawai.nama}`
            );
          } catch (err) {
            console.error(
              `Gagal mengatur atasan untuk ${selectedPejabat.nama}:`,
              err
            );
          }
        }

        // 2d. Atur pegawai di bidang yang sama yang belum memiliki atasan
        // untuk menjadi bawahan pejabat baru jika levelnya lebih rendah
        try {
          const availableResponse = await api.get(
            "/admin/pejabat-struktural/available"
          );
          if (availableResponse.status === 200) {
            const availablePegawai = availableResponse.data;

            // Filter pegawai yang berada di bidang yang sama, belum memiliki atasan,
            // dan levelnya lebih rendah dari pejabat baru
            const pegawaiInSameBidang = availablePegawai.filter(
              (pegawai) =>
                pegawai.bidang === editSelectedPegawai.bidang &&
                !pegawai.atasan_langsung_id &&
                pegawai.level_struktural > editSelectedPegawai.level_struktural
            );

            for (const pegawai of pegawaiInSameBidang) {
              try {
                // Set atasan untuk pegawai ini ke pejabat baru
                await api.put(`/admin/employees/${pegawai.id}/atasan`, {
                  atasan_id: editSelectedPegawai.id,
                });
                console.log(
                  `Berhasil mengatur atasan untuk ${pegawai.nama} ke ${editSelectedPegawai.nama}`
                );
              } catch (err) {
                console.error(
                  `Gagal mengatur atasan untuk ${pegawai.nama}:`,
                  err
                );
              }
            }
          }
        } catch (err) {
          console.error("Gagal mendapatkan data pegawai available:", err);
        }
      }

      // 3. Refresh data setelah update
      const updatedResponse = await api.get("/admin/pejabat-struktural");
      setPejabatList(updatedResponse.data);

      // Update available pegawai
      const availableResponse = await api.get(
        "/admin/pejabat-struktural/available"
      );
      setAvailablePegawai(availableResponse.data);
      setFilteredPegawai(availableResponse.data);
      setEditFilteredPegawai(availableResponse.data);

      // Update bawahan by bidang
      const bidangGroups = {};
      updatedResponse.data.forEach((pejabat) => {
        const bidang = pejabat.bidang || "Tidak ada bidang";
        if (!bidangGroups[bidang]) {
          bidangGroups[bidang] = [];
        }
        bidangGroups[bidang].push(pejabat);
      });
      setBawahanByBidang(bidangGroups);

      // Tampilkan notifikasi sukses
      setNotification({
        show: true,
        type: "success",
        message:
          "Pejabat struktural berhasil diperbarui dan struktur organisasi telah diatur ulang",
      });
      setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 3000);

      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating pejabat struktural:", err);
      setError(
        err.response?.data?.error || "Failed to update pejabat struktural"
      );
    }
  };

  // Fungsi untuk menghapus pejabat struktural
  const handleHapusPejabat = async (id) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus status pejabat struktural?"
      )
    ) {
      try {
        // PERBAIKAN: Gunakan instance api yang sudah dikonfigurasi
        // 1. Hapus pejabat struktural
        const response = await api.delete(`/admin/pejabat-struktural/${id}`);

        // 2. Refresh data setelah update
        const updatedResponse = await api.get("/admin/pejabat-struktural");
        setPejabatList(updatedResponse.data);

        // Update available pegawai
        const availableResponse = await api.get(
          "/admin/pejabat-struktural/available"
        );
        setAvailablePegawai(availableResponse.data);
        setFilteredPegawai(availableResponse.data);
        setEditFilteredPegawai(availableResponse.data);

        // Update bawahan by bidang
        const bidangGroups = {};
        updatedResponse.data.forEach((pejabat) => {
          const bidang = pejabat.bidang || "Tidak ada bidang";
          if (!bidangGroups[bidang]) {
            bidangGroups[bidang] = [];
          }
          bidangGroups[bidang].push(pejabat);
        });
        setBawahanByBidang(bidangGroups);
      } catch (err) {
        console.error("Error removing pejabat struktural:", err);
        setError(
          err.response?.data?.error || "Failed to remove pejabat struktural"
        );
      }
    }
  };

  // Fungsi untuk menyimpan PLT
  const handleSavePLT = async () => {
    if (!selectedPejabat || !pltJabatan || !pltBidang) return;

    try {
      // PERBAIKAN: Gunakan instance api yang sudah dikonfigurasi
      const response = await api.put(`/employees/${selectedPejabat.id}/plt`, {
        plt_jabatan: pltJabatan,
        plt_bidang: pltBidang,
      });

      // Refresh data
      const updatedResponse = await api.get("/admin/pejabat-struktural");
      setPejabatList(updatedResponse.data);

      setShowPLTModal(false);
    } catch (err) {
      console.error("Error updating PLT position:", err);
      setError(err.response?.data?.error || "Failed to update PLT position");
    }
  };

  // Fungsi untuk menghapus PLT
  const handleRemovePLT = async () => {
    if (!selectedPejabat) return;

    try {
      // PERBAIKAN: Gunakan instance api yang sudah dikonfigurasi
      const response = await api.delete(`/employees/${selectedPejabat.id}/plt`);

      // Refresh data
      const updatedResponse = await api.get("/admin/pejabat-struktural");
      setPejabatList(updatedResponse.data);

      setShowPLTModal(false);
    } catch (err) {
      console.error("Error removing PLT position:", err);
      setError(err.response?.data?.error || "Failed to remove PLT position");
    }
  };

  // Navigasi ke halaman bawahan
  const navigateToBawahan = (pejabat) => {
    // Pastikan ID bersih tanpa karakter tambahan
    const cleanId = pejabat.id.toString().split(":")[0];
    navigate(`/pejabat-struktural/${cleanId}/bawahan`);
  };

  // Fungsi untuk mendapatkan label level struktural
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

  // Fungsi untuk mendapatkan bawahan berdasarkan bidang pejabat
  const getBawahanByBidang = (pejabat) => {
    if (!pejabat || !pejabat.bidang) return [];

    const bidang = pejabat.bidang;
    return bawahanByBidang[bidang] || [];
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
            Memuat data pejabat struktural...
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
        {/* Header dengan efek gradient */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Pejabat Struktural
              </h1>
              <p className="text-cyan-100">
                Kelola struktur organisasi dan hierarki pejabat
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleOpenAddModal}
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
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Tambah Pejabat
              </button>
            </div>
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Struktur Organisasi
          </h2>
          <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
              {pejabatList
                .filter((pejabat) => pejabat.level_struktural === 1)
                .map((pejabat) => (
                  <div key={pejabat.id} className="mb-8">
                    {/* Level 1 - Pimpinan Tertinggi */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg p-4 shadow-lg mb-6 w-64 text-center">
                      <div className="font-bold">{pejabat.nama}</div>
                      <div className="text-sm opacity-80">
                        {pejabat.jabatan}
                      </div>
                      {pejabat.is_plt && (
                        <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 inline-block">
                          PLT. {pejabat.plt_jabatan}
                        </div>
                      )}
                    </div>

                    {/* Level 2 - Kepala Bagian */}
                    <div className="flex justify-center space-x-8 mb-6">
                      {pejabatList
                        .filter(
                          (p) =>
                            p.level_struktural === 3 &&
                            p.atasan_langsung_id === pejabat.id
                        )
                        .map((bagian) => (
                          <div
                            key={bagian.id}
                            className="flex flex-col items-center"
                          >
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg p-3 shadow-md w-56 text-center">
                              <div className="font-bold">{bagian.nama}</div>
                              <div className="text-xs opacity-80">
                                {bagian.jabatan}
                              </div>
                              {bagian.is_plt && (
                                <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 inline-block">
                                  PLT. {bagian.plt_jabatan}
                                </div>
                              )}
                            </div>

                            {/* Level 3 - Kepala Subbagian */}
                            <div className="flex justify-center space-x-4 mt-4">
                              {pejabatList
                                .filter(
                                  (p) =>
                                    p.level_struktural === 4 &&
                                    p.atasan_langsung_id === bagian.id
                                )
                                .map((subbagian) => (
                                  <div
                                    key={subbagian.id}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-2 shadow w-48 text-center">
                                      <div className="font-bold text-sm">
                                        {subbagian.nama}
                                      </div>
                                      <div className="text-xs opacity-80">
                                        {subbagian.jabatan}
                                      </div>
                                      {subbagian.is_plt && (
                                        <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 inline-block">
                                          PLT. {subbagian.plt_jabatan}
                                        </div>
                                      )}
                                    </div>

                                    {/* Level 4 - Kepala Seksi */}
                                    <div className="flex justify-center space-x-2 mt-2">
                                      {pejabatList
                                        .filter(
                                          (p) =>
                                            p.level_struktural === 5 &&
                                            p.atasan_langsung_id ===
                                              subbagian.id
                                        )
                                        .map((seksi) => (
                                          <div
                                            key={seksi.id}
                                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg p-2 shadow w-40 text-center"
                                          >
                                            <div className="font-bold text-xs">
                                              {seksi.nama}
                                            </div>
                                            <div className="text-xs opacity-80">
                                              {seksi.jabatan}
                                            </div>
                                            {seksi.is_plt && (
                                              <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 inline-block">
                                                PLT. {seksi.plt_jabatan}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Tabel Data Pejabat Struktural */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
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
                    Bidang
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Atasan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Bawahan di Bidang
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
                {pejabatList.map((pejabat) => (
                  <tr
                    key={pejabat.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                            <span className="text-cyan-800 dark:text-cyan-200 font-medium">
                              {pejabat.nama.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {pejabat.nama}
                            </div>
                            {pejabat.is_plt && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                                PLT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold ">
                          {pejabat.bidang.length > 30
                            ? `${pejabat.bidang.substring(0, 30)}...`
                            : pejabat.bidang}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                        {getLevelLabel(pejabat.level_struktural)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {pejabat.atasan_langsung ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              <span className="text-purple-800 dark:text-purple-200 text-xs font-medium">
                                {pejabat.atasan_langsung.nama.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {pejabat.atasan_langsung.nama}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {getLevelLabel(
                                pejabat.atasan_langsung.level_struktural
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {getBawahanByBidang(pejabat).length}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          pegawai
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigateToBawahan(pejabat)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-150"
                          title="Lihat Bawahan"
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleManagePLT(pejabat)}
                          className={`p-1 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-150 ${
                            pejabat.is_plt
                              ? "text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          }`}
                          title={
                            pejabat.is_plt
                              ? "Edit Jabatan PLT"
                              : "Tetapkan Jabatan PLT"
                          }
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
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditPejabat(pejabat)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
                          title="Edit"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleHapusPejabat(pejabat.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                          title="Hapus"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {pejabatList.length === 0 && (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Belum ada data pejabat struktural
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Silakan tambahkan pejabat struktural untuk memulai.
            </p>
            <div className="mt-6">
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Tambah Pejabat Struktural
              </button>
            </div>
          </div>
        )}

        {/* Modal Tambah Pejabat */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scale-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Tambah Pejabat Struktural
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setPegawaiTerpilih(null);
                      setSearchTerm("");
                    }}
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

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="pegawai-search"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Cari Pegawai
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        id="pegawai-search"
                        placeholder="Cari berdasarkan nama, NIP, atau jabatan..."
                        value={
                          pegawaiTerpilih ? pegawaiTerpilih.nama : searchTerm
                        }
                        onChange={handleSearchChange}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 002 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Dropdown hasil pencarian */}
                    {searchTerm && (
                      <div className="mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto absolute z-10 w-full">
                        {filteredPegawai.length > 0 ? (
                          filteredPegawai.map((pegawai) => (
                            <div
                              key={pegawai.id}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
                              onClick={() => handlePilihPegawai(pegawai)}
                            >
                              <div className="font-medium">{pegawai.nama}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {pegawai.nip} - {pegawai.jabatan}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            Tidak ditemukan pegawai dengan kata kunci "
                            {searchTerm}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Level Struktural
                    </label>
                    <select
                      id="level"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md shadow-sm"
                    >
                      <option value="">-- Pilih Level --</option>
                      <option value="1">Kepala Perwakilan</option>
                      <option value="2">Kepala Bagian Umum</option>
                      <option value="3">Koordinator Pengawas</option>
                      <option value="4">Sub Koordinator Pengawas</option>
                      <option value="5">Staff</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="atasan"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Atasan Langsung (kosongkan jika pimpinan tertinggi)
                    </label>
                    <select
                      id="atasan"
                      value={selectedAtasan}
                      onChange={(e) => setSelectedAtasan(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md shadow-sm"
                    >
                      <option value="">-- Tidak ada atasan --</option>
                      {pejabatList.map((pejabat) => (
                        <option key={pejabat.id} value={pejabat.id}>
                          {pejabat.nama} -{" "}
                          {getLevelLabel(pejabat.level_struktural)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Informasi Penting
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <p>
                            Ketika Anda menambahkan pejabat struktural, semua
                            pegawai di bidang yang sama yang belum memiliki
                            atasan secara otomatis akan menjadi bawahannya.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setPegawaiTerpilih(null);
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSimpanPejabat}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Edit Pejabat */}
        {showEditModal && selectedPejabat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scale-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Edit Pejabat Struktural
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
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

                <div className="space-y-4">
                  {/* Field untuk memilih pegawai */}
                  <div>
                    <label
                      htmlFor="pegawai-search"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Pilih Pegawai
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        id="pegawai-search"
                        placeholder="Cari berdasarkan nama, NIP, atau jabatan..."
                        value={
                          editSelectedPegawai
                            ? editSelectedPegawai.nama
                            : editSearchTerm
                        }
                        onChange={handleEditSearchChange}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 002 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Dropdown hasil pencarian */}
                    {editSearchTerm && (
                      <div className="mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto absolute z-10 w-full">
                        {editFilteredPegawai.length > 0 ? (
                          editFilteredPegawai.map((pegawai) => (
                            <div
                              key={pegawai.id}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
                              onClick={() => handleEditPilihPegawai(pegawai)}
                            >
                              <div className="font-medium">{pegawai.nama}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {pegawai.nip} - {pegawai.jabatan}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            Tidak ditemukan pegawai dengan kata kunci "
                            {editSearchTerm}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Level Struktural
                    </label>
                    <select
                      id="level"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md shadow-sm"
                    >
                      <option value="1">Kepala Perwakilan</option>
                      <option value="2">Kepala Bagian Umum</option>
                      <option value="3">Koordinator Pengawas</option>
                      <option value="4">Sub Koordinator Pengawas</option>
                      <option value="5">Staff</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="atasan"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Atasan Langsung (kosongkan jika pimpinan tertinggi)
                    </label>
                    <select
                      id="atasan"
                      value={selectedAtasan}
                      onChange={(e) => setSelectedAtasan(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm rounded-md shadow-sm"
                    >
                      <option value="">-- Tidak ada atasan --</option>
                      {pejabatList
                        .filter(
                          (p) =>
                            p.id !== selectedPejabat.id &&
                            (editSelectedPegawai
                              ? p.id !== editSelectedPegawai.id
                              : true)
                        )
                        .map((pejabat) => (
                          <option key={pejabat.id} value={pejabat.id}>
                            {pejabat.nama} -{" "}
                            {getLevelLabel(pejabat.level_struktural)}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Informasi Penting
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <p>
                            Jika Anda mengganti pegawai, status pejabat
                            struktural dari pegawai lama akan dihapus dan semua
                            bawahannya akan di-reset. Pegawai baru akan
                            ditetapkan sebagai pejabat struktural dan semua
                            pegawai di bidang yang sama yang belum memiliki
                            atasan akan menjadi bawahannya.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpdatePejabat}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal PLT */}
        {showPLTModal && selectedPejabat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scale-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedPejabat.is_plt
                      ? "Edit Jabatan PLT"
                      : "Tetapkan Jabatan PLT"}
                  </h3>
                  <button
                    onClick={() => setShowPLTModal(false)}
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

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="plt-jabatan"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Jabatan PLT
                    </label>
                    <input
                      type="text"
                      id="plt-jabatan"
                      value={pltJabatan}
                      onChange={(e) => setPLTJabatan(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Contoh: Kepala Perwakilan"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="plt-bidang"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Bidang PLT
                    </label>
                    <input
                      type="text"
                      id="plt-bidang"
                      value={pltBidang}
                      onChange={(e) => setPLTBidang(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Contoh: Perwakilan"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {selectedPejabat.is_plt && (
                    <button
                      onClick={handleRemovePLT}
                      className="px-4 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Hapus PLT
                    </button>
                  )}
                  <button
                    onClick={() => setShowPLTModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSavePLT}
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
      </div>
    </div>
  );
};

export default PejabatStruktural;
