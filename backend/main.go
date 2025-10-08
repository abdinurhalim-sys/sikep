package main

import (
	"backend/handlers"
	"backend/middleware"
	"backend/models"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ Warning: .env file not found, using default environment variables")
	}

	// Get env values
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")
	dbSSLMode := os.Getenv("DB_SSLMODE")
	serverPort := os.Getenv("PORT")
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")

	// Default values if not found
	if serverPort == "" {
		serverPort = "8080"
	}
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:5173"
	}

	// Create DSN
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		dbHost, dbUser, dbPass, dbName, dbPort, dbSSLMode,
	)

	// Connect to database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Auto migrate
	err = db.AutoMigrate(
		&models.Peraturan{},
		&models.FAQ{},
		&models.Suggestion{},
		&models.User{},
		&models.Session{},
		&models.Employee{},
	)
	if err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}

	// Setup handlers
	peraturanHandler := handlers.PeraturanHandler{DB: db}
	faqHandler := handlers.FAQHandler{DB: db}
	suggestionHandler := &handlers.SuggestionHandler{DB: db}
	authHandler := handlers.AuthHandler{DB: db}
	employeeHandler := handlers.EmployeeHandler{DB: db}
	pejabatStrukturalHandler := handlers.PejabatStrukturalHandler{DB: db}
	userHandler := handlers.UserHandler{DB: db}

	// Setup router
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", allowedOrigin)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Public routes
	r.POST("/api/register", authHandler.Register)
	r.POST("/api/login", authHandler.Login)
	r.GET("/api/peraturan", peraturanHandler.GetPeraturan)
	r.GET("/api/peraturan/:id", peraturanHandler.GetPeraturanByID)
	r.GET("/api/peraturan/file/:id", peraturanHandler.GetPeraturanFile)
	r.GET("/api/peraturan/download/:id", peraturanHandler.DownloadPeraturan)
	r.GET("/api/peraturan/filter", peraturanHandler.GetPeraturanWithFilters)
	r.GET("/api/peraturan/count", peraturanHandler.GetPeraturanCount)
	r.GET("/api/faq", faqHandler.GetFAQs)
	r.GET("/api/faq/:id", faqHandler.GetFAQByID)
	r.GET("/api/suggestions", suggestionHandler.GetSuggestions)
	r.POST("/api/suggestions", suggestionHandler.CreateSuggestion)
	r.PUT("/api/suggestions/:id/read", suggestionHandler.MarkAsRead)
	r.GET("/api/our-tims", employeeHandler.GetEmployeesKepegawaian)

	// Protected routes
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware(db))
	{
		protected.GET("/auth/me", authHandler.GetCurrentUser)
		protected.POST("/logout", authHandler.Logout)

		admin := protected.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		{
			admin.POST("/peraturan", peraturanHandler.CreatePeraturan)
			admin.PUT("/peraturan/:id", peraturanHandler.UpdatePeraturan)
			admin.DELETE("/peraturan/:id", peraturanHandler.DeletePeraturan)

			admin.POST("/faq", faqHandler.CreateFAQ)
			admin.PUT("/faq/:id", faqHandler.UpdateFAQ)
			admin.DELETE("/faq/:id", faqHandler.DeleteFAQ)

			admin.DELETE("/suggestions/:id", suggestionHandler.DeleteSuggestion)

			admin.GET("/pejabat-struktural", pejabatStrukturalHandler.GetPejabatStruktural)
			admin.GET("/pejabat-struktural/available", pejabatStrukturalHandler.GetAvailableForStruktural)
			admin.POST("/pejabat-struktural", pejabatStrukturalHandler.AddPejabatStruktural)
			admin.PUT("/pejabat-struktural/:id", pejabatStrukturalHandler.UpdatePejabatStruktural)
			admin.DELETE("/pejabat-struktural/:id", pejabatStrukturalHandler.RemovePejabatStruktural)
			admin.GET("/pejabat-struktural/:id/bawahan", pejabatStrukturalHandler.GetBawahanByPejabat)

			admin.GET("/users", userHandler.GetUsers)
			admin.PUT("/users/:id/role", userHandler.UpdateUserRole)
		}
	}

	r.Static("/uploads", "./uploads")

	log.Printf("🚀 Server started on :%s\n", serverPort)
	log.Fatal(r.Run(":" + serverPort))
}
