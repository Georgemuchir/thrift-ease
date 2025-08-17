/**
 * Logging utility for development debugging
 * Provides structured console logging for API responses and errors
 */

const isDevelopment = import.meta.env.DEV

/**
 * Log API responses with structured formatting
 * @param {string} message - Description of the API call
 * @param {any} data - Response data to log
 */
export const logApiResponse = (message, data) => {
  if (!isDevelopment) return
  
  console.group('🔍 API Response')
  console.log('📝 Message:', message)
  console.log('📊 Data:', data)
  console.log('⏰ Timestamp:', new Date().toISOString())
  console.groupEnd()
}

/**
 * Log errors with structured formatting
 * @param {string} message - Error description
 * @param {Error|any} error - Error object or data
 */
export const logError = (message, error) => {
  if (!isDevelopment) return
  
  console.group('❌ Error Log')
  console.error('📝 Message:', message)
  console.error('🚨 Error:', error)
  console.error('⏰ Timestamp:', new Date().toISOString())
  if (error?.stack) {
    console.error('📚 Stack:', error.stack)
  }
  console.groupEnd()
}

/**
 * Log general debug information
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
export const logDebug = (message, data = null) => {
  if (!isDevelopment) return
  
  console.group('🐛 Debug Log')
  console.log('📝 Message:', message)
  if (data !== null) {
    console.log('📊 Data:', data)
  }
  console.log('⏰ Timestamp:', new Date().toISOString())
  console.groupEnd()
}

/**
 * Log user actions for debugging
 * @param {string} action - User action description
 * @param {any} context - Additional context
 */
export const logUserAction = (action, context = null) => {
  if (!isDevelopment) return
  
  console.group('👤 User Action')
  console.log('🎯 Action:', action)
  if (context) {
    console.log('📊 Context:', context)
  }
  console.log('⏰ Timestamp:', new Date().toISOString())
  console.groupEnd()
}

/**
 * Log component lifecycle events
 * @param {string} component - Component name
 * @param {string} event - Lifecycle event (mount, unmount, update)
 * @param {any} props - Component props or state
 */
export const logComponentLifecycle = (component, event, props = null) => {
  if (!isDevelopment) return
  
  console.group('⚛️ Component Lifecycle')
  console.log('🏷️ Component:', component)
  console.log('🔄 Event:', event)
  if (props) {
    console.log('📊 Props/State:', props)
  }
  console.log('⏰ Timestamp:', new Date().toISOString())
  console.groupEnd()
}

export default {
  logApiResponse,
  logError,
  logDebug,
  logUserAction,
  logComponentLifecycle
}
