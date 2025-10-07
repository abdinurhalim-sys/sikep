package handlers

import (
	"net/http"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FAQHandler struct {
    DB *gorm.DB
}

// GetFAQs returns all FAQs
func (h *FAQHandler) GetFAQs(c *gin.Context) {
    var faqs []models.FAQ
    result := h.DB.Find(&faqs)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": faqs})
}

// CreateFAQ creates a new FAQ
func (h *FAQHandler) CreateFAQ(c *gin.Context) {
    var faq models.FAQ
    if err := c.ShouldBindJSON(&faq); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    result := h.DB.Create(&faq)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusCreated, gin.H{"data": faq})
}

// GetFAQByID returns a single FAQ by ID
func (h *FAQHandler) GetFAQByID(c *gin.Context) {
    id := c.Param("id")
    var faq models.FAQ
    result := h.DB.First(&faq, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "FAQ not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": faq})
}

// UpdateFAQ updates an existing FAQ
func (h *FAQHandler) UpdateFAQ(c *gin.Context) {
    id := c.Param("id")
    var faq models.FAQ
    result := h.DB.First(&faq, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "FAQ not found"})
        return
    }
    if err := c.ShouldBindJSON(&faq); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    h.DB.Save(&faq)
    c.JSON(http.StatusOK, gin.H{"data": faq})
}

// DeleteFAQ deletes a FAQ by ID
func (h *FAQHandler) DeleteFAQ(c *gin.Context) {
    id := c.Param("id")
    result := h.DB.Delete(&models.FAQ{}, id)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "FAQ not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "FAQ deleted successfully"})
}