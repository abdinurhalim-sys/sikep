// ViewDashboard.jsx
import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UserGroupIcon,
  FolderIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const ViewDashboard = ({
  stats,
  recentData,
  loading,
  refreshing,
  onRefresh,
}) => {
  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
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

  // Fungsi untuk mendapatkan warna badge berdasarkan kategori
  const getKategoriColor = (kategori) => {
    const colors = {
      "Angka Kredit": "bg-blue-100 text-blue-800",
      "Disiplin Pegawai": "bg-red-100 text-red-800",
      "Perpindahan Pegawai": "bg-green-100 text-green-800",
      "Pernikahan & Perceraian PNS": "bg-purple-100 text-purple-800",
      Cuti: "bg-yellow-100 text-yellow-800",
      "Izin & Tugas Belajar": "bg-indigo-100 text-indigo-800",
      Pensiun: "bg-pink-100 text-pink-800",
      "Penilaian Kinerja PNS": "bg-cyan-100 text-cyan-800",
      "Jaminan Kesehatan": "bg-emerald-100 text-emerald-800",
      "Kompetensi JFA": "bg-orange-100 text-orange-800",
      "Kenaikan Pangkat PNS": "bg-teal-100 text-teal-800",
      Lainnya: "bg-gray-100 text-gray-800",
    };
    return colors[kategori] || "bg-cyan-100 text-gray-800";
  };

  // Fungsi untuk mendapatkan warna badge berdasarkan bidang
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Dashboard
            <SparklesIcon className="h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
          </h1>
          <p className="text-gray-600">
            Selamat datang di Sistem Informasi Kepegawaian
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-cyan-50 px-4 py-2 rounded-lg">
            <ClockIcon className="h-5 w-5 text-cyan-600" />
            <span className="text-cyan-700 font-medium">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
              refreshing
                ? "bg-gray-200 text-gray-500"
                : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:shadow-md"
            }`}
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Memperbarui..." : "Perbarui"}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-300 absolute top-0 left-0 opacity-50"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-100 absolute top-0 left-0 opacity-30"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
            {/* Card Peraturan */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="rounded-full bg-cyan-100 p-3 group-hover:bg-cyan-200 transition-colors">
                    <DocumentTextIcon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Peraturan
                    </h3>
                    <p className="text-2xl font-bold text-cyan-600">
                      {stats.peraturansCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 group-hover:bg-cyan-50 transition-colors">
                <Link
                  to="/peraturan"
                  className="text-sm font-medium text-cyan-700 hover:text-cyan-900 flex items-center"
                >
                  Lihat semua peraturan
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card FAQ */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">FAQ</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.faqsCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 group-hover:bg-green-50 transition-colors">
                <Link
                  to="/fq"
                  className="text-sm font-medium text-green-700 hover:text-green-900 flex items-center"
                >
                  Lihat semua FAQ
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card Saran */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Saran</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.suggestionsCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 group-hover:bg-purple-50 transition-colors">
                <Link
                  to="/formPage"
                  className="text-sm font-medium text-purple-700 hover:text-purple-900 flex items-center"
                >
                  Lihat semua saran
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Kategori Peraturan Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Statistik Kategori Peraturan
                </h2>
                <ChartBarIcon className="h-5 w-5 text-gray-500" />
              </div>

              {stats.kategoriStats.length > 0 ? (
                <div className="space-y-4">
                  {stats.kategoriStats.map((item, index) => (
                    <div key={index} className="space-y-2 group">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-medium text-gray-700 uppercase group-hover:text-cyan-600 transition-colors">
                          {item.kategori}
                        </span>
                        <span className="text-gray-500">
                          {item.jumlah} ({item.persentase}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out group-hover:from-cyan-400 group-hover:to-blue-400"
                          style={{ width: `${item.persentase}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FolderIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2">Belum ada data kategori peraturan</p>
                </div>
              )}
            </div>

            {/* Aktivitas Terbaru */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Aktivitas Terbaru
                </h2>
                <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500" />
              </div>

              <div className="space-y-4">
                {recentData.recentPeraturans.length > 0 && (
                  <div
                    className="animate-fadeIn"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1 text-cyan-500" />
                      Peraturan Terbaru
                    </h3>
                    <div className="space-y-3">
                      {recentData.recentPeraturans
                        .slice(0, 2)
                        .map((peraturan) => (
                          <div
                            key={peraturan.id}
                            className="flex items-start group"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="h-2 w-2 rounded-full bg-cyan-500 group-hover:animate-pulse"></div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium uppercase text-gray-900 group-hover:text-cyan-600 transition-colors">
                                {peraturan.judul}
                              </p>
                              <div className="mt-1">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${getKategoriColor(
                                    parseKategori(peraturan.kategori)
                                  )}`}
                                >
                                  {parseKategori(peraturan.kategori)}
                                </span>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {formatDate(peraturan.tanggal_ditetapkan)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {recentData.recentFaqs.length > 0 && (
                  <div
                    className="animate-fadeIn"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <QuestionMarkCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                      FAQ Terbaru
                    </h3>
                    <div className="space-y-3">
                      {recentData.recentFaqs.slice(0, 2).map((faq) => (
                        <div key={faq.id} className="flex items-start group">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                              {faq.question}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatDate(faq.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recentData.recentSuggestions.length > 0 && (
                  <div
                    className="animate-fadeIn"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1 text-purple-500" />
                      Saran Terbaru
                    </h3>
                    <div className="space-y-3">
                      {recentData.recentSuggestions
                        .slice(0, 2)
                        .map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-start group"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="h-2 w-2 rounded-full bg-purple-500 group-hover:animate-pulse"></div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                                {suggestion.nama}
                              </p>
                              <div className="flex items-center mt-1">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getBidangColor(
                                    suggestion.bidang
                                  )}`}
                                >
                                  {suggestion.bidang}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatDate(suggestion.tanggal)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {recentData.recentPeraturans.length === 0 &&
                  recentData.recentFaqs.length === 0 &&
                  recentData.recentSuggestions.length === 0 && (
                    <div className="text-center py-6 text-gray-500 animate-fadeIn">
                      <ClockIcon className="h-10 w-10 mx-auto text-gray-300" />
                      <p className="mt-2">Belum ada aktivitas terbaru</p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Recent Data Tables */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Recent Peraturan */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-100 to-blue-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-cyan-600" />
                  Peraturan Terbaru
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentData.recentPeraturans.length > 0 ? (
                  recentData.recentPeraturans.map((peraturan, index) => (
                    <div
                      key={peraturan.id}
                      className="px-6 py-4 hover:bg-cyan-50 transition-colors group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div>
                        <h3 className="text-sm font-medium uppercase text-gray-900 truncate group-hover:text-cyan-600 transition-colors">
                          {peraturan.judul}
                        </h3>
                        <span
                          className={`text-[10px] font-medium uppercase px-2 py-1 rounded-full ${getKategoriColor(
                            parseKategori(peraturan.kategori)
                          )}`}
                        >
                          {parseKategori(peraturan.kategori)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(peraturan.tanggal_ditetapkan)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <DocumentTextIcon className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="mt-2">Belum ada peraturan</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 px-6 py-3">
                <Link
                  to="/peraturan"
                  className="text-sm font-medium text-cyan-700 hover:text-cyan-900 flex items-center group"
                >
                  Lihat semua
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Recent FAQ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-100 to-emerald-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                  FAQ Terbaru
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentData.recentFaqs.length > 0 ? (
                  recentData.recentFaqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="px-6 py-4 hover:bg-green-50 transition-colors group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(faq.created_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <QuestionMarkCircleIcon className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="mt-2">Belum ada FAQ</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3">
                <Link
                  to="/fq"
                  className="text-sm font-medium text-green-700 hover:text-green-900 flex items-center group"
                >
                  Lihat semua
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Recent Suggestions */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-100 to-pink-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Saran Terbaru
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentData.recentSuggestions.length > 0 ? (
                  recentData.recentSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className="px-6 py-4 hover:bg-purple-50 transition-colors group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                          {suggestion.nama}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getBidangColor(
                            suggestion.bidang
                          )}`}
                        >
                          {suggestion.bidang}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(suggestion.tanggal)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <ChatBubbleLeftRightIcon className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="mt-2">Belum ada saran</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3">
                <Link
                  to="/formPage"
                  className="text-sm font-medium text-purple-700 hover:text-purple-900 flex items-center group"
                >
                  Lihat semua
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewDashboard;

// ViewDashboard.jsx
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   ChartBarIcon,
//   DocumentTextIcon,
//   QuestionMarkCircleIcon,
//   ChatBubbleLeftRightIcon,
//   ArrowTrendingUpIcon,
//   ClockIcon,
//   UserGroupIcon,
//   FolderIcon,
//   ArrowPathIcon,
//   SparklesIcon,
// } from "@heroicons/react/24/outline";

// const ViewDashboard = ({
//   stats,
//   recentData,
//   loading,
//   refreshing,
//   onRefresh,
// }) => {
//   // Format tanggal
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString("id-ID", options);
//   };

//   // Fungsi untuk parse kategori dari JSON string
//   const parseKategori = (kategoriStr) => {
//     try {
//       const kategoriArray = JSON.parse(kategoriStr);
//       return Array.isArray(kategoriArray)
//         ? kategoriArray.join(", ")
//         : kategoriStr;
//     } catch (e) {
//       return kategoriStr;
//     }
//   };

//   // Fungsi untuk mendapatkan warna badge berdasarkan kategori
//   const getKategoriColor = (kategori) => {
//     const colors = {
//       "Angka Kredit": "bg-blue-500/30 text-blue-200 border border-blue-400/30",
//       "Disiplin Pegawai": "bg-red-500/30 text-red-200 border border-red-400/30",
//       "Perpindahan Pegawai":
//         "bg-green-500/30 text-green-200 border border-green-400/30",
//       "Pernikahan & Perceraian PNS":
//         "bg-purple-500/30 text-purple-200 border border-purple-400/30",
//       Cuti: "bg-yellow-500/30 text-yellow-200 border border-yellow-400/30",
//       "Izin & Tugas Belajar":
//         "bg-indigo-500/30 text-indigo-200 border border-indigo-400/30",
//       Pensiun: "bg-pink-500/30 text-pink-200 border border-pink-400/30",
//       "Penilaian Kinerja PNS":
//         "bg-cyan-500/30 text-cyan-200 border border-cyan-400/30",
//       "Jaminan Kesehatan":
//         "bg-emerald-500/30 text-emerald-200 border border-emerald-400/30",
//       "Kompetensi JFA":
//         "bg-orange-500/30 text-orange-200 border border-orange-400/30",
//       "Kenaikan Pangkat PNS":
//         "bg-teal-500/30 text-teal-200 border border-teal-400/30",
//       Lainnya: "bg-gray-500/30 text-gray-200 border border-gray-400/30",
//     };
//     return (
//       colors[kategori] ||
//       "bg-cyan-500/30 text-cyan-200 border border-cyan-400/30"
//     );
//   };

//   // Fungsi untuk mendapatkan warna badge berdasarkan bidang
//   const getBidangColor = (bidang) => {
//     const colors = {
//       Umum: "bg-blue-500/30 text-blue-200 border border-blue-400/30",
//       IPP: "bg-green-500/30 text-green-200 border border-green-400/30",
//       APD: "bg-yellow-500/30 text-yellow-200 border border-yellow-400/30",
//       AN: "bg-purple-500/30 text-purple-200 border border-purple-400/30",
//       INVES: "bg-pink-500/30 text-pink-200 border border-pink-400/30",
//       P3A: "bg-indigo-500/30 text-indigo-200 border border-indigo-400/30",
//     };
//     return (
//       colors[bidang] || "bg-gray-500/30 text-gray-200 border border-gray-400/30"
//     );
//   };

//   // Variabel animasi untuk container
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   // Variabel animasi untuk item
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 20,
//       },
//     },
//   };

//   return (
//     <motion.div
//       className="space-y-6"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* Header */}
//       <motion.div
//         className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
//         variants={itemVariants}
//       >
//         <div>
//           <h1 className="text-2xl font-bold text-white flex items-center">
//             Dashboard
//             <SparklesIcon className="h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
//           </h1>
//           <p className="text-blue-200">
//             Selamat datang di Sistem Informasi Kepegawaian
//           </p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
//             <ClockIcon className="h-5 w-5 text-cyan-300" />
//             <span className="text-cyan-200 font-medium">
//               {new Date().toLocaleDateString("id-ID", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </span>
//           </div>
//           <motion.button
//             onClick={onRefresh}
//             disabled={refreshing}
//             className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-300 ${
//               refreshing
//                 ? "bg-white/10 text-white/50"
//                 : "bg-white/10 text-cyan-200 hover:bg-white/20 hover:shadow-md border border-white/20"
//             }`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <ArrowPathIcon
//               className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
//             />
//             <span>{refreshing ? "Memperbarui..." : "Perbarui"}</span>
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center h-64">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
//             <div
//               className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-300 absolute top-0 left-0 opacity-50"
//               style={{ animationDelay: "0.2s" }}
//             ></div>
//             <div
//               className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-200 absolute top-0 left-0 opacity-30"
//               style={{ animationDelay: "0.4s" }}
//             ></div>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       {!loading && (
//         <>
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-3 gap-6"
//             variants={itemVariants}
//           >
//             {/* Card Peraturan */}
//             <motion.div
//               className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300 group"
//               whileHover={{
//                 y: -5,
//                 boxShadow:
//                   "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//               }}
//             >
//               <div className="p-5">
//                 <div className="flex items-center">
//                   <div className="rounded-full bg-cyan-500/20 p-3 group-hover:bg-cyan-500/30 transition-colors">
//                     <DocumentTextIcon className="h-6 w-6 text-cyan-300" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-medium text-white">
//                       Peraturan
//                     </h3>
//                     <p className="text-2xl font-bold text-cyan-300">
//                       {stats.peraturansCount}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 px-5 py-3 group-hover:bg-cyan-500/10 transition-colors border-t border-white/10">
//                 <Link
//                   to="/peraturan"
//                   className="text-sm font-medium text-cyan-300 hover:text-white flex items-center"
//                 >
//                   Lihat semua peraturan
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             </motion.div>

//             {/* Card FAQ */}
//             <motion.div
//               className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300 group"
//               whileHover={{
//                 y: -5,
//                 boxShadow:
//                   "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//               }}
//             >
//               <div className="p-5">
//                 <div className="flex items-center">
//                   <div className="rounded-full bg-green-500/20 p-3 group-hover:bg-green-500/30 transition-colors">
//                     <QuestionMarkCircleIcon className="h-6 w-6 text-green-300" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-medium text-white">FAQ</h3>
//                     <p className="text-2xl font-bold text-green-300">
//                       {stats.faqsCount}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 px-5 py-3 group-hover:bg-green-500/10 transition-colors border-t border-white/10">
//                 <Link
//                   to="/fq"
//                   className="text-sm font-medium text-green-300 hover:text-white flex items-center"
//                 >
//                   Lihat semua FAQ
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             </motion.div>

//             {/* Card Saran */}
//             <motion.div
//               className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300 group"
//               whileHover={{
//                 y: -5,
//                 boxShadow:
//                   "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//               }}
//             >
//               <div className="p-5">
//                 <div className="flex items-center">
//                   <div className="rounded-full bg-purple-500/20 p-3 group-hover:bg-purple-500/30 transition-colors">
//                     <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-300" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-medium text-white">Saran</h3>
//                     <p className="text-2xl font-bold text-purple-300">
//                       {stats.suggestionsCount}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 px-5 py-3 group-hover:bg-purple-500/10 transition-colors border-t border-white/10">
//                 <Link
//                   to="/formPage"
//                   className="text-sm font-medium text-purple-300 hover:text-white flex items-center"
//                 >
//                   Lihat semua saran
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Charts Section */}
//           <motion.div
//             className="grid grid-cols-1 lg:grid-cols-2 gap-6"
//             variants={itemVariants}
//           >
//             {/* Kategori Peraturan Chart */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-white">
//                   Statistik Kategori Peraturan
//                 </h2>
//                 <ChartBarIcon className="h-5 w-5 text-cyan-300" />
//               </div>

//               {stats.kategoriStats.length > 0 ? (
//                 <div className="space-y-4">
//                   {stats.kategoriStats.map((item, index) => (
//                     <div key={index} className="space-y-2 group">
//                       <div className="flex justify-between text-sm">
//                         <span className="font-medium text-white group-hover:text-cyan-300 transition-colors">
//                           {item.kategori}
//                         </span>
//                         <span className="text-blue-200">
//                           {item.jumlah} ({item.persentase}%)
//                         </span>
//                       </div>
//                       <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out group-hover:from-cyan-400 group-hover:to-blue-400"
//                           style={{ width: `${item.persentase}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-blue-200">
//                   <FolderIcon className="h-12 w-12 mx-auto text-blue-300/50" />
//                   <p className="mt-2">Belum ada data kategori peraturan</p>
//                 </div>
//               )}
//             </div>

//             {/* Aktivitas Terbaru */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-white">
//                   Aktivitas Terbaru
//                 </h2>
//                 <ArrowTrendingUpIcon className="h-5 w-5 text-cyan-300" />
//               </div>

//               <div className="space-y-4">
//                 {recentData.recentPeraturans.length > 0 && (
//                   <div>
//                     <h3 className="text-sm font-medium text-blue-200 mb-2 flex items-center">
//                       <DocumentTextIcon className="h-4 w-4 mr-1 text-cyan-300" />
//                       Peraturan Terbaru
//                     </h3>
//                     <div className="space-y-3">
//                       {recentData.recentPeraturans
//                         .slice(0, 2)
//                         .map((peraturan) => (
//                           <div
//                             key={peraturan.id}
//                             className="flex items-start group"
//                           >
//                             <div className="flex-shrink-0 mt-1">
//                               <div className="h-2 w-2 rounded-full bg-cyan-400 group-hover:animate-pulse"></div>
//                             </div>
//                             <div className="ml-3">
//                               <p className="text-sm font-medium uppercase text-white group-hover:text-cyan-300 transition-colors">
//                                 {peraturan.judul}
//                               </p>
//                               <div className="mt-1">
//                                 <span
//                                   className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${getKategoriColor(
//                                     parseKategori(peraturan.kategori)
//                                   )}`}
//                                 >
//                                   {parseKategori(peraturan.kategori)}
//                                 </span>
//                                 <span className="text-xs text-blue-200 mt-1 block">
//                                   {formatDate(peraturan.tanggal_ditetapkan)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 )}

//                 {recentData.recentFaqs.length > 0 && (
//                   <div>
//                     <h3 className="text-sm font-medium text-blue-200 mb-2 flex items-center">
//                       <QuestionMarkCircleIcon className="h-4 w-4 mr-1 text-green-300" />
//                       FAQ Terbaru
//                     </h3>
//                     <div className="space-y-3">
//                       {recentData.recentFaqs.slice(0, 2).map((faq) => (
//                         <div key={faq.id} className="flex items-start group">
//                           <div className="flex-shrink-0 mt-1">
//                             <div className="h-2 w-2 rounded-full bg-green-400 group-hover:animate-pulse"></div>
//                           </div>
//                           <div className="ml-3">
//                             <p className="text-sm font-medium text-white group-hover:text-green-300 transition-colors">
//                               {faq.question}
//                             </p>
//                             <span className="text-xs text-blue-200">
//                               {formatDate(faq.created_at)}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {recentData.recentSuggestions.length > 0 && (
//                   <div>
//                     <h3 className="text-sm font-medium text-blue-200 mb-2 flex items-center">
//                       <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1 text-purple-300" />
//                       Saran Terbaru
//                     </h3>
//                     <div className="space-y-3">
//                       {recentData.recentSuggestions
//                         .slice(0, 2)
//                         .map((suggestion) => (
//                           <div
//                             key={suggestion.id}
//                             className="flex items-start group"
//                           >
//                             <div className="flex-shrink-0 mt-1">
//                               <div className="h-2 w-2 rounded-full bg-purple-400 group-hover:animate-pulse"></div>
//                             </div>
//                             <div className="ml-3">
//                               <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
//                                 {suggestion.nama}
//                               </p>
//                               <div className="flex items-center mt-1">
//                                 <span
//                                   className={`text-xs px-2 py-0.5 rounded-full ${getBidangColor(
//                                     suggestion.bidang
//                                   )}`}
//                                 >
//                                   {suggestion.bidang}
//                                 </span>
//                                 <span className="text-xs text-blue-200 ml-2">
//                                   {formatDate(suggestion.tanggal)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 )}

//                 {recentData.recentPeraturans.length === 0 &&
//                   recentData.recentFaqs.length === 0 &&
//                   recentData.recentSuggestions.length === 0 && (
//                     <div className="text-center py-6 text-blue-200">
//                       <ClockIcon className="h-10 w-10 mx-auto text-blue-300/50" />
//                       <p className="mt-2">Belum ada aktivitas terbaru</p>
//                     </div>
//                   )}
//               </div>
//             </div>
//           </motion.div>

//           {/* Recent Data Tables */}
//           <motion.div
//             className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//             variants={itemVariants}
//           >
//             {/* Recent Peraturan */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
//               <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
//                 <h2 className="text-lg font-semibold text-white flex items-center">
//                   <DocumentTextIcon className="h-5 w-5 mr-2 text-cyan-300" />
//                   Peraturan Terbaru
//                 </h2>
//               </div>
//               <div className="divide-y divide-white/10">
//                 {recentData.recentPeraturans.length > 0 ? (
//                   recentData.recentPeraturans.map((peraturan, index) => (
//                     <div
//                       key={peraturan.id}
//                       className="px-6 py-4 hover:bg-white/5 transition-colors group"
//                     >
//                       <div>
//                         <h3 className="text-sm font-medium uppercase text-white truncate group-hover:text-cyan-300 transition-colors">
//                           {peraturan.judul}
//                         </h3>
//                         <span
//                           className={`text-[10px] font-medium uppercase px-2 py-1 rounded-full ${getKategoriColor(
//                             parseKategori(peraturan.kategori)
//                           )}`}
//                         >
//                           {parseKategori(peraturan.kategori)}
//                         </span>
//                       </div>
//                       <p className="text-xs text-blue-200 mt-1">
//                         {formatDate(peraturan.tanggal_ditetapkan)}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-8 text-center text-blue-200">
//                     <DocumentTextIcon className="h-10 w-10 mx-auto text-blue-300/50" />
//                     <p className="mt-2">Belum ada peraturan</p>
//                   </div>
//                 )}
//               </div>
//               <div className="bg-cyan-500/10 px-6 py-3 border-t border-white/10">
//                 <Link
//                   to="/peraturan"
//                   className="text-sm font-medium text-cyan-300 hover:text-white flex items-center group"
//                 >
//                   Lihat semua
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             </div>

//             {/* Recent FAQ */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
//               <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-green-500/20 to-emerald-500/20">
//                 <h2 className="text-lg font-semibold text-white flex items-center">
//                   <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-green-300" />
//                   FAQ Terbaru
//                 </h2>
//               </div>
//               <div className="divide-y divide-white/10">
//                 {recentData.recentFaqs.length > 0 ? (
//                   recentData.recentFaqs.map((faq, index) => (
//                     <div
//                       key={faq.id}
//                       className="px-6 py-4 hover:bg-white/5 transition-colors group"
//                     >
//                       <h3 className="text-sm font-medium text-white truncate group-hover:text-green-300 transition-colors">
//                         {faq.question}
//                       </h3>
//                       <p className="text-xs text-blue-200 mt-1">
//                         {formatDate(faq.created_at)}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-8 text-center text-blue-200">
//                     <QuestionMarkCircleIcon className="h-10 w-10 mx-auto text-green-300/50" />
//                     <p className="mt-2">Belum ada FAQ</p>
//                   </div>
//                 )}
//               </div>
//               <div className="bg-green-500/10 px-6 py-3 border-t border-white/10">
//                 <Link
//                   to="/fq"
//                   className="text-sm font-medium text-green-300 hover:text-white flex items-center group"
//                 >
//                   Lihat semua
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             </div>

//             {/* Recent Suggestions */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
//               <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
//                 <h2 className="text-lg font-semibold text-white flex items-center">
//                   <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-purple-300" />
//                   Saran Terbaru
//                 </h2>
//               </div>
//               <div className="divide-y divide-white/10">
//                 {recentData.recentSuggestions.length > 0 ? (
//                   recentData.recentSuggestions.map((suggestion, index) => (
//                     <div
//                       key={suggestion.id}
//                       className="px-6 py-4 hover:bg-white/5 transition-colors group"
//                     >
//                       <div className="flex justify-between">
//                         <h3 className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
//                           {suggestion.nama}
//                         </h3>
//                         <span
//                           className={`text-xs px-2 py-1 rounded-full ${getBidangColor(
//                             suggestion.bidang
//                           )}`}
//                         >
//                           {suggestion.bidang}
//                         </span>
//                       </div>
//                       <p className="text-xs text-blue-200 mt-1">
//                         {formatDate(suggestion.tanggal)}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-8 text-center text-blue-200">
//                     <ChatBubbleLeftRightIcon className="h-10 w-10 mx-auto text-purple-300/50" />
//                     <p className="mt-2">Belum ada saran</p>
//                   </div>
//                 )}
//               </div>
//               <div className="bg-purple-500/10 px-6 py-3 border-t border-white/10">
//                 <Link
//                   to="/formPage"
//                   className="text-sm font-medium text-purple-300 hover:text-white flex items-center group"
//                 >
//                   Lihat semua
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </motion.div>
//   );
// };

// export default ViewDashboard;
