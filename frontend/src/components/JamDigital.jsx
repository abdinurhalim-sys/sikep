import React, { useState, useEffect, useRef } from "react";

const JamDigital = () => {
  const [time, setTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDate, setShowDate] = useState(true);
  const [theme, setTheme] = useState("digital"); // digital, analog, minimal
  const [visible, setVisible] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const jamRef = useRef(null);

  // Load posisi dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedPosition = localStorage.getItem("jamPosition");
    const savedTheme = localStorage.getItem("jamTheme");
    const savedVisibility = localStorage.getItem("jamVisibility");

    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedVisibility) {
      setVisible(savedVisibility === "true");
    }

    // Tampilkan tombol untuk membuka kembali jam setelah 5 detik
    const timer = setTimeout(() => {
      setShowToggleButton(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Simpan posisi, tema, dan visibility ke localStorage saat berubah
  useEffect(() => {
    localStorage.setItem("jamPosition", JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    localStorage.setItem("jamTheme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("jamVisibility", visible);
    if (!visible) {
      // Tampilkan tombol untuk membuka kembali setelah 3 detik
      const timer = setTimeout(() => {
        setShowToggleButton(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format waktu
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Format tanggal
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  // Handler drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    if (jamRef.current) {
      const rect = jamRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging && jamRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - jamRef.current.offsetWidth;
      const maxY = window.innerHeight - jamRef.current.offsetHeight;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Fungsi untuk mengganti tema
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Fungsi untuk menutup jam
  const closeClock = () => {
    setVisible(false);
    setShowToggleButton(true);
  };

  // Fungsi untuk membuka jam kembali
  const openClock = () => {
    setVisible(true);
    setShowToggleButton(false);
  };

  // Tema jam analog
  if (theme === "analog" && visible) {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;

    // Hitung derajat rotasi untuk setiap jarum
    const secondDegrees = seconds * 6; // 360/60 = 6 derajat per detik
    const minuteDegrees = minutes * 6 + seconds * 0.1; // 6 derajat per menit + 0.1 derajat per detik
    const hourDegrees = hours * 30 + minutes * 0.5; // 30 derajat per jam + 0.5 derajat per menit

    return (
      <>
        <div
          ref={jamRef}
          className={`fixed z-50 cursor-move select-none transition-transform duration-100 ${
            isDragging ? "scale-110" : "hover:scale-110"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="bg-white rounded-full shadow-xl p-2 w-48 h-48 relative">
            {/* Lingkaran luar jam */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>

            {/* Marking menit */}
            {[...Array(60)].map((_, i) => {
              const angle = i * 6; // 360/60 = 6 derajat per menit
              const isHourMark = i % 5 === 0; // Setiap 5 menit (jam)
              const length = isHourMark ? 10 : 5;
              const width = isHourMark ? 3 : 1;

              // Hitung posisi marking
              const radian = (angle - 90) * (Math.PI / 180);
              const x = 50 + Math.cos(radian) * 40;
              const y = 50 + Math.sin(radian) * 40;

              return (
                <div
                  key={i}
                  className="absolute bg-gray-500 rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${width}px`,
                    height: `${length}px`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    transformOrigin: "center center",
                  }}
                />
              );
            })}

            {/* Angka jam */}
            {[...Array(12)].map((_, i) => {
              const hour = i === 0 ? 12 : i;
              const angle = i * 30; // 360/12 = 30 derajat per jam
              const radian = (angle - 90) * (Math.PI / 180);
              const x = 50 + Math.cos(radian) * 35;
              const y = 50 + Math.sin(radian) * 35;

              return (
                <div
                  key={i}
                  className="absolute text-sm font-bold text-gray-700"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {hour}
                </div>
              );
            })}

            {/* Jarum jam */}
            <div
              className="absolute w-1.5 h-14 bg-gray-800 rounded-full origin-bottom"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
                transformOrigin: "bottom center",
              }}
            ></div>

            {/* Jarum menit */}
            <div
              className="absolute w-1 h-16 bg-gray-700 rounded-full origin-bottom"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
                transformOrigin: "bottom center",
              }}
            ></div>

            {/* Jarum detik */}
            <div
              className="absolute w-0.5 h-18 bg-red-500 rounded-full origin-bottom"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
                transformOrigin: "bottom center",
              }}
            ></div>

            {/* Titik pusat */}
            <div
              className="absolute w-4 h-4 bg-red-500 rounded-full z-10"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          </div>
        </div>

        {/* Tombol untuk mengganti tema */}
        <div className="absolute top-4 right-4 z-50 flex flex-col space-y-2">
          <button
            onClick={() => changeTheme("digital")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "digital"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Digital"
          >
            🕐
          </button>
          <button
            onClick={() => changeTheme("analog")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "analog"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Analog"
          >
            🕒
          </button>
          <button
            onClick={() => changeTheme("minimal")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "minimal"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Minimal"
          >
            ⏱️
          </button>
        </div>
      </>
    );
  }

  // Tema jam minimal
  if (theme === "minimal" && visible) {
    return (
      <>
        <div
          ref={jamRef}
          className={`fixed z-50 cursor-move select-none transition-transform duration-100 ${
            isDragging ? "scale-105" : "hover:scale-105"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="bg-black bg-opacity-70 text-white rounded-lg p-3 min-w-[150px]">
            <div className="text-2xl font-mono">{formatTime(time)}</div>

            {showDate && (
              <div className="text-xs opacity-80 mt-1">{formatDate(time)}</div>
            )}

            {/* Kontrol */}
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setShowDate(!showDate)}
                className="text-xs opacity-70 hover:opacity-100"
              >
                {showDate ? "Sembunyikan" : "Tanggal"}
              </button>
              <button
                onClick={closeClock}
                className="text-xs opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Tombol untuk mengganti tema */}
        <div className="absolute top-4 right-4 z-50 flex flex-col space-y-2">
          <button
            onClick={() => changeTheme("digital")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "digital"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Digital"
          >
            🕐
          </button>
          <button
            onClick={() => changeTheme("analog")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "analog"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Analog"
          >
            🕒
          </button>
          <button
            onClick={() => changeTheme("minimal")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "minimal"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Minimal"
          >
            ⏱️
          </button>
        </div>
      </>
    );
  }

  // Tema jam digital (default)
  if (visible) {
    return (
      <>
        <div
          ref={jamRef}
          className={`fixed z-50 cursor-move select-none transition-transform duration-100 ${
            isDragging ? "scale-105 shadow-xl" : "hover:scale-105"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg p-4 min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium opacity-80">
                Jam Digital
              </span>
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            </div>

            <div className="text-3xl font-bold tracking-wider">
              {formatTime(time)}
            </div>

            {showDate && (
              <div className="text-sm opacity-90 mt-1">{formatDate(time)}</div>
            )}

            <div className="mt-3 text-xs opacity-70 flex justify-between">
              <button
                onClick={() => setShowDate(!showDate)}
                className="hover:opacity-100"
              >
                {showDate ? "Sembunyikan tanggal" : "Tampilkan tanggal"}
              </button>
              <button onClick={closeClock} className="hover:opacity-100">
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Tombol untuk mengganti tema */}
        <div className="absolute top-4 right-4 z-50 flex flex-col space-y-2">
          <button
            onClick={() => changeTheme("digital")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "digital"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Digital"
          >
            🕐
          </button>
          <button
            onClick={() => changeTheme("analog")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "analog"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Analog"
          >
            🕒
          </button>
          <button
            onClick={() => changeTheme("minimal")}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "minimal"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            title="Jam Minimal"
          >
            ⏱️
          </button>
        </div>
      </>
    );
  }

  // Tombol untuk membuka jam kembali jika tidak visible
  if (showToggleButton) {
    return (
      <button
        onClick={openClock}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
        title="Buka Jam"
      >
        🕐
      </button>
    );
  }

  return null;
};

export default JamDigital;
