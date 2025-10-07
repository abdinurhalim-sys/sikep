package handlers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PejabatStrukturalHandler struct {
    DB *gorm.DB
}

// GetPejabatStruktural mengambil semua data pejabat struktural
func (h *PejabatStrukturalHandler) GetPejabatStruktural(c *gin.Context) {
    var employees []models.Employee
    
    err := h.DB.Where("is_pejabat_struktural = ?", true).
        Preload("AtasanLangsung").
        Preload("Bawahan").
        Order("level_struktural asc, id asc").
        Find(&employees).Error
        
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employees)
}

// GetPejabatById mengambil detail pejabat berdasarkan ID
func (h *PejabatStrukturalHandler) GetPejabatById(c *gin.Context) {
    id := c.Param("id")
    
    var employee models.Employee
    if err := h.DB.Where("id = ? AND is_pejabat_struktural = ?", id, true).
        Preload("AtasanLangsung").
        First(&employee).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Pejabat not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employee)
}

// GetAvailableForStruktural mengambil pegawai yang bisa dijadikan pejabat struktural
func (h *PejabatStrukturalHandler) GetAvailableForStruktural(c *gin.Context) {
    var employees []models.Employee
    
    err := h.DB.Where("is_pejabat_struktural = ?", false).
        Order("nama asc").
        Find(&employees).Error
        
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employees)
}

// AddPejabatStruktural menambahkan pegawai sebagai pejabat struktural
func (h *PejabatStrukturalHandler) AddPejabatStruktural(c *gin.Context) {
    var input struct {
        EmployeeID      uint  `json:"employee_id" binding:"required"`
        LevelStruktural int   `json:"level_struktural" binding:"required"`
        AtasanID        *uint `json:"atasan_id"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Mulai transaksi
    tx := h.DB.Begin()
    
    // Ambil data pegawai yang akan dijadikan pejabat
    var emp models.Employee
    if err := tx.First(&emp, input.EmployeeID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
        return
    }
    
    // Update pegawai menjadi pejabat struktural
    err := tx.Model(&emp).
        Updates(map[string]interface{}{
            "is_pejabat_struktural": true,
            "level_struktural":     input.LevelStruktural,
            "atasan_langsung_id":   input.AtasanID,
        }).Error
        
    if err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    // Update atasan untuk bawahan yang seharusnya melapor ke pejabat ini berdasarkan bidang
    if input.LevelStruktural > 1 { // Jika bukan level tertinggi
        err = tx.Model(&models.Employee{}).
            Where("bidang = ? AND is_pejabat_struktural = ? AND atasan_langsung_id IS NULL", 
                emp.Bidang, false).
            Update("atasan_langsung_id", input.EmployeeID).Error
            
        if err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
    }
    
    // Commit transaksi
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusCreated, gin.H{"message": "Pejabat struktural berhasil ditambahkan"})
}

// UpdatePejabatStruktural mengupdate data pejabat struktural
func (h *PejabatStrukturalHandler) UpdatePejabatStruktural(c *gin.Context) {
    id := c.Param("id")
    
    var input struct {
        EmployeeID      uint  `json:"employee_id"`
        LevelStruktural int   `json:"level_struktural"`
        AtasanID        *uint `json:"atasan_id"`
    }
    
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Mulai transaksi
    tx := h.DB.Begin()
    
    // Ambil data pejabat lama
    var pejabatLama models.Employee
    if err := tx.First(&pejabatLama, id).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "Pejabat not found"})
        return
    }
    
    // Cek apakah pegawai berubah
    if pejabatLama.ID != input.EmployeeID {
        // Hapus status pejabat lama
        if err := tx.Model(&pejabatLama).Updates(map[string]interface{}{
            "is_pejabat_struktural": false,
            "level_struktural":     nil,
            "atasan_langsung_id":   nil,
        }).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        
        // Reset atasan untuk semua bawahan pejabat lama
        if err := tx.Model(&models.Employee{}).
            Where("atasan_langsung_id = ?", id).
            Update("atasan_langsung_id", nil).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        
        // Set pejabat baru
        if err := tx.Model(&models.Employee{}).
            Where("id = ?", input.EmployeeID).
            Updates(map[string]interface{}{
                "is_pejabat_struktural": true,
                "level_struktural":     input.LevelStruktural,
                "atasan_langsung_id":   input.AtasanID,
            }).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        
        // Ambil data pejabat baru
        var pejabatBaru models.Employee
        if err := tx.First(&pejabatBaru, input.EmployeeID).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        
        // Pindahkan semua bawahan di bidang yang sama ke pejabat baru
        if err := tx.Model(&models.Employee{}).
            Where("bidang = ? AND is_pejabat_struktural = ? AND atasan_langsung_id IS NULL", 
                pejabatBaru.Bidang, false).
            Update("atasan_langsung_id", pejabatBaru.ID).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        
        // Jika pejabat lama dan pejabat baru memiliki bidang yang sama, 
        // atur pejabat lama sebagai bawahan pejabat baru
        if pejabatLama.Bidang == pejabatBaru.Bidang {
            if err := tx.Model(&pejabatLama).
                Update("atasan_langsung_id", pejabatBaru.ID).Error; err != nil {
                tx.Rollback()
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
        }
    } else {
        // Update data pejabat yang sama
        if err := tx.Model(&pejabatLama).Updates(map[string]interface{}{
            "level_struktural":   input.LevelStruktural,
            "atasan_langsung_id": input.AtasanID,
        }).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
    }
    
    // Commit transaksi
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "Pejabat struktural berhasil diperbarui"})
}

// RemovePejabatStruktural menghapus status pejabat struktural
func (h *PejabatStrukturalHandler) RemovePejabatStruktural(c *gin.Context) {
    id := c.Param("id")
    
    // Mulai transaksi
    tx := h.DB.Begin()
    
    // Ambil data pejabat sebelum dihapus
    var pejabat models.Employee
    if err := tx.First(&pejabat, id).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "Pejabat not found"})
        return
    }
    
    // Update bawahan untuk menghapus atasan
    err := tx.Model(&models.Employee{}).
        Where("atasan_langsung_id = ?", id).
        Update("atasan_langsung_id", nil).Error
        
    if err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    // Update status pejabat struktural
    err = tx.Model(&pejabat).
        Updates(map[string]interface{}{
            "is_pejabat_struktural": false,
            "level_struktural":     nil,
        }).Error
        
    if err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    // Commit transaksi
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "Status pejabat struktural berhasil dihapus"})
}

// GetBawahanByPejabat mengambil bawahan dari pejabat struktural
func (h *PejabatStrukturalHandler) GetBawahanByPejabat(c *gin.Context) {
    id := c.Param("id")
    
    var employees []models.Employee
    
    err := h.DB.Where("atasan_langsung_id = ?", id).
        Preload("AtasanLangsung").
        Order("id asc").
        Find(&employees).Error
        
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employees)
}

// GetEmployeesByBidang mengambil pegawai berdasarkan bidang
func (h *EmployeeHandler) GetEmployeesByBidang(c *gin.Context) {
    bidang := c.Query("bidang")
    excludeId := c.Query("exclude")
    
    if bidang == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bidang parameter is required"})
        return
    }
    
    var employees []models.Employee
    
    query := h.DB.Where("bidang = ?", bidang)
    
    if excludeId != "" {
        query = query.Where("id != ?", excludeId)
    }
    
    if err := query.Order("nama asc").Find(&employees).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, employees)
}