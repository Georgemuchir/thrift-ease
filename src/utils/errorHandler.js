// Enhanced error handling utilities for working backend
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  // Handle different error types from working backend
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error?.message) {
    // Specific messages for previously broken endpoints
    if (error.message.includes('405') && error.message.includes('products')) {
      return 'Product creation endpoint error - this should be fixed now. Please try again.'
    }
    
    if (error.message.includes('404') && error.message.includes('upload')) {
      return 'Image upload endpoint error - this should be fixed now. Please try again.'
    }
    
    if (error.message.includes('CORS')) {
      return 'Connection error. Please check if the backend server is running.'
    }
    
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

export const handleUploadError = (error) => {
  console.error('Upload Error:', error)
  
  if (error.message.includes('413')) {
    return 'File too large. Maximum size is 16MB.'
  }
  
  if (error.message.includes('415')) {
    return 'Unsupported file type. Please use JPEG, PNG, GIF, or WebP.'
  }
  
  if (error.message.includes('404') && error.message.includes('upload')) {
    return 'Upload endpoint not available. This should be fixed - please contact support.'
  }
  
  return handleApiError(error)
}

export const createErrorResponse = (message, status = 500) => {
  return {
    success: false,
    message,
    status
  }
}

export const createSuccessResponse = (data, message = 'Operation successful') => {
  return {
    success: true,
    message,
    data
  }
}

export const isNetworkError = (error) => {
  return !error.response && error.request
}

export const isServerError = (error) => {
  return error?.response?.status >= 500
}

export const isClientError = (error) => {
  return error?.response?.status >= 400 && error?.response?.status < 500
}
