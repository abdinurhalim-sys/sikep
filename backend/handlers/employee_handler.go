package handlers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type EmployeeHandler struct {
    DB *gorm.DB
}

// GetEmployees mengambil semua data pegawai
func (h *EmployeeHandler) GetEmployees(c *gin.Context) {
    var employees []models.Employee
    
    // Preload atasan langsung jika ada
    err := h.DB.Preload("AtasanLangsung").Order("id asc").Find(&employees).Error
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employees)
}

func (h *EmployeeHandler) UpdatePLTPosition(c *gin.Context) {
    id := c.Param("id")
    
    var input struct {
        PLTJabatan  string    `json:"plt_jabatan" binding:"required"`
        PLTBidang   string    `json:"plt_bidang" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    var employee models.Employee
    if err := h.DB.First(&employee, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
        return
    }
    
    // Update PLT fields
    employee.IsPLT = true
    employee.PLTJabatan = &input.PLTJabatan
    employee.PLTBidang = &input.PLTBidang
    
    if err := h.DB.Save(&employee).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employee)
}

// RemovePLTPosition menghapus jabatan PLT pegawai
func (h *EmployeeHandler) RemovePLTPosition(c *gin.Context) {
    id := c.Param("id")
    
    var employee models.Employee
    if err := h.DB.First(&employee, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
        return
    }
    
    // Reset PLT fields
    employee.IsPLT = false
    employee.PLTJabatan = nil
    employee.PLTBidang = nil
    
    if err := h.DB.Save(&employee).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "PLT position removed successfully"})
}

func (h *EmployeeHandler) GetEmployeesKepegawaian(c *gin.Context) {
    var employees []models.Employee
    
    // Tambahkan filter untuk hanya mengambil pegawai di bidang "Kepegawaian"
    err := h.DB.Where("bidang = ?", "Kepegawaian").
           Preload("AtasanLangsung").
           Order("id asc").
           Find(&employees).Error
    
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employees)
}