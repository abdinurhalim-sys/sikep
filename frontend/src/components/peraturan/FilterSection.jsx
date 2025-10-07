import React, { useState, useEffect } from "react";
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

  // State untuk mengontrol ekspansi filter
  const [isExpanded, setIsExpanded] = useState(false);

  // State untuk tahun-tahun yang tersedia di database
  const [availableYears, setAvailableYears] = useState([]);

  // Update active filters when props change
  React.useEffect(() => {
    setActiveFilters({
      search: searchTerm !== "",
      jenis: jenisPeraturanFilter !== "",
      kategori: kategoriFilter !== "",
      tahun: tahunFilter !== "",
    });
  }, [searchTerm, jenisPeraturanFilter, kategoriFilter, tahunFilter]);

  // Extract available years from peraturans data
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

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="flex items-center justify-center p-4 mb-4">
      <div className="relative w-full max-w-6xl">
        {/* Background dengan efek glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl"></div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header - Selalu terlihat */}
          <div
            className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white mr-4 shadow-lg">
                <FaFilter className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Filter Peraturan
                </h2>
                <p className="text-sm text-gray-600">
                  Temukan peraturan yang Anda butuhkan
                </p>
              </div>
            </div>

            <div className="flex items-center mt-2 md:mt-0">
              {/* Active filters indicator */}
              {activeFilterCount > 0 && (
                <div className="flex items-center px-4 py-2 bg-cyan-100 rounded-full mr-3">
                  <span className="text-sm font-medium text-cyan-800 mr-2">
                    {activeFilterCount} filter aktif
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetFilters();
                    }}
                    className="text-xs text-cyan-600 hover:text-cyan-800 transition-colors duration-300"
                  >
                    Hapus semua
                  </button>
                </div>
              )}

              {/* Toggle button */}
              <div className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300">
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
          </div>

          {/* Filter content - Ditampilkan hanya saat di-expand */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 pb-6">
              <div className="space-y-5">
                {/* Search full width */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch
                      className={`h-6 w-6 transition-all duration-300 ${
                        focusedInput === "search"
                          ? "text-cyan-500 scale-110"
                          : "text-gray-400 group-hover:text-cyan-500"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl leading-5 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-md"
                    placeholder="Cari peraturan berdasarkan judul atau nomor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setFocusedInput("search")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      onClick={() => setSearchTerm("")}
                    >
                      <FaTimes className="h-6 w-6" />
                    </button>
                  )}
                </div>

                {/* Filter grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Jenis Peraturan */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaFileAlt
                        className={`h-5 w-5 transition-all duration-300 ${
                          focusedInput === "jenis"
                            ? "text-cyan-500 scale-110"
                            : "text-gray-400 group-hover:text-cyan-500"
                        }`}
                      />
                    </div>
                    <select
                      className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                        jenisPeraturanFilter
                          ? "border-cyan-500 bg-cyan-50/50 focus:ring-cyan-500 shadow-sm"
                          : "border-gray-200 focus:ring-cyan-500 group-hover:border-cyan-300 group-hover:shadow-md"
                      }`}
                      value={jenisPeraturanFilter}
                      onChange={(e) => setJenisPeraturanFilter(e.target.value)}
                      onFocus={() => setFocusedInput("jenis")}
                      onBlur={() => setFocusedInput(null)}
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

                  {/* Kategori */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaTag
                        className={`h-5 w-5 transition-all duration-300 ${
                          focusedInput === "kategori"
                            ? "text-cyan-500 scale-110"
                            : "text-gray-400 group-hover:text-cyan-500"
                        }`}
                      />
                    </div>
                    <select
                      className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                        kategoriFilter
                          ? "border-cyan-500 bg-cyan-50/50 focus:ring-cyan-500 shadow-sm"
                          : "border-gray-200 focus:ring-cyan-500 group-hover:border-cyan-300 group-hover:shadow-md"
                      }`}
                      value={kategoriFilter}
                      onChange={(e) => setKategoriFilter(e.target.value)}
                      onFocus={() => setFocusedInput("kategori")}
                      onBlur={() => setFocusedInput(null)}
                    >
                      <option value="">Semua Kategori</option>
                      <option value="angka kredit">Angka Kredit</option>
                      <option value="disiplin pegawai">Disiplin Pegawai</option>
                      <option value="perpindahan pegawai">
                        Perpindahan Pegawai
                      </option>
                      <option value="pernikahan & perceraian pns">
                        Pernikahan & Perceraian PNS
                      </option>
                      <option value="cuti">Cuti</option>
                      <option value="izin & tugas belajar">
                        Izin & Tugas Belajar
                      </option>
                      <option value="pensiun">Pensiun</option>
                      <option value="penilaian kinerja pns">
                        Penilaian Kinerja PNS
                      </option>
                      <option value="jaminan kesehatan">
                        Jaminan Kesehatan
                      </option>
                      <option value="kompetensi jfa">Kompetensi JFA</option>
                      <option value="kenaikan pangkat pns">
                        Kenaikan Pangkat PNS
                      </option>
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

                  {/* Tahun - Diambil dari database */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaCalendarAlt
                        className={`h-5 w-5 transition-all duration-300 ${
                          focusedInput === "tahun"
                            ? "text-cyan-500 scale-110"
                            : "text-gray-400 group-hover:text-cyan-500"
                        }`}
                      />
                    </div>
                    <select
                      className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                        tahunFilter
                          ? "border-cyan-500 bg-cyan-50/50 focus:ring-cyan-500 shadow-sm"
                          : "border-gray-200 focus:ring-cyan-500 group-hover:border-cyan-300 group-hover:shadow-md"
                      }`}
                      value={tahunFilter}
                      onChange={(e) => setTahunFilter(e.target.value)}
                      onFocus={() => setFocusedInput("tahun")}
                      onBlur={() => setFocusedInput(null)}
                    >
                      <option value="">Semua Tahun</option>
                      {availableYears.length > 0 ? (
                        availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Tidak ada data tahun
                        </option>
                      )}
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

                {/* Tombol Reset Filter */}
                <div className="flex justify-center mt-2">
                  <button
                    className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl shadow-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={resetFilters}
                  >
                    <FaUndo className="mr-2" />
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FaSearch,
//   FaTimes,
//   FaCalendarAlt,
//   FaTag,
//   FaFileAlt,
//   FaUndo,
//   FaFilter,
//   FaSlidersH,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";

// const FilterSection = ({
//   searchTerm,
//   setSearchTerm,
//   jenisPeraturanFilter,
//   setJenisPeraturanFilter,
//   kategoriFilter,
//   setKategoriFilter,
//   tahunFilter,
//   setTahunFilter,
//   resetFilters,
//   peraturans,
// }) => {
//   const [focusedInput, setFocusedInput] = useState(null);
//   const [activeFilters, setActiveFilters] = useState({
//     search: searchTerm !== "",
//     jenis: jenisPeraturanFilter !== "",
//     kategori: kategoriFilter !== "",
//     tahun: tahunFilter !== "",
//   });

//   // State untuk mengontrol ekspansi filter
//   const [isExpanded, setIsExpanded] = useState(false);

//   // State untuk tahun-tahun yang tersedia di database
//   const [availableYears, setAvailableYears] = useState([]);

//   // Update active filters when props change
//   React.useEffect(() => {
//     setActiveFilters({
//       search: searchTerm !== "",
//       jenis: jenisPeraturanFilter !== "",
//       kategori: kategoriFilter !== "",
//       tahun: tahunFilter !== "",
//     });
//   }, [searchTerm, jenisPeraturanFilter, kategoriFilter, tahunFilter]);

//   // Extract available years from peraturans data
//   React.useEffect(() => {
//     if (peraturans && peraturans.length > 0) {
//       const years = new Set();
//       peraturans.forEach((peraturan) => {
//         if (peraturan.tanggal_ditetapkan) {
//           const year = new Date(peraturan.tanggal_ditetapkan).getFullYear();
//           years.add(year);
//         }
//       });

//       const sortedYears = Array.from(years)
//         .sort((a, b) => b - a)
//         .map(String);
//       setAvailableYears(sortedYears);
//     }
//   }, [peraturans]);

//   // Count active filters
//   const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//       },
//     },
//   };

//   const filterContentVariants = {
//     expanded: {
//       height: "auto",
//       opacity: 1,
//       transition: {
//         duration: 0.3,
//         staggerChildren: 0.1,
//       },
//     },
//     collapsed: {
//       height: 0,
//       opacity: 0,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.05,
//       transition: {
//         duration: 0.2,
//       },
//     },
//     tap: {
//       scale: 0.95,
//     },
//   };

//   const inputVariants = {
//     focus: {
//       scale: 1.02,
//       transition: {
//         duration: 0.2,
//       },
//     },
//   };

//   return (
//     <motion.div
//       className="flex items-center justify-center p-4 mb-6"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <div className="relative w-full max-w-6xl">
//         {/* Background dengan efek glassmorphism */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-indigo-800/20 backdrop-blur-sm rounded-2xl"></div>

//         {/* Animated background elements - Sama seperti PeraturanList */}
//         <div className="absolute inset-0 overflow-hidden rounded-2xl">
//           <motion.div
//             className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"
//             animate={{
//               scale: [1, 1.2, 1],
//               x: [0, 20, 0],
//               y: [0, -20, 0],
//             }}
//             transition={{
//               duration: 8,
//               repeat: Infinity,
//               repeatType: "reverse",
//             }}
//           ></motion.div>

//           <motion.div
//             className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
//             animate={{
//               scale: [1, 1.3, 1],
//               x: [0, -30, 0],
//               y: [0, 30, 0],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               repeatType: "reverse",
//             }}
//           ></motion.div>

//           <motion.div
//             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl"
//             animate={{
//               scale: [1, 1.4, 1],
//               rotate: [0, 180, 360],
//             }}
//             transition={{
//               duration: 15,
//               repeat: Infinity,
//               repeatType: "loop",
//             }}
//           ></motion.div>
//         </div>

//         <motion.div
//           className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 overflow-hidden"
//           variants={itemVariants}
//         >
//           {/* Header - Selalu terlihat */}
//           <motion.div
//             className="flex flex-col md:flex-row md:items-center justify-between p-5 cursor-pointer"
//             onClick={() => setIsExpanded(!isExpanded)}
//             whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="flex items-center">
//               <motion.div
//                 className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white mr-4 shadow-lg"
//                 whileHover={{ rotate: 10, scale: 1.1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <FaFilter className="text-xl" />
//               </motion.div>
//               <div>
//                 <h2 className="text-xl font-bold text-white">
//                   Filter Peraturan
//                 </h2>
//                 <p className="text-sm text-blue-200">
//                   Temukan peraturan yang Anda butuhkan
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center mt-2 md:mt-0">
//               {/* Active filters indicator */}
//               {activeFilterCount > 0 && (
//                 <motion.div
//                   className="flex items-center px-4 py-2 bg-blue-700/50 rounded-full mr-3 backdrop-blur-sm"
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <span className="text-sm font-medium text-white mr-2">
//                     {activeFilterCount} filter aktif
//                   </span>
//                   <motion.button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       resetFilters();
//                     }}
//                     className="text-xs text-blue-200 hover:text-white transition-colors duration-300"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     Hapus semua
//                   </motion.button>
//                 </motion.div>
//               )}

//               {/* Toggle button */}
//               <motion.div
//                 className="p-3 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 transition-colors duration-300"
//                 whileHover={{ rotate: isExpanded ? 180 : 0, scale: 1.1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* Filter content - Ditampilkan hanya saat di-expand */}
//           <motion.div
//             className="overflow-hidden"
//             variants={filterContentVariants}
//             initial="collapsed"
//             animate={isExpanded ? "expanded" : "collapsed"}
//           >
//             <div className="px-6 pb-6">
//               <div className="space-y-5">
//                 {/* Search full width */}
//                 <motion.div className="relative group" variants={itemVariants}>
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaSearch
//                       className={`h-6 w-6 transition-all duration-300 ${
//                         focusedInput === "search"
//                           ? "text-blue-300 scale-110"
//                           : "text-blue-200 group-hover:text-blue-300"
//                       }`}
//                     />
//                   </div>
//                   <motion.input
//                     type="text"
//                     className="block w-full pl-12 pr-12 py-4 border-2 border-white/10 rounded-xl leading-5 bg-white/10 backdrop-blur-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-500/50"
//                     placeholder="Cari peraturan berdasarkan judul atau nomor..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onFocus={() => setFocusedInput("search")}
//                     onBlur={() => setFocusedInput(null)}
//                     variants={inputVariants}
//                     whileFocus="focus"
//                   />
//                   {searchTerm && (
//                     <motion.button
//                       className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-200 hover:text-white transition-colors duration-300"
//                       onClick={() => setSearchTerm("")}
//                       whileHover={{ scale: 1.2 }}
//                       whileTap={{ scale: 0.8 }}
//                     >
//                       <FaTimes className="h-6 w-6" />
//                     </motion.button>
//                   )}
//                 </motion.div>

//                 {/* Filter grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                   {/* Jenis Peraturan */}
//                   <motion.div
//                     className="relative group"
//                     variants={itemVariants}
//                   >
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                       <FaFileAlt
//                         className={`h-5 w-5 transition-all duration-300 ${
//                           focusedInput === "jenis"
//                             ? "text-blue-300 scale-110"
//                             : "text-blue-200 group-hover:text-blue-300"
//                         }`}
//                       />
//                     </div>
//                     <motion.select
//                       className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
//                         jenisPeraturanFilter
//                           ? "border-blue-500 bg-blue-900/30 focus:ring-blue-500 shadow-sm"
//                           : "border-white/10 focus:ring-blue-500 group-hover:border-blue-500/50"
//                       }`}
//                       value={jenisPeraturanFilter}
//                       onChange={(e) => setJenisPeraturanFilter(e.target.value)}
//                       onFocus={() => setFocusedInput("jenis")}
//                       onBlur={() => setFocusedInput(null)}
//                       variants={inputVariants}
//                       whileFocus="focus"
//                     >
//                       <option value="" className="bg-gray-800">
//                         Pilih Jenis Peraturan
//                       </option>
//                       <option value="uu" className="bg-gray-800">
//                         Undang-Undang
//                       </option>
//                       <option value="pp" className="bg-gray-800">
//                         Peraturan Pemerintah
//                       </option>
//                       <option value="perpres" className="bg-gray-800">
//                         Peraturan Presiden
//                       </option>
//                       <option value="permen" className="bg-gray-800">
//                         Peraturan Menteri
//                       </option>
//                       <option value="perda" className="bg-gray-800">
//                         Peraturan Daerah
//                       </option>
//                       <option value="perban" className="bg-gray-800">
//                         Peraturan Badan
//                       </option>
//                       <option value="perka" className="bg-gray-800">
//                         Peraturan Kepala
//                       </option>
//                       <option value="kepka" className="bg-gray-800">
//                         Keputusan Kepala
//                       </option>
//                       <option value="persesma" className="bg-gray-800">
//                         Peraturan Sekretaris Utama
//                       </option>
//                       <option value="se" className="bg-gray-800">
//                         Surat Edaran
//                       </option>
//                       <option value="lainnya" className="bg-gray-800">
//                         Lainnya
//                       </option>
//                     </motion.select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <svg
//                         className="h-5 w-5 text-blue-200"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     </div>
//                   </motion.div>

//                   {/* Kategori */}
//                   <motion.div
//                     className="relative group"
//                     variants={itemVariants}
//                   >
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                       <FaTag
//                         className={`h-5 w-5 transition-all duration-300 ${
//                           focusedInput === "kategori"
//                             ? "text-blue-300 scale-110"
//                             : "text-blue-200 group-hover:text-blue-300"
//                         }`}
//                       />
//                     </div>
//                     <motion.select
//                       className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
//                         kategoriFilter
//                           ? "border-blue-500 bg-blue-900/30 focus:ring-blue-500 shadow-sm"
//                           : "border-white/10 focus:ring-blue-500 group-hover:border-blue-500/50"
//                       }`}
//                       value={kategoriFilter}
//                       onChange={(e) => setKategoriFilter(e.target.value)}
//                       onFocus={() => setFocusedInput("kategori")}
//                       onBlur={() => setFocusedInput(null)}
//                       variants={inputVariants}
//                       whileFocus="focus"
//                     >
//                       <option value="" className="bg-gray-800">
//                         Semua Kategori
//                       </option>
//                       <option value="angka kredit" className="bg-gray-800">
//                         Angka Kredit
//                       </option>
//                       <option value="disiplin pegawai" className="bg-gray-800">
//                         Disiplin Pegawai
//                       </option>
//                       <option
//                         value="perpindahan pegawai"
//                         className="bg-gray-800"
//                       >
//                         Perpindahan Pegawai
//                       </option>
//                       <option
//                         value="pernikahan & perceraian pns"
//                         className="bg-gray-800"
//                       >
//                         Pernikahan & Perceraian PNS
//                       </option>
//                       <option value="cuti" className="bg-gray-800">
//                         Cuti
//                       </option>
//                       <option
//                         value="izin & tugas belajar"
//                         className="bg-gray-800"
//                       >
//                         Izin & Tugas Belajar
//                       </option>
//                       <option value="pensiun" className="bg-gray-800">
//                         Pensiun
//                       </option>
//                       <option
//                         value="penilaian kinerja pns"
//                         className="bg-gray-800"
//                       >
//                         Penilaian Kinerja PNS
//                       </option>
//                       <option value="jaminan kesehatan" className="bg-gray-800">
//                         Jaminan Kesehatan
//                       </option>
//                       <option value="kompetensi jfa" className="bg-gray-800">
//                         Kompetensi JFA
//                       </option>
//                       <option
//                         value="kenaikan pangkat pns"
//                         className="bg-gray-800"
//                       >
//                         Kenaikan Pangkat PNS
//                       </option>
//                       <option value="lainnya" className="bg-gray-800">
//                         Lainnya
//                       </option>
//                     </motion.select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <svg
//                         className="h-5 w-5 text-blue-200"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     </div>
//                   </motion.div>

//                   {/* Tahun - Diambil dari database */}
//                   <motion.div
//                     className="relative group"
//                     variants={itemVariants}
//                   >
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                       <FaCalendarAlt
//                         className={`h-5 w-5 transition-all duration-300 ${
//                           focusedInput === "tahun"
//                             ? "text-blue-300 scale-110"
//                             : "text-blue-200 group-hover:text-blue-300"
//                         }`}
//                       />
//                     </div>
//                     <motion.select
//                       className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
//                         tahunFilter
//                           ? "border-blue-500 bg-blue-900/30 focus:ring-blue-500 shadow-sm"
//                           : "border-white/10 focus:ring-blue-500 group-hover:border-blue-500/50"
//                       }`}
//                       value={tahunFilter}
//                       onChange={(e) => setTahunFilter(e.target.value)}
//                       onFocus={() => setFocusedInput("tahun")}
//                       onBlur={() => setFocusedInput(null)}
//                       variants={inputVariants}
//                       whileFocus="focus"
//                     >
//                       <option value="" className="bg-gray-800">
//                         Semua Tahun
//                       </option>
//                       {availableYears.length > 0 ? (
//                         availableYears.map((year) => (
//                           <option
//                             key={year}
//                             value={year}
//                             className="bg-gray-800"
//                           >
//                             {year}
//                           </option>
//                         ))
//                       ) : (
//                         <option value="" disabled className="bg-gray-800">
//                           Tidak ada data tahun
//                         </option>
//                       )}
//                     </motion.select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <svg
//                         className="h-5 w-5 text-blue-200"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* Tombol Reset Filter */}
//                 <motion.div
//                   className="flex justify-center mt-2"
//                   variants={itemVariants}
//                 >
//                   <motion.button
//                     className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     onClick={resetFilters}
//                     variants={buttonVariants}
//                     whileHover="hover"
//                     whileTap="tap"
//                   >
//                     <FaUndo className="mr-2" />
//                     Reset Filter
//                   </motion.button>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default FilterSection;
