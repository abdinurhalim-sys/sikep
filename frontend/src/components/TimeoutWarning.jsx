// TimeoutWarning.jsx
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const TimeoutWarning = () => {
  const { timeoutWarning, updateLastActivity } = useAuth();

  useEffect(() => {
    if (timeoutWarning) {
      const timer = setTimeout(() => {
        // Jika pengguna tidak merespons dalam 1 menit, logout otomatis
        updateLastActivity();
      }, 60000); // 1 menit

      return () => clearTimeout(timer);
    }
  }, [timeoutWarning, updateLastActivity]);

  if (!timeoutWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-lg rounded-md max-w-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Peringatan Sesi!</span> Sesi Anda
              akan berakhir dalam 1 menit karena tidak ada aktivitas.
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={updateLastActivity}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Tetap Aktif
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeoutWarning;
