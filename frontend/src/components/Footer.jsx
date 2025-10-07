import React, { useState, useEffect } from "react";
import LogoBpkp from "../assets/images/logo-bpkp.webp";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaYoutube,
  FaArrowRight,
  FaBuilding,
  FaLifeRing,
  FaBriefcase,
  FaGavel,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaStar,
} from "react-icons/fa";

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    pegawai: 0,
    peraturan: 0,
    faq: 0,
    kepuasan: 0,
  });

  const options = { year: "numeric" };
  const formattedYear = new Date().toLocaleDateString("id-ID", options);

  // Animasi statistik
  useEffect(() => {
    const duration = 2000;
    const steps = 30;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedStats({
        pegawai: Math.min(Math.floor((125 / steps) * step), 125),
        peraturan: Math.min(Math.floor((42 / steps) * step), 42),
        faq: Math.min(Math.floor((18 / steps) * step), 18),
        kepuasan: Math.min(Math.floor((98 / steps) * step), 98),
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          pegawai: 125,
          peraturan: 42,
          faq: 18,
          kepuasan: 98,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const footerLinks = [
    {
      title: "Solutions",
      icon: <FaBuilding className="text-cyan-500" />,
      links: [
        { name: "Marketing", href: "#" },
        { name: "Analytics", href: "#" },
        { name: "Automation", href: "#" },
        { name: "Commerce", href: "#" },
        { name: "Insights", href: "#" },
      ],
    },
    {
      title: "Support",
      icon: <FaLifeRing className="text-cyan-500" />,
      links: [
        { name: "Submit ticket", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Guides", href: "#" },
      ],
    },
    {
      title: "Company",
      icon: <FaBriefcase className="text-cyan-500" />,
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Jobs", href: "#" },
        { name: "Press", href: "#" },
      ],
    },
    {
      title: "Legal",
      icon: <FaGavel className="text-cyan-500" />,
      links: [
        { name: "Terms of service", href: "#" },
        { name: "Privacy policy", href: "#" },
        { name: "License", href: "#" },
      ],
    },
  ];

  const socialMedia = [
    {
      icon: <FaFacebook />,
      name: "Facebook",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-100",
    },
    {
      icon: <FaInstagram />,
      name: "Instagram",
      color: "hover:text-pink-600",
      bgColor: "hover:bg-pink-100",
    },
    {
      icon: <FaTwitter />,
      name: "Twitter",
      color: "hover:text-blue-400",
      bgColor: "hover:bg-blue-100",
    },
    {
      icon: <FaGithub />,
      name: "GitHub",
      color: "hover:text-gray-800",
      bgColor: "hover:bg-gray-100",
    },
    {
      icon: <FaYoutube />,
      name: "YouTube",
      color: "hover:text-red-600",
      bgColor: "hover:bg-red-100",
    },
  ];

  const stats = [
    {
      title: "Pegawai Aktif",
      value: animatedStats.pegawai,
      icon: <FaUsers className="text-cyan-500" />,
      suffix: "",
    },
    {
      title: "Peraturan",
      value: animatedStats.peraturan,
      icon: <FaFileAlt className="text-cyan-500" />,
      suffix: "",
    },
    {
      title: "FAQ",
      value: animatedStats.faq,
      icon: <FaStar className="text-cyan-500" />,
      suffix: "",
    },
    {
      title: "Kepuasan Pengguna",
      value: animatedStats.kepuasan,
      icon: <FaChartLine className="text-cyan-500" />,
      suffix: "%",
    },
  ];

  return (
    <footer className="relative overflow-hidden mt-10">
      {/* Background dengan gradien dan pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iIzA5ZSIvPgo8L3N2Zz4=')]" />
      </div>

      <div className="relative lg:container md:text-left text-center xs:text-center mx-auto lg:mb-8 mt-10">
        <div className="md:max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid md:grid-cols-6 grid-cols-1 gap-10">
            {/* Logo + Deskripsi + Sosmed */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start">
              <div className="relative group">
                <a href="/" className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={LogoBpkp}
                      className="w-24 h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                      alt="Logo BPKP"
                    />
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent transition-all duration-500 group-hover:from-cyan-500 group-hover:to-blue-500">
                      BPKP
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Nusa Tenggara Timur
                    </span>
                  </div>
                </a>
              </div>

              <p className="mt-6 text-gray-600 dark:text-gray-300 text-center md:text-left max-w-md transition-all duration-300 hover:text-gray-800 dark:hover:text-gray-200">
                <span className="block font-medium">
                  Perwakilan Badan Pengawasan Keuangan dan Pembangunan
                </span>
                <span className="block mt-1">Nusa Tenggara Timur</span>
              </p>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Ikuti Kami
                </h4>
                <div className="flex space-x-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`relative p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 ${social.color} ${social.bgColor} hover:shadow-lg hover:-translate-y-2 group`}
                      onMouseEnter={() => setHoveredSocial(index)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <div className="text-gray-600 dark:text-gray-400 group-hover:text-inherit transition-colors duration-300 text-xl">
                        {social.icon}
                      </div>
                      {/* Tooltip */}
                      {hoveredSocial === index && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap transition-all duration-300 animate-pulse">
                          {social.name}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((section, index) => (
                <div
                  key={index}
                  className="transform transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-2 transition-transform duration-300 group-hover:scale-110">
                      {section.icon}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider transition-colors duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300"
                          onMouseEnter={() =>
                            setHoveredLink(`${index}-${linkIndex}`)
                          }
                          onMouseLeave={() => setHoveredLink(null)}
                        >
                          <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:font-medium">
                            {link.name}
                          </span>
                          <FaArrowRight
                            className={`ml-1 text-xs transition-all duration-300 ${
                              hoveredLink === `${index}-${linkIndex}`
                                ? "opacity-100 translate-x-1"
                                : "opacity-0 -translate-x-1"
                            }`}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Statistik Kepegawaian */}
          {/* <div className="mt-16 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-sm transition-all duration-500 hover:shadow-lg">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2 transition-colors duration-300 hover:text-cyan-600 dark:hover:text-cyan-400">
                Data Kepegawaian BPKP Provinsi NTT
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300 hover:text-gray-800 dark:hover:text-gray-200">
                Statistik terkini sistem informasi kepegawaian
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center group"
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                        hoveredStat === index
                          ? "bg-cyan-500 dark:bg-cyan-600 scale-110"
                          : "bg-cyan-100 dark:bg-cyan-900/30"
                      }`}
                    >
                      <div
                        className={`text-xl transition-all duration-300 ${
                          hoveredStat === index
                            ? "text-white scale-125"
                            : "text-cyan-600 dark:text-cyan-400"
                        }`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <h4
                      className={`text-3xl font-bold mb-1 transition-all duration-300 ${
                        hoveredStat === index
                          ? "text-cyan-600 dark:text-cyan-400 scale-110"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {stat.value}
                      {stat.suffix}
                    </h4>
                    <p className="text-sm transition-all duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      {stat.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-cyan-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 hover:text-gray-700 dark:hover:text-gray-300">
                © {formattedYear} Sub Bagian Kepegawain Perwakilan BPKP Provinsi
                Nusa Tenggara Timur, Inc. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 hover:underline"
                >
                  Kebijakan Privasi
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 hover:underline"
                >
                  Syarat & Ketentuan
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 hover:underline"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import LogoBpkp from "../assets/images/logo-bpkp.webp";
// import {
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaGithub,
//   FaYoutube,
//   FaArrowRight,
//   FaBuilding,
//   FaLifeRing,
//   FaBriefcase,
//   FaGavel,
//   FaUsers,
//   FaFileAlt,
//   FaChartLine,
//   FaStar,
// } from "react-icons/fa";

// const Footer = () => {
//   const [hoveredLink, setHoveredLink] = useState(null);
//   const [hoveredSocial, setHoveredSocial] = useState(null);
//   const [hoveredStat, setHoveredStat] = useState(null);
//   const [animatedStats, setAnimatedStats] = useState({
//     pegawai: 0,
//     peraturan: 0,
//     faq: 0,
//     kepuasan: 0,
//   });

//   const options = { year: "numeric" };
//   const formattedYear = new Date().toLocaleDateString("id-ID", options);

//   // Animasi statistik
//   useEffect(() => {
//     const duration = 2000;
//     const steps = 30;
//     const interval = duration / steps;

//     let step = 0;
//     const timer = setInterval(() => {
//       step++;
//       setAnimatedStats({
//         pegawai: Math.min(Math.floor((125 / steps) * step), 125),
//         peraturan: Math.min(Math.floor((42 / steps) * step), 42),
//         faq: Math.min(Math.floor((18 / steps) * step), 18),
//         kepuasan: Math.min(Math.floor((98 / steps) * step), 98),
//       });

//       if (step >= steps) {
//         clearInterval(timer);
//         setAnimatedStats({
//           pegawai: 125,
//           peraturan: 42,
//           faq: 18,
//           kepuasan: 98,
//         });
//       }
//     }, interval);

//     return () => clearInterval(timer);
//   }, []);

//   const footerLinks = [
//     {
//       title: "Layanan",
//       icon: <FaBuilding className="text-orange-300" />,
//       links: [
//         { name: "Kepegawaian", href: "#" },
//         { name: "Analitik", href: "#" },
//         { name: "Otomatisasi", href: "#" },
//         { name: "Informasi", href: "#" },
//         { name: "Wawasan", href: "#" },
//       ],
//     },
//     {
//       title: "Dukungan",
//       icon: <FaLifeRing className="text-orange-300" />,
//       links: [
//         { name: "Ajukan Tiket", href: "#" },
//         { name: "Dokumentasi", href: "#" },
//         { name: "Panduan", href: "#" },
//       ],
//     },
//     {
//       title: "Perusahaan",
//       icon: <FaBriefcase className="text-orange-300" />,
//       links: [
//         { name: "Tentang", href: "#" },
//         { name: "Blog", href: "#" },
//         { name: "Karir", href: "#" },
//         { name: "Pers", href: "#" },
//       ],
//     },
//     {
//       title: "Legal",
//       icon: <FaGavel className="text-orange-300" />,
//       links: [
//         { name: "Ketentuan Layanan", href: "#" },
//         { name: "Kebijakan Privasi", href: "#" },
//         { name: "Lisensi", href: "#" },
//       ],
//     },
//   ];

//   const socialMedia = [
//     {
//       icon: <FaFacebook />,
//       name: "Facebook",
//       color: "hover:text-blue-400",
//       bgColor: "hover:bg-blue-900/30",
//     },
//     {
//       icon: <FaInstagram />,
//       name: "Instagram",
//       color: "hover:text-pink-400",
//       bgColor: "hover:bg-pink-900/30",
//     },
//     {
//       icon: <FaTwitter />,
//       name: "Twitter",
//       color: "hover:text-blue-300",
//       bgColor: "hover:bg-blue-900/30",
//     },
//     {
//       icon: <FaGithub />,
//       name: "GitHub",
//       color: "hover:text-gray-300",
//       bgColor: "hover:bg-gray-800/50",
//     },
//     {
//       icon: <FaYoutube />,
//       name: "YouTube",
//       color: "hover:text-red-400",
//       bgColor: "hover:bg-red-900/30",
//     },
//   ];

//   const stats = [
//     {
//       title: "Pegawai Aktif",
//       value: animatedStats.pegawai,
//       icon: <FaUsers className="text-orange-300" />,
//       suffix: "",
//     },
//     {
//       title: "Peraturan",
//       value: animatedStats.peraturan,
//       icon: <FaFileAlt className="text-orange-300" />,
//       suffix: "",
//     },
//     {
//       title: "FAQ",
//       value: animatedStats.faq,
//       icon: <FaStar className="text-orange-300" />,
//       suffix: "",
//     },
//     {
//       title: "Kepuasan Pengguna",
//       value: animatedStats.kepuasan,
//       icon: <FaChartLine className="text-orange-300" />,
//       suffix: "%",
//     },
//   ];

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   const socialVariants = {
//     hover: {
//       y: -5,
//       transition: {
//         duration: 0.2,
//       },
//     },
//   };

//   const statCardVariants = {
//     hidden: { scale: 0.9, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//       },
//     },
//     hover: {
//       y: -10,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   return (
//     <motion.footer
//       className="relative overflow-hidden mt-10"
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//     >
//       {/* Background dengan gradien dan pattern - DIUBAH KE WARNA ORANGE */}
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500"></div>

//       {/* Animated shapes - DIUBAH KE WARNA ORANGE */}
//       <motion.div
//         className="absolute top-10 left-10 w-64 h-64 rounded-full bg-orange-400/20 blur-3xl"
//         animate={{
//           scale: [1, 1.2, 1],
//           x: [0, 20, 0],
//           y: [0, -20, 0],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           repeatType: "reverse",
//         }}
//       ></motion.div>

//       <motion.div
//         className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-yellow-400/20 blur-3xl"
//         animate={{
//           scale: [1, 1.3, 1],
//           x: [0, -30, 0],
//           y: [0, 30, 0],
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//           repeatType: "reverse",
//         }}
//       ></motion.div>

//       <div className="relative lg:container md:text-left text-center xs:text-center mx-auto lg:mb-8 mt-10">
//         <div className="md:max-w-7xl px-6 py-16 lg:px-8">
//           <div className="grid md:grid-cols-6 grid-cols-1 gap-10">
//             {/* Logo + Deskripsi + Sosmed */}
//             <motion.div
//               className="md:col-span-2 flex flex-col items-center md:items-start"
//               variants={itemVariants}
//             >
//               <div className="relative group">
//                 <a href="/" className="flex items-center space-x-3">
//                   <div className="relative">
//                     <img
//                       src={LogoBpkp}
//                       className="w-24 h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
//                       alt="Logo BPKP"
//                     />
//                     <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-xl font-bold bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent transition-all duration-500 group-hover:from-orange-200 group-hover:to-yellow-100">
//                       BPKP
//                     </span>
//                     <span className="text-xs text-orange-200">
//                       Nusa Tenggara Timur
//                     </span>
//                   </div>
//                 </a>
//               </div>

//               <p className="mt-6 text-orange-100 text-center md:text-left max-w-md transition-all duration-300 hover:text-white">
//                 <span className="block font-medium">
//                   Perwakilan Badan Pengawasan Keuangan dan Pembangunan
//                 </span>
//                 <span className="block mt-1">Nusa Tenggara Timur</span>
//               </p>

//               {/* Social Media */}
//               <div className="mt-8">
//                 <h4 className="text-sm font-semibold text-orange-200 mb-4">
//                   Ikuti Kami
//                 </h4>
//                 <div className="flex space-x-4">
//                   {socialMedia.map((social, index) => (
//                     <motion.a
//                       key={index}
//                       href="#"
//                       className={`relative p-3 rounded-full bg-white/10 backdrop-blur-sm shadow-sm transition-all duration-300 ${social.color} ${social.bgColor} hover:shadow-lg group`}
//                       onMouseEnter={() => setHoveredSocial(index)}
//                       onMouseLeave={() => setHoveredSocial(null)}
//                       variants={socialVariants}
//                       whileHover="hover"
//                     >
//                       <div className="text-orange-200 group-hover:text-inherit transition-colors duration-300 text-xl">
//                         {social.icon}
//                       </div>
//                       {/* Tooltip */}
//                       {hoveredSocial === index && (
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap transition-all duration-300 animate-pulse">
//                           {social.name}
//                           <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
//                         </div>
//                       )}
//                     </motion.a>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>

//             {/* Footer Links */}
//             <motion.div
//               className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8"
//               variants={itemVariants}
//             >
//               {footerLinks.map((section, index) => (
//                 <motion.div
//                   key={index}
//                   className="transform transition-all duration-300 hover:-translate-y-2"
//                   whileHover={{ y: -5 }}
//                 >
//                   <div className="flex items-center mb-4">
//                     <div className="mr-2 transition-transform duration-300 group-hover:scale-110">
//                       {section.icon}
//                     </div>
//                     <h3 className="text-sm font-bold text-white uppercase tracking-wider transition-colors duration-300 group-hover:text-orange-300">
//                       {section.title}
//                     </h3>
//                   </div>
//                   <ul className="space-y-3">
//                     {section.links.map((link, linkIndex) => (
//                       <li key={linkIndex}>
//                         <a
//                           href={link.href}
//                           className="group flex items-center text-sm text-orange-200 hover:text-orange-100 transition-all duration-300"
//                           onMouseEnter={() =>
//                             setHoveredLink(`${index}-${linkIndex}`)
//                           }
//                           onMouseLeave={() => setHoveredLink(null)}
//                         >
//                           <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:font-medium">
//                             {link.name}
//                           </span>
//                           <FaArrowRight
//                             className={`ml-1 text-xs transition-all duration-300 ${
//                               hoveredLink === `${index}-${linkIndex}`
//                                 ? "opacity-100 translate-x-1"
//                                 : "opacity-0 -translate-x-1"
//                             }`}
//                           />
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>

//           {/* Statistik Kepegawaian */}
//           {/* <motion.div
//             className="mt-16 bg-gradient-to-r from-orange-800/50 to-yellow-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/10 transition-all duration-500 hover:shadow-lg"
//             variants={itemVariants}
//           >
//             <div className="max-w-4xl mx-auto">
//               <h3 className="text-xl font-bold text-center text-white mb-2 transition-colors duration-300 hover:text-orange-300">
//                 Data Kepegawaian BPKP Provinsi NTT
//               </h3>
//               <p className="text-center text-orange-200 mb-8 transition-colors duration-300 hover:text-white">
//                 Statistik terkini sistem informasi kepegawaian
//               </p>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {stats.map((stat, index) => (
//                   <motion.div
//                     key={index}
//                     className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
//                     onMouseEnter={() => setHoveredStat(index)}
//                     onMouseLeave={() => setHoveredStat(null)}
//                     variants={statCardVariants}
//                     whileHover="hover"
//                   >
//                     <div
//                       className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
//                         hoveredStat === index
//                           ? "bg-orange-500 scale-110"
//                           : "bg-orange-900/50"
//                       }`}
//                     >
//                       <div
//                         className={`text-xl transition-all duration-300 ${
//                           hoveredStat === index
//                             ? "text-white scale-125"
//                             : "text-orange-300"
//                         }`}
//                       >
//                         {stat.icon}
//                       </div>
//                     </div>
//                     <h4
//                       className={`text-3xl font-bold mb-1 transition-all duration-300 ${
//                         hoveredStat === index
//                           ? "text-orange-300 scale-110"
//                           : "text-white"
//                       }`}
//                     >
//                       {stat.value}
//                       {stat.suffix}
//                     </h4>
//                     <p className="text-sm transition-all duration-300 group-hover:text-orange-300 text-orange-200">
//                       {stat.title}
//                     </p>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </motion.div> */}

//           {/* Copyright */}
//           <motion.div
//             className="mt-12 pt-8 border-t border-white/10 transition-all duration-300 hover:border-orange-500/50"
//             variants={itemVariants}
//           >
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <p className="text-sm text-orange-200 transition-colors duration-300 hover:text-white">
//                 © {formattedYear} Sub Bagian Kepegawain Perwakilan BPKP Provinsi
//                 Nusa Tenggara Timur, Inc. All rights reserved.
//               </p>
//               <div className="mt-4 md:mt-0 flex space-x-6">
//                 <a
//                   href="#"
//                   className="text-sm text-orange-200 hover:text-orange-100 transition-all duration-300 hover:underline"
//                 >
//                   Kebijakan Privasi
//                 </a>
//                 <a
//                   href="#"
//                   className="text-sm text-orange-200 hover:text-orange-100 transition-all duration-300 hover:underline"
//                 >
//                   Syarat & Ketentuan
//                 </a>
//                 <a
//                   href="#"
//                   className="text-sm text-orange-200 hover:text-orange-100 transition-all duration-300 hover:underline"
//                 >
//                   Cookie Policy
//                 </a>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </motion.footer>
//   );
// };

// export default Footer;
