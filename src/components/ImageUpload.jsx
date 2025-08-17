import { useState } from 'react'
import { uploadService } from '../services'
import { handleUploadError } from '../utils/errorHandler'

/**
 * Enhanced ImageUpload component for CORS-fixed backend
 * Handles upload with proper error handling and fallbacks
 */
const ImageUpload = ({ 
  onImageUploaded, 
  onError, 
  currentImage = null,
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    try {
      setUploading(true)
      setUploadProgress(10)
      
      console.log('📤 Starting image upload:', file.name)
      
      // Upload with enhanced error handling
      const result = await uploadService.uploadImage(file)
      
      setUploadProgress(100)
      console.log('✅ Image upload successful:', result.url)
      
      // Update preview to actual uploaded URL
      setPreview(result.url)
      
      // Notify parent component
      if (onImageUploaded) {
        onImageUploaded(result.url, result)
      }
      
    } catch (error) {
      console.error('❌ Image upload failed:', error)
      
      const userMessage = handleUploadError(error)
      
      // Reset preview on error
      setPreview(currentImage)
      
      // Notify parent component
      if (onError) {
        onError(userMessage, error)
      } else {
        alert(`❌ Upload failed: ${userMessage}`)
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
      
      // Clean up object URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }

  const removeImage = () => {
    setPreview(null)
    if (onImageUploaded) {
      onImageUploaded(null)
    }
  }

  return (
    <div style={{ 
      border: '2px dashed #ddd', 
      borderRadius: '8px', 
      padding: '20px', 
      textAlign: 'center',
      position: 'relative'
    }}>
      {uploading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div>📤 Uploading...</div>
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#eee',
            borderRadius: '2px',
            marginTop: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {preview ? (
        <div>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              objectFit: 'cover',
              borderRadius: '4px'
            }} 
          />
          <div style={{ marginTop: '10px' }}>
            <button 
              type="button"
              onClick={removeImage}
              disabled={disabled || uploading}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
          <div>Click to upload image</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Supports: JPEG, PNG, GIF, WebP (max 16MB)
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      />
    </div>
  )
}

export default ImageUpload
