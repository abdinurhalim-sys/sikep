import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ColorThemeSelector from "../components/ColorThemeSelector";

const Login = ({ onClose, onShowRegister }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { currentTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Variabel animasi untuk container utama
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Variabel animasi untuk setiap elemen
  const itemVariants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Variabel animasi untuk form container
  const formVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      rotateX: 15,
      y: 100,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  // Variabel animasi untuk gambar
  const imageVariants = {
    hidden: {
      x: 200,
      opacity: 0,
      scale: 1.2,
      rotate: 5,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Variabel animasi untuk background
  const bgVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Perbaiki: gunakan username untuk login
      const result = await login(email, password);
      if (result.success) {
        setShowSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tentukan font berdasarkan tema
  const fontClass = currentTheme.isDark ? "font-mono" : "font-sans";

  return (
    <div className={`min-h-screen relative overflow-hidden ${fontClass}`}>
      {/* Background animasi dengan tema warna dinamis */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={bgVariants}
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentTheme.background}`}
        ></div>

        {/* Animated shapes dengan warna tema */}
        {currentTheme.shapes &&
          currentTheme.shapes.map((shape, index) => (
            <motion.div
              key={index}
              className={`absolute w-64 h-64 rounded-full ${shape.color} ${shape.blur}`}
              style={{
                top: index === 0 ? "5%" : index === 1 ? "50%" : "33%",
                left: index === 0 ? "10%" : index === 1 ? "50%" : "33%",
                transform: index === 1 ? "translate(-50%, -50%)" : "none",
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8 + index * 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
          ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>

        {/* Geometric shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-16 h-16 rounded-lg bg-opacity-15"
          style={{ backgroundColor: currentTheme.floatingColors?.[0] }}
          animate={{
            rotate: [0, 45, 90, 135, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        ></motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/4 w-12 h-12 rounded-full bg-opacity-15"
          style={{ backgroundColor: currentTheme.floatingColors?.[1] }}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        <motion.div
          className="absolute top-1/3 left-1/3 w-20 h-20 rotate-45 bg-opacity-15"
          style={{ backgroundColor: currentTheme.floatingColors?.[2] }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        {/* Additional floating elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: currentTheme.floatingColors?.[i % 3],
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>
        ))}
      </motion.div>

      {/* Logo SIKep */}
      <motion.div
        className="absolute top-4 right-4 z-20 md:top-6 md:right-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white flex items-center justify-center mr-2 md:mr-3 shadow-md">
            <div
              className={`w-5 h-5 md:w-6 md:h-6 rounded bg-gradient-to-br ${currentTheme.logoGradient}`}
            ></div>
          </div>
          <span
            className={`font-bold text-lg md:text-xl ${fontClass} ${currentTheme.textSikep}`}
          >
            SIKep
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <motion.div
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden border border-white/50"
          variants={containerVariants}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
        >
          {/* Form */}
          <motion.div
            className="md:w-1/2 w-full flex flex-col items-center justify-center p-4 md:p-6 relative"
            variants={formVariants}
          >
            {/* Efek cahaya */}
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${currentTheme.formGradient} blur-xl opacity-40`}
            ></div>

            <div className="relative z-10 w-full max-w-md">
              {/* Header */}
              <motion.div
                className="text-center mb-4 md:mb-6"
                variants={itemVariants}
              >
                <motion.div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${currentTheme.logoGradient} flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg`}
                  whileHover={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-7 w-7 md:h-9 md:w-9 ${currentTheme.textSikep}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </motion.div>
                <h1
                  className={`text-2xl md:text-3xl font-bold mb-1 ${fontClass} ${currentTheme.textClass}`}
                >
                  SIKep
                </h1>
                <p
                  className={`text-sm md:text-base ${fontClass} ${currentTheme.textClass}`}
                >
                  Sistem Informasi Kepegawaian
                </p>
                <div
                  className={`mt-2 h-1 w-14 md:w-16 bg-gradient-to-r ${currentTheme.logoGradient} mx-auto rounded-full`}
                ></div>
              </motion.div>

              {/* Error message */}
              {error && (
                <motion.div
                  className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <motion.form
                className="space-y-3 md:space-y-4 bg-white/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/30"
                variants={itemVariants}
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium mb-1 ${fontClass} ${currentTheme.textClass}`}
                  >
                    Username atau Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 md:h-5 md:w-5"
                        style={{ color: currentTheme.iconColor }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-9 pr-3 py-2 bg-white/80 border rounded-lg focus:ring-2 focus:border-${
                        currentTheme.focusRing
                      } ${
                        currentTheme.inputTextClass || "text-gray-900"
                      } placeholder-slate-500 transition duration-200 text-sm ${fontClass}`}
                      style={{ borderColor: currentTheme.focusRing }}
                      placeholder="Username atau email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium mb-1 ${fontClass} ${currentTheme.textClass}`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 md:h-5 md:w-5"
                        style={{ color: currentTheme.iconColor }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full pl-9 pr-3 py-2 bg-white/80 border rounded-lg focus:ring-2 focus:border-${
                        currentTheme.focusRing
                      } ${
                        currentTheme.inputTextClass || "text-gray-900"
                      } placeholder-slate-500 transition duration-200 text-sm ${fontClass}`}
                      style={{ borderColor: currentTheme.focusRing }}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className={`h-4 w-4 focus:ring-${currentTheme.focusRing} border rounded bg-white/80`}
                      style={{ borderColor: currentTheme.focusRing }}
                    />
                    <label
                      htmlFor="remember"
                      className={`ml-2 block text-xs ${fontClass} ${currentTheme.textClass}`}
                    >
                      Ingat saya
                    </label>
                  </div>
                  <div className="text-xs">
                    <a
                      href="#"
                      className={`font-medium hover:underline transition-all duration-300 ${fontClass} ${currentTheme.textClass}`}
                    >
                      Lupa password?
                    </a>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium bg-gradient-to-r ${currentTheme.logoGradient} ${currentTheme.textSikep} focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${fontClass}`}
                  style={{
                    boxShadow: `0 10px 25px -5px rgba(${
                      currentTheme.focusRing === "purple"
                        ? "196, 181, 253"
                        : currentTheme.focusRing === "blue"
                        ? "96, 165, 250"
                        : currentTheme.focusRing === "orange"
                        ? "251, 146, 60"
                        : currentTheme.focusRing === "emerald"
                        ? "52, 211, 153"
                        : currentTheme.focusRing === "cyan"
                        ? "6, 182, 212"
                        : currentTheme.focusRing === "rose"
                        ? "251, 113, 133"
                        : "167, 243, 208"
                    }, 0.3)`,
                  }}
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    ></motion.div>
                  ) : (
                    "Masuk"
                  )}
                </motion.button>
              </motion.form>

              {/* Info */}
              <motion.div
                className="mt-4 md:mt-6 text-center"
                variants={itemVariants}
              >
                <p
                  className={`text-xs ${fontClass} ${currentTheme.textLightClass}`}
                >
                  Halaman Ini Hanya Boleh di Akses Oleh Pegawai di
                </p>
                <p
                  className={`text-xs mt-1 ${fontClass} ${currentTheme.textLightClass}`}
                >
                  Perwakilan BPKP Provinsi Nusa Tenggara Timur
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Gambar */}
          <motion.div
            className={`md:w-1/2 w-full bg-gradient-to-br ${currentTheme.cardGradient} relative overflow-hidden`}
            variants={imageVariants}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-white">
              <motion.div
                className="text-center max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <h2
                  className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 ${fontClass} ${currentTheme.textClass}`}
                >
                  Sistem Informasi Kepegawaian
                </h2>
                <p
                  className={`mb-4 md:mb-6 text-xs md:text-sm ${fontClass} ${currentTheme.textLightClass}`}
                >
                  Akses Terbatas Hanya Untuk Pegawai di Perwakilan BPKP Nusa
                  Tenggara Timur
                </p>

                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                  {[
                    {
                      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                      title: "Keamanan",
                    },
                    {
                      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                      title: "Privasi",
                    },
                    {
                      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                      title: "Data",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.2 }}
                      whileHover={{ y: -10 }}
                    >
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 backdrop-blur-sm`}
                        style={{
                          backgroundColor: `${currentTheme.focusRing}40`,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 md:h-6 md:w-6 ${currentTheme.iconColor}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={item.icon}
                          />
                        </svg>
                      </div>
                      <span
                        className={`font-medium text-xs ${fontClass} ${currentTheme.textClass}`}
                      >
                        {item.title}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className={`mt-4 md:mt-6 p-3 backdrop-blur-sm rounded-xl border`}
                  style={{
                    backgroundColor: `${currentTheme.focusRing}20`,
                    borderColor: `${currentTheme.focusRing}40`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <p
                    className={`text-xs ${fontClass} ${currentTheme.textLightClass}`}
                  >
                    "Sistem ini dirancang khusus untuk memenuhi kebutuhan
                    informasi kepegawaian di lingkungan Perwakilan BPKP Nusa
                    Tenggara Timur."
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Pattern dekoratif */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                  fill="white"
                  fillOpacity="0.1"
                />
              </svg>
            </div>

            {/* Floating elements */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  backgroundColor: currentTheme.floatingColors?.[i % 3],
                }}
                animate={{
                  y: [0, Math.random() * 30 - 15],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animasi sukses */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-gradient-to-br ${currentTheme.cardGradient} rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-300 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 md:h-10 md:w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h3
                  className={`text-xl md:text-2xl font-bold text-white mb-2 ${fontClass}`}
                >
                  Login Berhasil!
                </h3>
                <p
                  className={`mb-6 text-sm md:text-base ${fontClass} ${currentTheme.textLightClass}`}
                >
                  Anda berhasil Masuk ke SIKep
                </p>
                <motion.button
                  className={`px-5 py-2.5 md:px-6 md:py-3 bg-white font-medium rounded-lg hover:bg-${currentTheme.focusRing}50 transition-all text-sm md:text-base ${fontClass}`}
                  style={{ color: currentTheme.textColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSuccess(false);
                    navigate("/");
                  }}
                >
                  Lanjutkan ke Dashboard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color Theme Selector */}
      <ColorThemeSelector />
    </div>
  );
};

export default Login;
