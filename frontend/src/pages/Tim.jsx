// Tim.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import DashboardHeader from "../components/peraturan/DashboardHeader";
import Sidebar from "../components/Sidebar";
import ViewTim from "../components/tim/ViewTim";

const Tim = () => {
  // State untuk sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State untuk data tim
  const [teamMembers, setTeamMembers] = useState([]);

  // State untuk loading
  const [loading, setLoading] = useState(true);

  // State untuk statistik
  const [stats, setStats] = useState({
    peraturansCount: 0,
    faqsCount: 0,
    suggestionsCount: 0,
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

  // Ambil data statistik untuk sidebar
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [peraturansRes, faqsRes, suggestionsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/peraturan/count"),
          axios.get("http://localhost:8080/api/faq"),
          axios.get("http://localhost:8080/api/suggestions"),
        ]);

        setStats({
          peraturansCount: peraturansRes.data.count || 0,
          faqsCount: faqsRes.data.data?.length || 0,
          suggestionsCount: suggestionsRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Ambil data tim dari backend
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);

        // Coba ambil token dari localStorage
        const token = localStorage.getItem("token");

        // Buat config untuk request dengan atau tanpa token
        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(
          "http://localhost:8080/api/our-tims",
          config
        );

        // Debugging - log response
        // console.log("Response dari API:", response);

        // Pastikan data yang diterima sesuai dengan struktur yang diharapkan
        const teamData = response.data.data || response.data || [];
        // console.log("Data tim yang diterima:", teamData);
        setTeamMembers(teamData);
      } catch (error) {
        console.error("Error fetching team members:", error);

        // Jika error 401, coba tanpa token
        if (error.response && error.response.status === 401) {
          try {
            // console.log("Mencoba mengambil data tanpa token...");
            const response = await axios.get(
              "http://localhost:8080/api/our-tims"
            );
            const teamData = response.data.data || response.data || [];
            // console.log("Data tim yang diterima (tanpa token):", teamData);
            setTeamMembers(teamData);
          } catch (secondError) {
            console.error(
              "Error fetching team members without token:",
              secondError
            );
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
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
            <ViewTim teamMembers={teamMembers} loading={loading} />
            <Footer />
          </div>
        </div>
      </section>
    </>
  );
};

export default Tim;
