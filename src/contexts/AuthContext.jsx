import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('🔑 Attempting login for:', email)
      
      const response = await apiService.login(email.trim().toLowerCase(), password)
      console.log('✅ Login response:', response)
      
      // Extract user data from response
      const userData = response.user || response
      if (userData && userData.email) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('👤 User logged in:', userData.email)
        return { success: true }
      } else {
        console.error('❌ Invalid login response structure:', response)
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('💥 Login failed:', error)
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials.' 
      }
    }
  }

  const register = async (email, password, firstName, lastName) => {
    try {
      console.log('🔐 Attempting registration for:', email)
      console.log('📝 Registration data:', { email, firstName, lastName })
      
      const registrationData = {
        email: email.trim().toLowerCase(),
        password,
        username: `${firstName} ${lastName}`.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim()
      }
      
      console.log('📤 Sending registration data:', registrationData)
      
      const response = await apiService.register(registrationData)
      console.log('✅ Registration response:', response)
      
      // Extract user data from response
      const userData = response.user || response
      if (userData && userData.email) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('👤 User registered and logged in:', userData.email)
        return { success: true }
      } else {
        console.error('❌ Invalid response structure:', response)
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('💥 Registration failed:', error)
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      }
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
