package models

import "time"

type FAQ struct {
    ID        uint      `json:"id" gorm:"primaryKey;table:faq"` // Tambahkan table:faq
    Question  string    `json:"question" gorm:"not null"`
    Answer    string    `json:"answer" gorm:"not null"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}