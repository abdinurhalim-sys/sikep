package models

import "time"

type EmployeeManager struct {
    EmployeeID uint      `gorm:"primaryKey" json:"employee_id"`
    ManagerID  *uint     `json:"manager_id"`
    CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`
    
    Employee Employee `json:"employee" gorm:"foreignKey:EmployeeID"`
    Manager  Employee `json:"manager" gorm:"foreignKey:ManagerID"`
}