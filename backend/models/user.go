package models

import "time"

type User struct {
    ID        int64     `json:"id" gorm:"primaryKey"`
    Username  string    `json:"username" gorm:"unique;not null"`
    Password  string    `json:"-" gorm:"not null"`
    Email     string    `json:"email" gorm:"unique"`
    FullName  string    `json:"full_name"`
    Role      string    `json:"role" gorm:"default:'user'"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type Session struct {
    ID        int64     `json:"id" gorm:"primaryKey"`
    UserID    int64     `json:"user_id"`
    Token     string    `json:"token" gorm:"unique;not null"`
    ExpiresAt time.Time `json:"expires_at"`
    CreatedAt time.Time `json:"created_at"`
}