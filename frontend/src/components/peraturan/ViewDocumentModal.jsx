import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

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

  // Reset zoom level when document changes
  useEffect(() => {
    setZoomLevel(100);
    setIsLoading(true);
    if (showViewDocument) {
      setIsAnimating(true);
    }
  }, [currentDocument, showViewDocument]);

  // Handle animation when modal closes
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setShowViewDocument(false), 300);
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle iframe load complete
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Mapping untuk jenis peraturan
  const jenisPeraturanMap = {
    uu: "Undang-Undang",
    pp: "Peraturan Pemerintah",
    perpres: "Peraturan Presiden",
    permen: "Peraturan Menteri",
    perda: "Peraturan Daerah",
    perban: "Peraturan Badan",
    perka: "Peraturan Kepala",
    kepka: "Keputusan Kepala",
    persesma: "Peraturan Sekretaris Utama",
    se: "Surat Edaran",
    lainnya: "Lainnya",
  };

  if (!showViewDocument || !currentDocument) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col transform transition-transform duration-300 ${
          isAnimating ? "scale-100" : "scale-95"
        } ${isFullscreen ? "fixed inset-4 max-h-none max-w-none z-50" : ""}`}
      >
        {/* Header Modal */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-t-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-md uppercase">
            {currentDocument.judul}
          </h3>
          <div className="flex space-x-2">
            {currentDocument.nama_file &&
              currentDocument.nama_file.toLowerCase().endsWith(".pdf") && (
                <>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow transition-all duration-200 hover:scale-105"
                    title="Zoom Out"
                  >
                    <MagnifyingGlassMinusIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow transition-all duration-200 hover:scale-105"
                    title="Zoom In"
                  >
                    <MagnifyingGlassPlusIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow transition-all duration-200 hover:scale-105"
                    title="Fullscreen"
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            <button
              onClick={() => handleDownloadDocument(currentDocument)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Download
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow transition-all duration-200 hover:scale-105"
              title="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body Modal */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-900 relative">
          {isLoading &&
            currentDocument.nama_file &&
            currentDocument.nama_file.toLowerCase().endsWith(".pdf") && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Memuat dokumen...
                  </p>
                </div>
              </div>
            )}

          <div className="h-full">
            {currentDocument.nama_file &&
            currentDocument.nama_file.toLowerCase().endsWith(".pdf") ? (
              <div className="relative h-full">
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
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
              <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg p-8 shadow-inner">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-6">
                  <DocumentIcon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Pratinjau Tidak Tersedia
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                  Dokumen ini tidak dapat dipratinjau di browser. Silakan
                  download untuk melihat kontennya.
                </p>
                <button
                  onClick={() => handleDownloadDocument(currentDocument)}
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Download
                  Dokumen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="inline-block w-20 font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                  Nomor:
                </span>
                <span className="text-gray-900 dark:text-white font-medium truncate">
                  {currentDocument.nomor}
                </span>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-20 font-medium text-gray-700 dark:text-gray-300 flex-shrink-0 mt-0.5">
                  Instansi:
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-gray-900 dark:text-white break-words uppercase"
                    title={currentDocument.instansi_pembuat}
                  >
                    {currentDocument.instansi_pembuat}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="inline-block w-20 font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                  Tanggal:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
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
                <span className="inline-block w-20 font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                  Jenis:
                </span>
                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium uppercase">
                  {jenisPeraturanMap[currentDocument.jenis_peraturan] ||
                    currentDocument.jenis_peraturan}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentModal;

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MagnifyingGlassPlusIcon,
//   MagnifyingGlassMinusIcon,
//   ArrowsPointingOutIcon,
//   ArrowDownTrayIcon,
//   XMarkIcon,
//   DocumentIcon,
// } from "@heroicons/react/24/outline";

// const ViewDocumentModal = ({
//   showViewDocument,
//   setShowViewDocument,
//   currentDocument,
//   handleDownloadDocument,
// }) => {
//   const [zoomLevel, setZoomLevel] = useState(100);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAnimating, setIsAnimating] = useState(false);

//   // Reset zoom level when document changes
//   useEffect(() => {
//     setZoomLevel(100);
//     setIsLoading(true);
//     if (showViewDocument) {
//       setIsAnimating(true);
//     }
//   }, [currentDocument, showViewDocument]);

//   // Handle animation when modal closes
//   const handleClose = () => {
//     setIsAnimating(false);
//     setTimeout(() => setShowViewDocument(false), 300);
//   };

//   // Handle zoom in
//   const handleZoomIn = () => {
//     setZoomLevel((prev) => Math.min(prev + 10, 200));
//   };

//   // Handle zoom out
//   const handleZoomOut = () => {
//     setZoomLevel((prev) => Math.max(prev - 10, 50));
//   };

//   // Handle fullscreen toggle
//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);
//   };

//   // Handle iframe load complete
//   const handleIframeLoad = () => {
//     setIsLoading(false);
//   };

//   if (!showViewDocument || !currentDocument) return null;

//   // Animation variants
//   const modalVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 25,
//       },
//     },
//     exit: {
//       opacity: 0,
//       scale: 0.9,
//       transition: { duration: 0.2 },
//     },
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.05,
//       transition: { duration: 0.2 },
//     },
//     tap: {
//       scale: 0.95,
//     },
//   };

//   return (
//     <AnimatePresence>
//       {showViewDocument && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
//           {/* Background animasi */}
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>

//             {/* Animated shapes */}
//             <motion.div
//               className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"
//               animate={{
//                 scale: [1, 1.2, 1],
//                 x: [0, 20, 0],
//                 y: [0, -20, 0],
//               }}
//               transition={{
//                 duration: 8,
//                 repeat: Infinity,
//                 repeatType: "reverse",
//               }}
//             ></motion.div>

//             <motion.div
//               className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
//               animate={{
//                 scale: [1, 1.3, 1],
//                 x: [0, -30, 0],
//                 y: [0, 30, 0],
//               }}
//               transition={{
//                 duration: 10,
//                 repeat: Infinity,
//                 repeatType: "reverse",
//               }}
//             ></motion.div>

//             <motion.div
//               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl"
//               animate={{
//                 scale: [1, 1.4, 1],
//                 rotate: [0, 180, 360],
//               }}
//               transition={{
//                 duration: 15,
//                 repeat: Infinity,
//                 repeatType: "loop",
//               }}
//             ></motion.div>
//           </motion.div>

//           <motion.div
//             className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/20 ${
//               isFullscreen ? "fixed inset-4 max-h-none max-w-none z-50" : ""
//             }`}
//             variants={modalVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//           >
//             {/* Header Modal */}
//             <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-800/50 to-indigo-800/50 rounded-t-2xl">
//               <h3 className="text-lg font-bold text-white truncate max-w-md">
//                 {currentDocument.judul}
//               </h3>
//               <div className="flex space-x-2">
//                 {currentDocument.nama_file &&
//                   currentDocument.nama_file.toLowerCase().endsWith(".pdf") && (
//                     <>
//                       <motion.button
//                         onClick={handleZoomOut}
//                         className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
//                         title="Zoom Out"
//                         variants={buttonVariants}
//                         whileHover="hover"
//                         whileTap="tap"
//                       >
//                         <MagnifyingGlassMinusIcon className="h-5 w-5" />
//                       </motion.button>
//                       <motion.button
//                         onClick={handleZoomIn}
//                         className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
//                         title="Zoom In"
//                         variants={buttonVariants}
//                         whileHover="hover"
//                         whileTap="tap"
//                       >
//                         <MagnifyingGlassPlusIcon className="h-5 w-5" />
//                       </motion.button>
//                       <motion.button
//                         onClick={toggleFullscreen}
//                         className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
//                         title="Fullscreen"
//                         variants={buttonVariants}
//                         whileHover="hover"
//                         whileTap="tap"
//                       >
//                         <ArrowsPointingOutIcon className="h-5 w-5" />
//                       </motion.button>
//                     </>
//                   )}
//                 <motion.button
//                   onClick={() => handleDownloadDocument(currentDocument)}
//                   className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-md"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Download
//                 </motion.button>
//                 <motion.button
//                   onClick={handleClose}
//                   className="p-2 rounded-full bg-white/10 text-blue-200 hover:bg-white/20 shadow transition-all duration-200"
//                   title="Close"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </motion.button>
//               </div>
//             </div>

