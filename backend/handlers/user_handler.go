package handlers

import (
	"backend/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserHandler struct {
    DB *gorm.DB
}

// GetUsers mendapatkan semua pengguna (hanya untuk admin)
func (h *UserHandler) GetUsers(c *gin.Context) {
    var users []models.User
    if err := h.DB.Find(&users).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
        return
    }

    // Hapus password dari response
    for i := range users {
        users[i].Password = ""
    }

    c.JSON(http.StatusOK, users)
}

func (h *UserHandler) UpdateUserRole(c *gin.Context) {
    fmt.Println("[DEBUG] UpdateUserRole handler called")
    
    // Ambil ID dari parameter
    userIDStr := c.Param("id")
    fmt.Printf("[DEBUG] User ID: %s\n", userIDStr)
    
    userID, err := strconv.ParseInt(userIDStr, 10, 64)
    if err != nil {
        fmt.Printf("[ERROR] Invalid user ID: %v\n", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
        return
    }
    
    // Log request body
    var body map[string]interface{}
    if err := c.ShouldBindJSON(&body); err != nil {
        fmt.Printf("[ERROR] Error binding request: %v\n", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    fmt.Printf("[DEBUG] Request body: %+v\n", body)
    
    // Validasi role
    role, ok := body["role"].(string)
    if !ok || (role != "user" && role != "admin") {
        fmt.Printf("[ERROR] Invalid role: %v\n", body["role"])
        c.JSON(http.StatusBadRequest, gin.H{"error": "Role must be either 'user' or 'admin'"})
        return
    }
    
    fmt.Printf("[DEBUG] New role: %s\n", role)
    
    // Cari user di database
    var user models.User
    if err := h.DB.First(&user, userID).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            fmt.Printf("[ERROR] User not found with ID: %d\n", userID)
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            fmt.Printf("[ERROR] Database error: %v\n", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
        }
        return
    }
    
    fmt.Printf("[DEBUG] Found user: %+v\n", user)
    
    // Update role
    user.Role = role
    if err := h.DB.Save(&user).Error; err != nil {
        fmt.Printf("[ERROR] Error updating user role: %v\n", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role: " + err.Error()})
        return
    }
    
    fmt.Printf("[DEBUG] Successfully updated user role\n")
    
    // Hapus password dari response
    user.Password = ""
    
    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "User role updated successfully",
        "user":    user,
    })
}