package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PeraturanHandler struct {
    DB *gorm.DB
}

// CreatePeraturan - Handler untuk membuat peraturan baru
func (h *PeraturanHandler) CreatePeraturan(c *gin.Context) {
    // Parse multipart form
    if err := c.Request.ParseMultipartForm(32 << 20); err != nil { // 32MB max memory
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data: " + err.Error()})
        return
    }

    // Get form values
    nomor := c.PostForm("nomor")
    tanggalDitetapkanStr := c.PostForm("tanggal_ditetapkan")
    judul := c.PostForm("judul")
    instansiPembuat := c.PostForm("instansi_pembuat")
    jenisPeraturan := c.PostForm("jenis_peraturan")
    kategoriStr := c.PostForm("kategori")
    keterangan := c.PostForm("keterangan")

    // Parse date
    tanggalDitetapkan, err := time.Parse("2006-01-02", tanggalDitetapkanStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format: " + err.Error()})
        return
    }

    // Get uploaded file
    file, header, err := c.Request.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get uploaded file: " + err.Error()})
        return
    }
    defer file.Close()

    // Create directory if not exists
    uploadDir := "./uploads/peraturan"
    if err := os.MkdirAll(uploadDir, 0755); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory: " + err.Error()})
        return
    }

    // Create unique filename to avoid conflicts
    timestamp := strconv.FormatInt(time.Now().Unix(), 10)
    filename := timestamp + "_" + header.Filename
    filePath := filepath.Join(uploadDir, filename)
    
    // Get absolute path
    absolutePath, err := filepath.Abs(filePath)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get absolute path: " + err.Error()})
        return
    }

    // Save the uploaded file
    if err := c.SaveUploadedFile(header, filePath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save uploaded file: " + err.Error()})
        return
    }

    // Parse kategori (handle multiple kategori)
    var kategoriArray []string
    if kategoriStr != "" {
        // Jika kategori adalah JSON string (dari frontend)
        if strings.HasPrefix(kategoriStr, "[") {
            if err := json.Unmarshal([]byte(kategoriStr), &kategoriArray); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kategori format: " + err.Error()})
                return
            }
        } else {
            // Jika kategori adalah string tunggal
            kategoriArray = []string{kategoriStr}
        }
    }

    // Convert kategori array to JSON string for storage
    kategoriJSON, err := json.Marshal(kategoriArray)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process kategori: " + err.Error()})
        return
    }

    // Create peraturan record
    peraturan := models.Peraturan{
        Nomor:           nomor,
        TanggalDitetapkan: tanggalDitetapkan,
        Judul:           judul,
        InstansiPembuat: instansiPembuat,
        JenisPeraturan:  jenisPeraturan,
        Kategori:        string(kategoriJSON),
        NamaFile:        header.Filename,
        PathFile:        absolutePath, // Simpan absolute path
        Keterangan:      keterangan,
        CreatedAt:       time.Now(),
    }

    // Save to database
    if err := h.DB.Create(&peraturan).Error; err != nil {
        // Hapus file yang sudah diupload jika database gagal
        os.Remove(filePath)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save peraturan to database: " + err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Peraturan created successfully",
        "data":    peraturan,
    })
}

// GetPeraturan - Handler untuk mendapatkan semua peraturan
func (h *PeraturanHandler) GetPeraturan(c *gin.Context) {
    var peraturans []models.Peraturan
    
    if err := h.DB.Find(&peraturans).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch peraturans"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Peraturans fetched successfully",
        "data":    peraturans,
    })
}

// GetPeraturanFile - Handler untuk menampilkan file peraturan
func (h *PeraturanHandler) GetPeraturanFile(c *gin.Context) {
    id := c.Param("id")
    
    var peraturan models.Peraturan
    if err := h.DB.First(&peraturan, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Peraturan not found"})
        return
    }
    
    // Check if file exists
    if _, err := os.Stat(peraturan.PathFile); os.IsNotExist(err) {
        c.JSON(http.StatusNotFound, gin.H{"error": "File not found on server"})
        return
    }
    
    // Get file extension
    ext := strings.ToLower(filepath.Ext(peraturan.NamaFile))
    
    // Set content type based on file extension
    var contentType string
    switch ext {
    case ".pdf":
        contentType = "application/pdf"
    case ".doc":
        contentType = "application/msword"
    case ".docx":
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    default:
        contentType = "application/octet-stream"
    }
    
    // Set headers
    c.Header("Content-Description", "File Transfer")
    c.Header("Content-Transfer-Encoding", "binary")
    c.Header("Content-Disposition", "inline; filename=\""+peraturan.NamaFile+"\"")
    c.Header("Content-Type", contentType)
    
    // Serve the file
    c.File(peraturan.PathFile)
}

// DownloadPeraturan - Handler untuk mendownload file peraturan
func (h *PeraturanHandler) DownloadPeraturan(c *gin.Context) {
    id := c.Param("id")
    
    var peraturan models.Peraturan
    if err := h.DB.First(&peraturan, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Peraturan not found"})
        return
    }
    
    // Check if file exists
    if _, err := os.Stat(peraturan.PathFile); os.IsNotExist(err) {
        c.JSON(http.StatusNotFound, gin.H{"error": "File not found on server"})
        return
    }
    
    // Set headers for download
    c.Header("Content-Description", "File Transfer")
    c.Header("Content-Transfer-Encoding", "binary")
    c.Header("Content-Disposition", "attachment; filename=\""+peraturan.NamaFile+"\"")
    c.Header("Content-Type", "application/octet-stream")
    
    // Serve the file
    c.File(peraturan.PathFile)
}

