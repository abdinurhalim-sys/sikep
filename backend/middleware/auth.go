// middleware/AuthMiddleware.go
package middleware

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthMiddleware(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Get token from cookie
        token, err := c.Cookie("token")
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "No token found"})
            c.Abort()
            return
        }

        // Find session in database
        var session models.Session
        if err := db.Where("token = ? AND expires_at > NOW()", token).First(&session).Error; err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            c.Abort()
            return
        }

        // Find user
        var user models.User
        if err := db.First(&user, session.UserID).Error; err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
            c.Abort()
            return
        }

        // Set user to context
        c.Set("user", user)
        c.Next()
    }
}

func AdminMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        user, exists := c.Get("user")
        if !exists {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            c.Abort()
            return
        }

        if userModel, ok := user.(models.User); ok && userModel.Role != "admin" {
            c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
            c.Abort()
            return
        }

        c.Next()
    }
}