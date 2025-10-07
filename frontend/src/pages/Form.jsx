import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import JamDigital from "../components/JamDigital";
import DashboardHeader from "../components/peraturan/DashboardHeader";
import Sidebar from "../components/Sidebar";
import ViewForm from "../components/forms/ViewForm";

const Form = () => {
  // State untuk sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State untuk menyimpan jumlah peraturan
  const [peraturansCount, setPeraturansCount] = useState(0);

  // State untuk data FAQ
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk data suggestions
  const [suggestionsCount, setSuggestionsCount] = useState(0);

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

  // Ambil data peraturan dari backend
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

  // Ambil data FAQ dari backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/faq");
        setFaqs(response.data.data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Ambil data suggestions dari backend
  useEffect(() => {
    const fetchSuggestionsCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/suggestions"
        );
        setSuggestionsCount(response.data.length || 0);
      } catch (error) {
        console.error("Error fetching suggestions count:", error);
        setSuggestionsCount(0);
      }
    };

    fetchSuggestionsCount();
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
          peraturansCount={peraturansCount}
          faqsCount={faqs.length}
          suggestionsCount={suggestionsCount}
        />

        {/* Container untuk konten utama */}
        <div className="p-4 md:ml-64">
          <div className="relative p-4 border-2 border-cyan-200 border-dashed rounded-lg dark:border-gray-700 mt-19">
            {/* Komponen ViewForm */}
            <ViewForm />

            <Footer />
          </div>
        </div>
      </section>
    </>
  );
};

export default Form;
