// Token utility functions
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error parsing stored user:', error)
    return null
  }
}

export const setStoredUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    console.error('Error storing user:', error)
  }
}

export const removeStoredUser = () => {
  try {
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error removing stored user:', error)
  }
}

export const getAuthToken = () => {
  const user = getStoredUser()
  return user?.token || null
}

export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
