// models/employee.go
package models

import "time"

type Employee struct {
    ID                  uint      `gorm:"primaryKey" json:"id"`
    NIP                 string    `gorm:"column:nip" json:"nip"`
    Nama                string    `json:"nama"`
    TglLahir            time.Time `json:"tgl_lahir"`
    Agama               string    `json:"agama"`
    GolRuang            string    `json:"gol_ruang"`
    Pangkat             string    `json:"pangkat"`
    TMTSKKP             time.Time `json:"tmt_sk_kp"`
    Jabatan             string    `json:"jabatan"`
    TMTSKJab            time.Time `json:"tmt_sk_jab"`
    KelJab              string    `json:"kel_jab"`
    JenisJabGroup       string    `json:"jenis_jab_group"`
    Bidang              string    `json:"bidang"`
    TMTUnit             time.Time `json:"tmt_unit"`
    IsPLT               bool      `json:"is_plt" gorm:"default:false"`
    IsPejabatStruktural bool      `json:"is_pejabat_struktural" gorm:"default:false"`
    LevelStruktural     *int      `json:"level_struktural"`
    PLTJabatan       *string   `json:"plt_jabatan" gorm:"column:plt_jabatan"`
    PLTBidang        *string   `json:"plt_bidang" gorm:"column:plt_bidang"`
    AtasanLangsungID    *uint     `json:"atasan_langsung_id"`
    AtasanLangsung      *Employee `json:"atasan_langsung" gorm:"foreignKey:AtasanLangsungID"`
    Bawahan             []Employee `json:"bawahan" gorm:"foreignKey:AtasanLangsungID"`
}