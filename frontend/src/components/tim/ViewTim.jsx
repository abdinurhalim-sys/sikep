// ViewTim.jsx
import { useState } from "react";
import {
  UserGroupIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  UserGroupIcon as UserGroupIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  PhoneIcon as PhoneIconSolid,
  CalendarIcon as CalendarIconSolid,
} from "@heroicons/react/24/solid";

const ViewTim = ({ teamMembers, loading }) => {
  // Debugging - log data yang diterima

  // State untuk anggota tim yang dipilih
  const [selectedMember, setSelectedMember] = useState(null);

  // State untuk hover
  const [hoveredMember, setHoveredMember] = useState(null);

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Pisahkan antara pejabat struktural dan staff
  const structuralOfficials = (teamMembers || []).filter(
    (member) => member.is_pejabat_struktural === true
  );

  const staffMembers = (teamMembers || []).filter(
    (member) => member.is_pejabat_struktural === false
  );

  // Urutkan pejabat struktural berdasarkan level struktural (semakin rendah angka, semakin tinggi jabatannya)
  const sortedStructuralOfficials = [...structuralOfficials].sort(
    (a, b) => a.level_struktural - b.level_struktural
  );

  // Fungsi untuk mendapatkan warna berdasarkan departemen (hanya Kepegawaian)
  const getDepartmentColor = () => {
    return "bg-blue-100 text-blue-800";
  };

  // Fungsi untuk mendapatkan ikon berdasarkan departemen
  const getDepartmentIcon = (isHovered = false) => {
    const Icon = isHovered ? UserGroupIconSolid : UserGroupIcon;
    return (
      <Icon
        className={`h-5 w-5 ${isHovered ? "text-white" : "text-gray-500"}`}
      />
    );
  };

  // Generate avatar berdasarkan nama
  const generateAvatar = (name) => {
    if (!name) return "/default-avatar.png";

    // Ambil inisial dari nama
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();

    // Buat avatar dengan inisial
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=200`;
  };

  // Komponen untuk kartu anggota tim
  const MemberCard = ({ member, isStructural = false }) => (
    <div
      key={member.id}
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
        selectedMember?.id === member.id ? "ring-2 ring-cyan-500" : ""
      } ${isStructural ? "border-l-4 border-yellow-500" : ""}`}
      onClick={() => setSelectedMember(member)}
      onMouseEnter={() => setHoveredMember(member.id)}
      onMouseLeave={() => setHoveredMember(null)}
    >
      {/* Card Header */}
      <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-400">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={generateAvatar(member.nama)}
              alt={member.nama}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute bottom-0 right-0 bg-cyan-500 rounded-full p-1">
              {getDepartmentIcon(hoveredMember === member.id)}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 flex items-center">
              {member.nama}
              {isStructural}
            </h3>
            <p className="text-sm text-gray-700">{member.jabatan}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-center mb-3">
          <BriefcaseIcon className="h-4 w-4 text-gray-500 mr-2" />
          <span
            className={`text-xs px-2 py-1 rounded-full ${getDepartmentColor()}`}
          >
            Kepegawaian
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          NIP: {member.nip}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Lahir: {formatDate(member.tgl_lahir)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BriefcaseIconSolid className="h-4 w-4 mr-2" />
            <span>{member.pangkat}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIconSolid className="h-4 w-4 mr-2" />
            <span>TMT: {formatDate(member.tmt_unit)}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">Klik untuk detail</span>
          {selectedMember?.id === member.id ? (
            <ChevronUpIcon className="h-5 w-5 text-cyan-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Tim Kepegawaian
        </h1>
        <p className="text-cyan-100 max-w-2xl mx-auto">
          Kenali lebih dekat tim profesional yang berdedikasi di Bidang
          Kepegawaian Perwakilan BPKP Provinsi Nusa Tenggara Timur
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-300 absolute top-0 left-0 opacity-50"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-100 absolute top-0 left-0 opacity-30"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && (!teamMembers || teamMembers.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <UserGroupIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Tidak ada data tim
          </h3>
          <p className="text-gray-500">
            Data tim tidak tersedia atau gagal dimuat. Silakan coba lagi nanti.
          </p>
        </div>
      )}

      {/* Pejabat Struktural Section */}
      {!loading &&
        teamMembers &&
        teamMembers.length > 0 &&
        sortedStructuralOfficials.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Pejabat Struktural
                <span className="ml-2 text-sm text-gray-500">
                  ({sortedStructuralOfficials.length} orang)
                </span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {sortedStructuralOfficials.map((member) => (
                <div key={member.id} className="w-full max-w-xs">
                  <MemberCard member={member} isStructural={true} />
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Staff Section */}
      {!loading &&
        teamMembers &&
        teamMembers.length > 0 &&
        staffMembers.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center">
                <span className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></span>
                Staff
                <span className="ml-2 text-sm text-gray-500">
                  ({staffMembers.length} orang)
                </span>
              </h2>
            </div>

            {/* Grid untuk staff dengan responsive layout dan jarak yang jelas */}
            <div className="container mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffMembers.map((member) => (
                  <div key={member.id} className="flex justify-center">
                    <div className="w-full max-w-xs">
                      <MemberCard member={member} isStructural={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* Selected Member Detail */}
      {selectedMember && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 animate-fadeIn w-full max-w-4xl">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={generateAvatar(selectedMember.nama)}
                    alt={selectedMember.nama}
                    className="w-24 h-24 rounded-full object-cover border-4 border-cyan-100 shadow-md"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        {selectedMember.nama}
                        {selectedMember.is_pejabat_struktural && (
                          <span className="ml-2 px-2 py-1 bg-yellow-500 text-white text-sm rounded-full">
                            Pejabat Struktural
                          </span>
                        )}
                      </h2>
                      <p className="text-lg text-gray-700">
                        {selectedMember.jabatan}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${getDepartmentColor()}`}
                    >
                      Kepegawaian
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Data Pribadi
                      </h3>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="text-gray-500 w-24">NIP</span>
                          <span className="text-gray-900">
                            {selectedMember.nip}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24">Agama</span>
                          <span className="text-gray-900">
                            {selectedMember.agama}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24">
                            Tanggal Lahir
                          </span>
                          <span className="text-gray-900">
                            {formatDate(selectedMember.tgl_lahir)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Data Jabatan
                      </h3>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="text-gray-500 w-24">Golongan</span>
                          <span className="text-gray-900">
                            {selectedMember.gol_ruang}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24">Pangkat</span>
                          <span className="text-gray-900">
                            {selectedMember.pangkat}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24">TMT Unit</span>
                          <span className="text-gray-900">
                            {formatDate(selectedMember.tmt_unit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-3 bg-cyan-50 rounded-lg">
                      <BriefcaseIconSolid className="h-5 w-5 text-cyan-600 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Jenis Jabatan</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedMember.jenis_jab_group}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-cyan-50 rounded-lg">
                      <UserGroupIconSolid className="h-5 w-5 text-cyan-600 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">
                          Kelompok Jabatan
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedMember.kel_jab}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-cyan-50 rounded-lg">
                      <CalendarIconSolid className="h-5 w-5 text-cyan-600 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">TMT Jabatan</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(selectedMember.tmt_sk_jab)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Stats */}
      {!loading && teamMembers && teamMembers.length > 0 && (
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg p-6 text-white w-full max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">
                  Statistik Tim Kepegawaian
                </h3>
                <p className="text-cyan-100">
                  Total anggota tim di Bidang Kepegawaian
                </p>
              </div>

              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{teamMembers.length}</div>
                  <div className="text-sm text-cyan-100">Total Anggota</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {sortedStructuralOfficials.length}
                  </div>
                  <div className="text-sm text-cyan-100">
                    Pejabat Struktural
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {staffMembers.length}
                  </div>
                  <div className="text-sm text-cyan-100">Staff</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      {!loading && teamMembers && teamMembers.length > 0 && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hubungi Tim Kepegawaian
              </h3>
              <p className="text-gray-600">
                Ada pertanyaan atau butuh bantuan? Jangan ragu untuk menghubungi
                kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="mailto:kepegawaian@bpkp-ntt.go.id"
                className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
              >
                <EnvelopeIconSolid className="h-8 w-8 text-cyan-600 mb-2" />
                <span className="font-medium text-gray-900">Email</span>
                <span className="text-sm text-gray-600">
                  kepegawaian@bpkp-ntt.go.id
                </span>
              </a>

              <a
                href="tel:+62380832100"
                className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
              >
                <PhoneIconSolid className="h-8 w-8 text-cyan-600 mb-2" />
                <span className="font-medium text-gray-900">Telepon</span>
                <span className="text-sm text-gray-600">(0380) 832100</span>
              </a>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-cyan-600 mb-2" />
                <span className="font-medium text-gray-900">WhatsApp</span>
                <span className="text-sm text-gray-600">0812-3456-7890</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTim;
