package models

import "time"

type Peraturan struct {
    ID              uint      `json:"id" gorm:"primaryKey"`
    Nomor           string    `json:"nomor" gorm:"not null"`
    TanggalDitetapkan time.Time `json:"tanggal_ditetapkan" gorm:"not null"`
    Judul           string    `json:"judul" gorm:"not null"`
    InstansiPembuat string    `json:"instansi_pembuat" gorm:"not null"`
    JenisPeraturan  string    `json:"jenis_peraturan" gorm:"not null"`
    Kategori        string    `json:"kategori" gorm:"type:text"` // Ubah menjadi tipe text untuk JSON
    NamaFile        string    `json:"nama_file"` // Hapus not null karena bisa kosong
    PathFile        string    `json:"path_file"`
    Keterangan      string    `json:"keterangan"`
    CreatedAt       time.Time `json:"created_at"`
}