//             {/* Body Modal */}
//             <div className="flex-1 overflow-auto p-4 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 relative">
//               {isLoading &&
//                 currentDocument.nama_file &&
//                 currentDocument.nama_file.toLowerCase().endsWith(".pdf") && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20 z-10">
//                     <div className="text-center">
//                       <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-3"></div>
//                       <p className="text-blue-200">Memuat dokumen...</p>
//                     </div>
//                   </div>
//                 )}

//               <div className="h-full">
//                 {currentDocument.nama_file &&
//                 currentDocument.nama_file.toLowerCase().endsWith(".pdf") ? (
//                   <div className="relative h-full">
//                     <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
//                       {zoomLevel}%
//                     </div>
//                     <iframe
//                       src={`http://localhost:8080/api/peraturan/file/${currentDocument.id}#view=FitH&toolbar=0&navpanes=0&scrollbar=0&zoom=${zoomLevel}`}
//                       className="w-full h-full border-0 rounded"
//                       title={currentDocument.judul}
//                       onLoad={handleIframeLoad}
//                       style={{
//                         transform: `scale(${zoomLevel / 100})`,
//                         transformOrigin: "top center",
//                       }}
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-white/10">
//                     <div className="bg-blue-500/20 p-4 rounded-full mb-6">
//                       <DocumentIcon className="h-16 w-16 text-blue-300" />
//                     </div>
//                     <h3 className="text-xl font-semibold text-white mb-2">
//                       Pratinjau Tidak Tersedia
//                     </h3>
//                     <p className="text-blue-200 mb-6 text-center max-w-md">
//                       Dokumen ini tidak dapat dipratinjau di browser. Silakan
//                       download untuk melihat kontennya.
//                     </p>
//                     <motion.button
//                       onClick={() => handleDownloadDocument(currentDocument)}
//                       className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg"
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                     >
//                       <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Download
//                       Dokumen
//                     </motion.button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer Modal */}
//             <div className="p-4 border-t border-white/10 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-b-2xl">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <span className="inline-block w-20 font-medium text-blue-200">
//                       Nomor:
//                     </span>
//                     <span className="text-white font-medium">
//                       {currentDocument.nomor}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="inline-block w-20 font-medium text-blue-200">
//                       Instansi:
//                     </span>
//                     <span className="text-white">
//                       {currentDocument.instansi_pembuat}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <span className="inline-block w-20 font-medium text-blue-200">
//                       Tanggal:
//                     </span>
//                     <span className="text-white font-medium">
//                       {new Date(
//                         currentDocument.tanggal_ditetapkan
//                       ).toLocaleDateString("id-ID", {
//                         day: "numeric",
//                         month: "long",
//                         year: "numeric",
//                       })}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="inline-block w-20 font-medium text-blue-200">
//                       Jenis:
//                     </span>
//                     <span className="inline-block px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-medium">
//                       {currentDocument.jenis_peraturan}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ViewDocumentModal;
