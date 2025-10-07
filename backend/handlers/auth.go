// handlers/AuthHandler.go
package handlers

import (
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
    DB *gorm.DB
}

type RegisterRequest struct {
    Username string `json:"username" binding:"required"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
    FullName string `json:"full_name" binding:"required"`
}

type LoginRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Register(c *gin.Context) {
    var req RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if user already exists
    var existingUser models.User
    if err := h.DB.Where("username = ? OR email = ?", req.Username, req.Email).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Username or email already exists"})
        return
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // Create user
    user := models.User{
        Username: req.Username,
        Password: string(hashedPassword),
        Email:    req.Email,
        FullName: req.FullName,
        Role:     "user",
    }

    if err := h.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func (h *AuthHandler) Login(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Find user by username or email
    var user models.User
    if err := h.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Check password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Generate token
    token := generateToken()

    // Set expiration time (24 hours)
    expiresAt := time.Now().Add(24 * time.Hour)

    // Create session
    session := models.Session{
        UserID:    user.ID,
        Token:     token,
        ExpiresAt: expiresAt,
        CreatedAt: time.Now(),
    }

    if err := h.DB.Create(&session).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
        return
    }

    // Set token in cookie
    c.SetCookie("token", token, int(time.Until(expiresAt).Seconds()), "/", "", false, true)

    c.JSON(http.StatusOK, gin.H{
        "message": "Login successful",
        "user": gin.H{
            "id":       user.ID,
            "username": user.Username,
            "email":    user.Email,
            "fullName": user.FullName,
            "role":     user.Role,
        },
    })
}

func (h *AuthHandler) Logout(c *gin.Context) {
    // Get token from cookie
    token, err := c.Cookie("token")
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "No token found"})
        return
    }

    // Delete session from database
    if err := h.DB.Where("token = ?", token).Delete(&models.Session{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to logout"})
        return
    }

    // Clear cookie
    c.SetCookie("token", "", -1, "/", "", false, true)

    c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
    // Get user dari context (diset oleh middleware)
    user, exists := c.Get("user")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
        return
    }

    userModel := user.(models.User)

    c.JSON(http.StatusOK, gin.H{
        "id":       userModel.ID,
        "username": userModel.Username,
        "email":    userModel.Email,
        "fullName": userModel.FullName,
        "role":     userModel.Role,
    })
}

func generateToken() string {
    return "generated-token-" + time.Now().Format("20060102150405")
}