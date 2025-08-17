import { useState } from 'react'
import { productService, uploadService } from '../services'
import { handleApiError, handleUploadError } from '../utils/errorHandler'

/**
 * Backend Integration Test Component
 * Use this to verify all fixed endpoints are working
 */
const BackendTest = () => {
  const [testResults, setTestResults] = useState({})
  const [testing, setTesting] = useState(false)

  const runTest = async (testName, testFunction) => {
    setTestResults(prev => ({ ...prev, [testName]: { status: 'running' } }))
    
    try {
      const result = await testFunction()
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { status: 'success', result } 
      }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { status: 'error', error: error.message } 
      }))
    }
  }

  const testProductsFetch = async () => {
    console.log('🧪 Testing products fetch...')
    const response = await productService.getProducts()
    const products = response.products || response || []
    return `Fetched ${products.length} products`
  }

  const testProductCreation = async () => {
    console.log('🧪 Testing product creation...')
    const testProduct = {
      name: 'Test Product',
      price: 19.99,
      description: 'Test product for backend integration',
      category: 'women',
      brand: 'Test Brand',
      condition: 'good'
    }
    
    const result = await productService.createProduct(testProduct)
    return `Created product with ID: ${result.id || 'unknown'}`
  }

  const testImageUpload = async () => {
    console.log('🧪 Testing image upload with CORS fixes...')
    
    // Create a test blob image
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(0, 0, 100, 100)
    ctx.fillStyle = 'white'
    ctx.font = '12px Arial'
    ctx.fillText('TEST', 35, 55)
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        try {
          const testFile = new File([blob], 'test-image.png', { type: 'image/png' })
          const result = await uploadService.uploadImage(testFile)
          resolve(`✅ Uploaded successfully: ${result.url}`)
        } catch (error) {
          reject(new Error(`Upload failed: ${error.message}`))
        }
      }, 'image/png')
    })
  }

  const testProductDeletion = async () => {
    console.log('🧪 Testing product deletion with CORS fixes...')
    
    // First create a test product to delete
    const testProduct = {
      name: 'Test Product for Deletion',
      price: 1.00,
      description: 'This product will be deleted as part of the test',
      category: 'women',
      brand: 'Test Brand',
      condition: 'good'
    }
    
    try {
      // Create the product
      const created = await productService.createProduct(testProduct)
      console.log('Created test product:', created)
      
      // Then delete it
      await productService.deleteProduct(created.id)
      return `✅ Successfully deleted product ID: ${created.id}`
    } catch (error) {
      throw new Error(`Deletion test failed: ${error.message}`)
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setTestResults({})
    
    try {
      await runTest('productsFetch', testProductsFetch)
      await runTest('productCreation', testProductCreation)
      await runTest('imageUpload', testImageUpload)
      await runTest('productDeletion', testProductDeletion) // New test
    } catch (error) {
      console.error('Test suite error:', error)
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '🔄'
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⏳'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return '#ff9800'
      case 'success': return '#4caf50'
      case 'error': return '#f44336'
      default: return '#9e9e9e'
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2>🧪 Backend Integration Test Suite</h2>
      <p style={{ color: '#666' }}>
        Test all the fixed backend endpoints to ensure everything is working properly.
      </p>
      
      <button 
        onClick={runAllTests}
        disabled={testing}
        style={{
          backgroundColor: testing ? '#ccc' : '#2196f3',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {testing ? 'Running Tests...' : 'Run All Tests'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        
        {Object.entries(testResults).map(([testName, result]) => (
          <div 
            key={testName}
            style={{
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>
                {getStatusIcon(result.status)}
              </span>
              <strong style={{ color: getStatusColor(result.status) }}>
                {testName}
              </strong>
            </div>
            
            {result.result && (
              <div style={{ 
                marginTop: '5px', 
                padding: '5px', 
                backgroundColor: '#e8f5e8',
                borderRadius: '3px',
                fontSize: '14px'
              }}>
                ✅ {result.result}
              </div>
            )}
            
            {result.error && (
              <div style={{ 
                marginTop: '5px', 
                padding: '5px', 
                backgroundColor: '#ffebee',
                borderRadius: '3px',
                fontSize: '14px',
                color: '#d32f2f'
              }}>
                ❌ {result.error}
              </div>
            )}
          </div>
        ))}
        
        {Object.keys(testResults).length === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No tests run yet. Click "Run All Tests" to begin.
          </p>
        )}
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e3f2fd',
        borderRadius: '4px'
      }}>
        <h4>🎯 Expected Results:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Products Fetch:</strong> Should return real products (not empty array)</li>
          <li><strong>Product Creation:</strong> Should get 201 response (not 405 error)</li>
          <li><strong>Image Upload:</strong> Should get 201 response (not 404 or CORS error)</li>
          <li><strong>Product Deletion:</strong> Should delete without CORS preflight failure</li>
        </ul>
        
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          All tests should pass ✅ if the backend fixes and CORS issues are resolved.
        </p>
      </div>
    </div>
  )
}

export default BackendTest
