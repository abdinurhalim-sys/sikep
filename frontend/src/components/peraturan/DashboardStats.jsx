import React from "react";

const DashboardStats = ({ peraturansCount, kategoriStats }) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-5 rounded-sm bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Total Peraturan
          </p>
          <p className="text-3xl font-bold text-gray-600">{peraturansCount}</p>
        </div>
        <div className="p-5 rounded-sm bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Total Kategori
          </p>
          <p className="text-3xl font-bold text-gray-600">
            {kategoriStats.length}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-sm p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Distribusi Peraturan per Kategori
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {kategoriStats.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-medium text-gray-600 dark:text-gray-300 truncate uppercase">
                    {item.kategori}
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                    {item.jumlah}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-300">
                    {item.persentase}%
                  </span>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${item.persentase}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
