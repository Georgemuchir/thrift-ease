// Error handling utilities
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
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
