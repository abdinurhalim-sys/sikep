// TimeoutModal.jsx
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const TimeoutModal = () => {
  const { timeoutModal, updateLastActivity, handleTimeout } = useAuth();

  const handleExtendSession = () => {
    updateLastActivity();
  };

  const handleLogout = () => {
    handleTimeout();
  };

  // Efek untuk menangani timeout otomatis jika pengguna tidak merespons
  useEffect(() => {
    let timer;
    if (timeoutModal) {
      // Set timer untuk logout otomatis setelah 30 detik jika tidak ada respons
      timer = setTimeout(() => {
        handleTimeout();
      }, 30000); // 30 detik
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeoutModal, handleTimeout]);

  // Efek untuk mencegah scrolling saat modal terbuka
  useEffect(() => {
    if (timeoutModal) {
      // Simpan posisi scroll sebelumnya
      const scrollY = window.scrollY;

      // Lock body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Unlock body scroll
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        // Restore scroll position
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      };
    }
  }, [timeoutModal]);

  if (!timeoutModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleTimeout} // Close modal when clicking overlay
      ></div>

      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Modal panel */}
        <div
          className="relative bg-white rounded-lg shadow-xl transform transition-all max-w-lg w-full"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={handleTimeout}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Sesi Anda Akan Berakhir
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Sesi Anda akan berakhir karena tidak ada aktivitas selama 10
                    menit. Apakah Anda ingin melanjutkan sesi?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse space-x-reverse space-x-3">
            <button
              type="button"
              onClick={handleExtendSession}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:text-sm"
            >
              Lanjutkan Sesi
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:text-sm"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeoutModal;
