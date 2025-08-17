import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          margin: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#dc3545',
            marginBottom: '16px',
            fontSize: '1.5rem'
          }}>
            Oops! Something went wrong
          </h2>
          
          <p style={{
            color: '#6c757d',
            marginBottom: '24px',
            fontSize: '1rem',
            maxWidth: '500px'
          }}>
            We encountered an unexpected error. Don't worry, this happens sometimes. 
            You can try reloading the page or go back to continue shopping.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Reload Page
            </button>
            
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#545b62'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              Go Back
            </button>
          </div>

          {/* Development error details */}
          {import.meta.env.DEV && this.state.error && (
            <details style={{
              marginTop: '32px',
              padding: '16px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              maxWidth: '100%',
              textAlign: 'left'
            }}>
              <summary style={{
                cursor: 'pointer',
                fontWeight: '500',
                color: '#856404',
                marginBottom: '8px'
              }}>
                Developer Information (click to expand)
              </summary>
              <div style={{
                fontSize: '0.875rem',
                color: '#856404',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                <br />
                <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
              </div>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
