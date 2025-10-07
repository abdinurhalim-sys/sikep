package handlers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SuggestionHandler struct {
    DB *gorm.DB
}

func (h *SuggestionHandler) GetSuggestions(c *gin.Context) {
    var suggestions []models.Suggestion
    if err := h.DB.Order("tanggal desc").Find(&suggestions).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    // Debug: Log data yang diambil
    for _, s := range suggestions {
        log.Printf("ID: %d, Nama: %s, NIP: %s, Unit: %s, Bidang: %s, Saran: %s", 
            s.ID, s.Nama, s.NIP, s.Unit, s.Bidang, s.Saran)
    }
    c.JSON(http.StatusOK, suggestions)
}

func (h *SuggestionHandler) CreateSuggestion(c *gin.Context) {
    var suggestion models.Suggestion
    if err := c.ShouldBindJSON(&suggestion); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

     // Debug: Log data yang diterima
    log.Printf("Received data: %+v", suggestion)

      // Validasi NIP
    if suggestion.NIP == "" {
        log.Printf("NIP is empty")
        c.JSON(http.StatusBadRequest, gin.H{"error": "NIP is required"})
        return
    }

    // Set tanggal ke waktu sekarang
    suggestion.Tanggal = time.Now()

    if err := h.DB.Create(&suggestion).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

     // Debug: Log data yang tersimpan
    log.Printf("Saved data: %+v", suggestion)

    c.JSON(http.StatusCreated, suggestion)
}

func (h *SuggestionHandler) MarkAsRead(c *gin.Context) {
    idParam := c.Param("id")
    log.Printf("MarkAsRead called with ID: %s", idParam) // Tambahkan log ini
    
    id, err := strconv.ParseUint(idParam, 10, 32)
    if err != nil {
        log.Printf("Error parsing ID: %v", err) // Tambahkan log ini
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format: " + err.Error()})
        return
    }

    
    var suggestion models.Suggestion
    if err := h.DB.First(&suggestion, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            log.Printf("Suggestion not found with ID: %d", id) // Tambahkan log ini
            c.JSON(http.StatusNotFound, gin.H{"error": "Suggestion not found with ID: " + idParam})
            return
        }
        log.Printf("Database error: %v", err) // Tambahkan log ini
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
        return
    }

   log.Printf("Found suggestion: %+v", suggestion) // Tambahkan log ini
    
    suggestion.SudahDibaca = true
    if err := h.DB.Save(&suggestion).Error; err != nil {
        log.Printf("Error updating suggestion: %v", err) // Tambahkan log ini
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update suggestion: " + err.Error()})
        return
    }

    log.Printf("Successfully updated suggestion: %+v", suggestion) // Tambahkan log ini
    c.JSON(http.StatusOK, suggestion)
}

func (h *SuggestionHandler) DeleteSuggestion(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.ParseUint(idParam, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format: " + err.Error()})
        return
    }

    if err := h.DB.Delete(&models.Suggestion{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Suggestion deleted successfully"})
}