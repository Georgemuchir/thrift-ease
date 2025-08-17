import BaseApiService from './baseApi.js'
import { getAuthHeaders } from '../utils/tokenUtils.js'
import { validateImageFile } from '../utils/validators.js'

class UploadService extends BaseApiService {
  // Upload single image - Enhanced for working backend
  async uploadImage(imageFile) {
    // Validate file before upload
    const validation = validateImageFile(imageFile)
    if (!validation.isValid) {
      throw new Error(validation.message)
    }

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      console.log('📤 Uploading image:', imageFile.name, `(${(imageFile.size/1024/1024).toFixed(2)}MB)`)
      
      const response = await fetch(`${this.baseURL}/upload-image`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          // Don't set Content-Type for FormData, let browser set it
        },
        credentials: 'omit', // ✅ Fix CORS - try without credentials first
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`
        
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || errorMessage
        } catch (jsonError) {
          // If response isn't JSON, use status text
        }
        
        // Specific error handling for upload endpoint
        if (response.status === 404) {
          console.error('❌ Upload endpoint not found - this should be fixed now')
        } else if (response.status === 413) {
          errorMessage = 'File too large. Maximum size is 16MB.'
        } else if (response.status === 415) {
          errorMessage = 'Unsupported file type. Please use JPEG, PNG, GIF, or WebP.'
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('✅ Image uploaded successfully:', result.url)
      return result
    } catch (error) {
      console.error('❌ Image upload failed:', error)
      throw error
    }
  }

  // Upload multiple images
  async uploadMultipleImages(imageFiles) {
    const uploadPromises = imageFiles.map(file => this.uploadImage(file))
    
    try {
      const results = await Promise.allSettled(uploadPromises)
      
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
      
      const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason.message)
      
      return {
        successful,
        failed,
        total: imageFiles.length,
        successCount: successful.length,
        failCount: failed.length
      }
    } catch (error) {
      console.error('Multiple image upload failed:', error)
      throw error
    }
  }

  // Delete uploaded image
  async deleteImage(filename) {
    return this.request(`/upload-image/${filename}`, {
      method: 'DELETE',
    })
  }

  // Get uploaded image URL
  getImageUrl(filename) {
    if (!filename) return null
    if (filename.startsWith('http')) return filename
    return `${this.baseURL}/uploads/${filename}`
  }

  // Upload user avatar
  async uploadAvatar(imageFile) {
    const validation = validateImageFile(imageFile)
    if (!validation.isValid) {
      throw new Error(validation.message)
    }

    const formData = new FormData()
    formData.append('avatar', imageFile)

    try {
      const response = await fetch(`${this.baseURL}/upload-avatar`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include', // ✅ Added credentials
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Avatar upload failed:', error)
      throw error
    }
  }

  // Upload product gallery images
  async uploadProductGallery(productId, imageFiles) {
    const formData = new FormData()
    imageFiles.forEach((file, index) => {
      formData.append(`gallery_${index}`, file)
    })

    try {
      const response = await fetch(`${this.baseURL}/products/${productId}/gallery`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include', // ✅ Added credentials
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Product gallery upload failed:', error)
      throw error
    }
  }
}

export default new UploadService()
