// Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import DashboardHeader from "../components/peraturan/DashboardHeader";
import Sidebar from "../components/Sidebar";
import ViewDashboard from "../components/dashboard/ViewDashboard";

const Dashboard = () => {
  // State untuk sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State untuk data statistik
  const [stats, setStats] = useState({
    peraturansCount: 0,
    faqsCount: 0,
    suggestionsCount: 0,
    kategoriStats: [],
  });

  // State untuk data terbaru
  const [recentData, setRecentData] = useState({
    recentPeraturans: [],
    recentFaqs: [],
    recentSuggestions: [],
  });

  // State untuk loading
  const [loading, setLoading] = useState(true);

  // State untuk refresh
  const [refreshing, setRefreshing] = useState(false);

  // State untuk notifikasi
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

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

  // Mengambil data dashboard dari backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      // Ambil data peraturan
      const peraturansRes = await axios.get(
        "http://localhost:8080/api/peraturan"
      );
      const peraturans = peraturansRes.data.data || [];
      const peraturansCount = peraturans.length;

      // Ambil data FAQ
      const faqsRes = await axios.get("http://localhost:8080/api/faq");
      const faqs = faqsRes.data.data || [];
      const faqsCount = faqs.length;

      // Ambil data saran
      const suggestionsRes = await axios.get(
        "http://localhost:8080/api/suggestions"
      );
      const suggestions = suggestionsRes.data || [];
      const suggestionsCount = suggestions.length;

      // Hitung statistik kategori dari data peraturan
      const kategoriCount = {};
      peraturans.forEach((peraturan) => {
        try {
          const kategoriArray = JSON.parse(peraturan.kategori);
          if (Array.isArray(kategoriArray)) {
            kategoriArray.forEach((kat) => {
              kategoriCount[kat] = (kategoriCount[kat] || 0) + 1;
            });
          } else {
            kategoriCount[peraturan.kategori] =
              (kategoriCount[peraturan.kategori] || 0) + 1;
          }
        } catch (e) {
          kategoriCount[peraturan.kategori] =
            (kategoriCount[peraturan.kategori] || 0) + 1;
        }
      });

      // Ubah menjadi array dan tambahkan persentase
      const totalPeraturan = peraturans.length;
      const kategoriStats = Object.entries(kategoriCount)
        .map(([kategori, jumlah]) => ({
          kategori,
          jumlah,
          persentase:
            totalPeraturan > 0
              ? Math.round((jumlah / totalPeraturan) * 100)
              : 0,
        }))
        .sort((a, b) => b.jumlah - a.jumlah);

      // Ambil 5 data terbaru untuk masing-masing
      const recentPeraturans = [...peraturans]
        .sort(
          (a, b) =>
            new Date(b.tanggal_ditetapkan) - new Date(a.tanggal_ditetapkan)
        )
        .slice(0, 5);

      const recentFaqs = [...faqs]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      const recentSuggestions = [...suggestions]
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        .slice(0, 5);

      setStats({
        peraturansCount,
        faqsCount,
        suggestionsCount,
        kategoriStats,
      });

      setRecentData({
        recentPeraturans,
        recentFaqs,
        recentSuggestions,
      });

      // Tampilkan notifikasi sukses
      setNotification({
        show: true,
        message: "Data berhasil diperbarui!",
        type: "success",
      });

      // Sembunyikan notifikasi setelah 3 detik
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Tampilkan notifikasi error
      setNotification({
        show: true,
        message: "Gagal memperbarui data. Silakan coba lagi.",
        type: "error",
      });

      // Sembunyikan notifikasi setelah 3 detik
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchDashboardData();

    // Set interval untuk refresh data setiap 5 menit
    const intervalId = setInterval(fetchDashboardData, 300000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <section className="">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          peraturansCount={stats.peraturansCount}
          faqsCount={stats.faqsCount}
          suggestionsCount={stats.suggestionsCount}
        />

        <div className="p-4 md:ml-64">
          <div className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19">
            {/* Notifikasi */}
            {notification.show && (
              <div
                className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg animate-fadeIn ${
                  notification.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                <div className="flex items-center">
                  <span>{notification.message}</span>
                  <button
                    onClick={() =>
                      setNotification({ show: false, message: "", type: "" })
                    }
                    className="ml-4 text-lg leading-none"
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}

            <ViewDashboard
              stats={stats}
              recentData={recentData}
              loading={loading}
              refreshing={refreshing}
              onRefresh={fetchDashboardData}
            />
            <Footer />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;

// // Dashboard.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import Footer from "../components/Footer";
// import DashboardHeader from "../components/peraturan/DashboardHeader";
// import Sidebar from "../components/Sidebar";
// import ViewDashboard from "../components/dashboard/ViewDashboard";

// const Dashboard = () => {
//   // State untuk sidebar
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // State untuk data statistik
//   const [stats, setStats] = useState({
//     peraturansCount: 0,
//     faqsCount: 0,
//     suggestionsCount: 0,
//     kategoriStats: [],
//   });

//   // State untuk data terbaru
//   const [recentData, setRecentData] = useState({
//     recentPeraturans: [],
//     recentFaqs: [],
//     recentSuggestions: [],
//   });

//   // State untuk loading
//   const [loading, setLoading] = useState(true);

//   // State untuk refresh
//   const [refreshing, setRefreshing] = useState(false);

//   // State untuk notifikasi
//   const [notification, setNotification] = useState({
//     show: false,
//     message: "",
//     type: "",
//   });

//   // State untuk animasi
//   const [isMounted, setIsMounted] = useState(false);

//   // Fungsi untuk toggle sidebar
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // Menutup sidebar saat klik di luar
//   useEffect(() => {
//     setIsMounted(true);

//     const handleClickOutside = (e) => {
//       const sidebar = document.getElementById("logo-sidebar");
//       const toggleButton = document.querySelector(
//         '[data-drawer-toggle="logo-sidebar"]'
//       );
//       if (
//         isSidebarOpen &&
//         sidebar &&
//         !sidebar.contains(e.target) &&
//         !toggleButton.contains(e.target)
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isSidebarOpen]);

//   // Mengambil data dashboard dari backend
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setRefreshing(true);

//       // Ambil data peraturan
//       const peraturansRes = await axios.get(
//         "http://localhost:8080/api/peraturan"
//       );
//       const peraturans = peraturansRes.data.data || [];
//       const peraturansCount = peraturans.length;

//       // Ambil data FAQ
//       const faqsRes = await axios.get("http://localhost:8080/api/faq");
//       const faqs = faqsRes.data.data || [];
//       const faqsCount = faqs.length;

//       // Ambil data saran
//       const suggestionsRes = await axios.get(
//         "http://localhost:8080/api/suggestions"
//       );
//       const suggestions = suggestionsRes.data || [];
//       const suggestionsCount = suggestions.length;

//       // Hitung statistik kategori dari data peraturan
//       const kategoriCount = {};
//       peraturans.forEach((peraturan) => {
//         try {
//           const kategoriArray = JSON.parse(peraturan.kategori);
//           if (Array.isArray(kategoriArray)) {
//             kategoriArray.forEach((kat) => {
//               kategoriCount[kat] = (kategoriCount[kat] || 0) + 1;
//             });
//           } else {
//             kategoriCount[peraturan.kategori] =
//               (kategoriCount[peraturan.kategori] || 0) + 1;
//           }
//         } catch (e) {
//           kategoriCount[peraturan.kategori] =
//             (kategoriCount[peraturan.kategori] || 0) + 1;
//         }
//       });

//       // Ubah menjadi array dan tambahkan persentase
//       const totalPeraturan = peraturans.length;
//       const kategoriStats = Object.entries(kategoriCount)
//         .map(([kategori, jumlah]) => ({
//           kategori,
//           jumlah,
//           persentase:
//             totalPeraturan > 0
//               ? Math.round((jumlah / totalPeraturan) * 100)
//               : 0,
//         }))
//         .sort((a, b) => b.jumlah - a.jumlah);

//       // Ambil 5 data terbaru untuk masing-masing
//       const recentPeraturans = [...peraturans]
//         .sort(
//           (a, b) =>
//             new Date(b.tanggal_ditetapkan) - new Date(a.tanggal_ditetapkan)
//         )
//         .slice(0, 5);

//       const recentFaqs = [...faqs]
//         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//         .slice(0, 5);

//       const recentSuggestions = [...suggestions]
//         .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
//         .slice(0, 5);

//       setStats({
//         peraturansCount,
//         faqsCount,
//         suggestionsCount,
//         kategoriStats,
//       });

//       setRecentData({
//         recentPeraturans,
//         recentFaqs,
//         recentSuggestions,
//       });

//       // Tampilkan notifikasi sukses
//       setNotification({
//         show: true,
//         message: "Data berhasil diperbarui!",
//         type: "success",
//       });

//       // Sembunyikan notifikasi setelah 3 detik
//       setTimeout(() => {
//         setNotification({ show: false, message: "", type: "" });
//       }, 3000);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       // Tampilkan notifikasi error
//       setNotification({
//         show: true,
//         message: "Gagal memperbarui data. Silakan coba lagi.",
//         type: "error",
//       });

//       // Sembunyikan notifikasi setelah 3 detik
//       setTimeout(() => {
//         setNotification({ show: false, message: "", type: "" });
//       }, 3000);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Mengambil data saat komponen dimuat
//   useEffect(() => {
//     fetchDashboardData();

//     // Set interval untuk refresh data setiap 5 menit
//     const intervalId = setInterval(fetchDashboardData, 300000);

//     return () => clearInterval(intervalId);
//   }, []);

//   // Variabel animasi untuk background
//   const bgVariants = {
//     hidden: { scale: 1.1, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       transition: {
//         duration: 1.5,
//         ease: "easeOut",
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Background animasi */}
//       <motion.div
//         className="absolute inset-0 z-0"
//         variants={bgVariants}
//         initial="hidden"
//         animate={isMounted ? "visible" : "hidden"}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br white"></div>

//         {/* Animated shapes */}
//         <motion.div
//           className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"
//           animate={{
//             scale: [1, 1.2, 1],
//             x: [0, 20, 0],
//             y: [0, -20, 0],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//         ></motion.div>

//         <motion.div
//           className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
//           animate={{
//             scale: [1, 1.3, 1],
//             x: [0, -30, 0],
//             y: [0, 30, 0],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//         ></motion.div>

//         <motion.div
//           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl"
//           animate={{
//             scale: [1, 1.4, 1],
//             rotate: [0, 180, 360],
//           }}
//           transition={{
//             duration: 15,
//             repeat: Infinity,
//             repeatType: "loop",
//           }}
//         ></motion.div>
//       </motion.div>

//       <section className="relative z-10">
//         <DashboardHeader
//           isSidebarOpen={isSidebarOpen}
//           toggleSidebar={toggleSidebar}
//         />

//         <Sidebar
//           isSidebarOpen={isSidebarOpen}
//           peraturansCount={stats.peraturansCount}
//           faqsCount={stats.faqsCount}
//           suggestionsCount={stats.suggestionsCount}
//         />

//         <div className="p-4 md:ml-64">
//           <motion.div
//             className="relative p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 mt-19"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             {/* Notifikasi */}
//             <AnimatePresence>
//               {notification.show && (
//                 <motion.div
//                   className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
//                     notification.type === "success"
//                       ? "bg-green-500/90 text-white"
//                       : "bg-red-500/90 text-white"
//                   } backdrop-blur-sm`}
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="flex items-center">
//                     <span>{notification.message}</span>
//                     <button
//                       onClick={() =>
//                         setNotification({ show: false, message: "", type: "" })
//                       }
//                       className="ml-4 text-lg leading-none"
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <ViewDashboard
//               stats={stats}
//               recentData={recentData}
//               loading={loading}
//               refreshing={refreshing}
//               onRefresh={fetchDashboardData}
//             />
//             <Footer />
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Dashboard;
