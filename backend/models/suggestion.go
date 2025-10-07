package models

import "time"

type Suggestion struct {
    ID          uint      `gorm:"column:id;primaryKey" json:"id"`
    Nama        string    `gorm:"column:nama" json:"nama" binding:"required"`
    NIP         string    `gorm:"column:nip" json:"nip" binding:"required"`
    Unit        string    `gorm:"column:unit" json:"unit" binding:"required"`
    Bidang      string    `gorm:"column:bidang" json:"bidang" binding:"required"`
    Saran       string    `gorm:"column:saran" json:"saran" binding:"required"`
    SudahDibaca bool      `gorm:"column:sudah_dibaca;default:false" json:"sudah_dibaca"`
    Tanggal     time.Time `gorm:"column:tanggal;autoCreateTime" json:"tanggal"`
}
