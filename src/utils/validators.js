// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateName = (name) => {
  return name && name.trim().length >= 2
}

export const validatePrice = (price) => {
  const numPrice = parseFloat(price)
  return !isNaN(numPrice) && numPrice > 0
}

export const validateImageFile = (file) => {
  if (!file) return { isValid: false, message: 'No file selected' }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 16 * 1024 * 1024 // 16MB
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: 'Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.' 
    }
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      message: 'File size too large. Please select an image under 16MB.' 
    }
  }
  
  return { isValid: true, message: 'Valid image file' }
}

export const formatErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.join(', ')
  }
  if (typeof errors === 'object') {
    return Object.values(errors).flat().join(', ')
  }
  return errors || 'Validation failed'
}
