// Debug logging utility for API responses and frontend debugging

export const logger = {
  // API Response logging
  logApiResponse: (endpoint, data, context = '') => {
    console.group(`🌐 API Response ${context ? `(${context})` : ''}`)
    console.log('📍 Endpoint:', endpoint)
    console.log('🧪 Raw response:', data)
    console.log('📊 Response type:', typeof data)
    console.log('📈 Is array:', Array.isArray(data))
    
    if (Array.isArray(data)) {
      console.log('🔢 Array length:', data.length)
      console.log('📝 First item:', data[0] || 'None')
    } else if (data && typeof data === 'object') {
      console.log('🔑 Object keys:', Object.keys(data))
      if (data.products) {
        console.log('📦 Products array length:', Array.isArray(data.products) ? data.products.length : 'Not an array')
      }
    }
    console.groupEnd()
  },

  // Error logging
  logError: (context, error, additionalInfo = {}) => {
    console.group(`💥 Error in ${context}`)
    console.error('❌ Error:', error)
    console.error('📊 Error type:', typeof error)
    console.error('🔍 Additional info:', additionalInfo)
    if (error.stack) {
      console.error('📚 Stack trace:', error.stack)
    }
    console.groupEnd()
  },

  // Component lifecycle logging
  logComponentAction: (component, action, data = null) => {
    console.log(`🔄 ${component} - ${action}`, data ? data : '')
  },

  // State change logging
  logStateChange: (component, stateName, oldValue, newValue) => {
    console.group(`📊 State Change: ${component}.${stateName}`)
    console.log('⬅️ Old value:', oldValue)
    console.log('➡️ New value:', newValue)
    console.groupEnd()
  },

  // Warning logging
  logWarning: (context, message, data = null) => {
    console.warn(`⚠️ ${context}: ${message}`, data || '')
  }
}

// Export individual functions for convenience
export const { logApiResponse, logError, logComponentAction, logStateChange, logWarning } = logger

export default logger
