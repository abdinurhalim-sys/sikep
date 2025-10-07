import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

// Import komponen JamDigital
import JamDigital from "../components/JamDigital";

// Import components
import DashboardHeader from "../components/peraturan/DashboardHeader";
import Sidebar from "../components/Sidebar";
import ViewFq from "../components/f&q/ViewFq";

const Fq = () => {
  // Tambahkan state untuk menyimpan jumlah peraturan
  const [peraturansCount, setPeraturansCount] = useState(0);

  // Tambahkan useEffect untuk mengambil jumlah peraturan
  useEffect(() => {
    const fetchPeraturansCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/peraturan/count"
        );
        setPeraturansCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching peraturans count:", error);
        setPeraturansCount(0);
      }
    };

    fetchPeraturansCount();
  }, []);

  // State untuk sidebar dan UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Tambahkan state untuk data FAQ jika diperlukan
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data FAQ dari backend jika diperlukan
  // Definisikan fungsi fetchFaqs di luar useEffect
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/faq");
      setFaqs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gunakan fetchFaqs di dalam useEffect
  useEffect(() => {
    fetchFaqs();
  }, []);

  // State untuk suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  // Ambil data suggestions dan hitung jumlahnya
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        const response = await axios.get(
          "http://localhost:8080/api/suggestions"
        );
        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Hitung jumlah suggestions dari data yang sudah ada
  const suggestionsCount = suggestions.length;

  return (
    <>
      <section className="">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          peraturansCount={peraturansCount} // Gunakan peraturansCount bukan faqsCount
          // Ganti dengan data FAQ jika diperlukan
          faqsCount={faqs.length}
          suggestionsCount={suggestionsCount}
        />

        {/* Tambahkan container untuk konten utama */}
        <div className="p-4 md:ml-64">
          <div className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19">
            {/* Komponen ViewFq dengan props yang diperlukan */}
            <ViewFq
              faqs={faqs}
              loading={loading}
              toggleSidebar={toggleSidebar}
              fetchFaqs={fetchFaqs} // Tambahkan baris ini
              suggestions={suggestions} // Tambahkan suggestions ke props
              suggestionsLoading={suggestionsLoading} // Tambahkan loading state
            />

            {/* Tambahkan komponen JamDigital jika diperlukan */}
            {/* <JamDigital /> */}

            <Footer />
          </div>
        </div>
      </section>
    </>
  );
};

export default Fq;