// GetPeraturanByID - Mendapatkan peraturan berdasarkan ID
func (h *PeraturanHandler) GetPeraturanByID(c *gin.Context) {
    id := c.Param("id")
    
    var peraturan models.Peraturan
    if err := h.DB.First(&peraturan, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Peraturan not found"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Peraturan fetched successfully",
        "data": peraturan,
    })
}

// UpdatePeraturan - Update peraturan yang ada
func (h *PeraturanHandler) UpdatePeraturan(c *gin.Context) {
    id := c.Param("id")
    
    var peraturan models.Peraturan
    if err := h.DB.First(&peraturan, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Peraturan not found"})
        return
    }
    
    // Parse multipart form
    if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data"})
        return
    }
    
    // Get form values
    nomor := c.PostForm("nomor")
    tanggalDitetapkanStr := c.PostForm("tanggal_ditetapkan")
    judul := c.PostForm("judul")
    instansiPembuat := c.PostForm("instansi_pembuat")
    jenisPeraturan := c.PostForm("jenis_peraturan")
    kategoriStr := c.PostForm("kategori")
    keterangan := c.PostForm("keterangan")
    
    // Parse date
    tanggalDitetapkan, err := time.Parse("2006-01-02", tanggalDitetapkanStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
        return
    }
    
    // Parse kategori
    var kategoriArray []string
    if kategoriStr != "" {
        if strings.HasPrefix(kategoriStr, "[") {
            if err := json.Unmarshal([]byte(kategoriStr), &kategoriArray); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kategori format"})
                return
            }
        } else {
            kategoriArray = []string{kategoriStr}
        }
    }
    
    kategoriJSON, err := json.Marshal(kategoriArray)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process kategori"})
        return
    }
    
    // Update peraturan data
    peraturan.Nomor = nomor
    peraturan.TanggalDitetapkan = tanggalDitetapkan
    peraturan.Judul = judul
    peraturan.InstansiPembuat = instansiPembuat
    peraturan.JenisPeraturan = jenisPeraturan
    peraturan.Kategori = string(kategoriJSON)
    peraturan.Keterangan = keterangan
    
    // Handle file upload jika ada
    file, header, err := c.Request.FormFile("file")
    if err == nil {
        defer file.Close()
        
        // Hapus file lama jika ada
        if peraturan.PathFile != "" {
            if err := os.Remove(peraturan.PathFile); err != nil {
                log.Printf("Failed to delete old file: %v", err)
            }
        }
        
        // Simpan file baru
        uploadDir := "./uploads/peraturan"
        timestamp := strconv.FormatInt(time.Now().Unix(), 10)
        filename := timestamp + "_" + header.Filename
        filePath := filepath.Join(uploadDir, filename)
        
        if err := c.SaveUploadedFile(header, filePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save uploaded file"})
            return
        }
        
        peraturan.NamaFile = header.Filename
        peraturan.PathFile = filePath
    }
    
    // Save to database
    if err := h.DB.Save(&peraturan).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update peraturan"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Peraturan updated successfully",
        "data": peraturan,
    })
}

// DeletePeraturan - Hapus peraturan dan file fisiknya
func (h *PeraturanHandler) DeletePeraturan(c *gin.Context) {
    id := c.Param("id")
    
    // Konversi id ke integer
    peraturanID, err := strconv.Atoi(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
        return
    }
    
    var peraturan models.Peraturan
    if err := h.DB.First(&peraturan, peraturanID).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Peraturan not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
        }
        return
    }
    
    // Simpan path file untuk dihapus nanti
    filePathToDelete := peraturan.PathFile
    
    // Mulai transaksi database
    tx := h.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()
    
    // Hapus record dari database
    if err := tx.Delete(&peraturan).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete peraturan from database: " + err.Error()})
        return
    }
    
    // Commit transaksi database
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction: " + err.Error()})
        return
    }
    
    // Hapus file fisik setelah database commit berhasil
    if filePathToDelete != "" {
        if err := os.Remove(filePathToDelete); err != nil {
            // Log error tapi tidak return error ke client karena database sudah berhasil dihapus
            log.Printf("WARNING: Failed to delete file %s: %v", filePathToDelete, err)
        } else {
            log.Printf("INFO: File deleted successfully: %s", filePathToDelete)
        }
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Peraturan deleted successfully",
    })
}

// GetPeraturanWithFilters - Handler untuk mendapatkan peraturan dengan filter
func (h *PeraturanHandler) GetPeraturanWithFilters(c *gin.Context) {
    // Ambil parameter query
    search := c.Query("search")
    jenis := c.Query("jenis")
    kategori := c.Query("kategori")
    tahun := c.Query("tahun")
    
    // Buat query builder
    query := h.DB.Model(&models.Peraturan{})
    
    // Tambahkan filter jika ada
    if search != "" {
        searchPattern := "%" + search + "%"
        query = query.Where(
            "judul LIKE ? OR nomor LIKE ? OR instansi_pembuat LIKE ?",
            searchPattern, searchPattern, searchPattern,
        )
    }
    
    if jenis != "" {
        query = query.Where("jenis_peraturan = ?", jenis)
    }
    
    if kategori != "" {
        query = query.Where("kategori LIKE ?", "%"+kategori+"%")
    }
    
    if tahun != "" {
        query = query.Where("EXTRACT(YEAR FROM tanggal_ditetapkan) = ?", tahun)
    }
    
    var peraturans []models.Peraturan
    if err := query.Find(&peraturans).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch peraturans"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Peraturans fetched successfully",
        "data":    peraturans,
    })
}


// GetPeraturanCount mengembalikan jumlah peraturan
func (h *PeraturanHandler) GetPeraturanCount(c *gin.Context) {
    var count int64
    result := h.DB.Model(&models.Peraturan{}).Count(&count)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"count": count})
}