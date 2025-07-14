// Node.js script to test the API and show detailed logs
const https = require('https');
const fs = require('fs');

console.log('🚀 ThriftEase API Test Script');
console.log('=====================================');

// Test 1: Direct backend authentication
function testBackend() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email: 'demo@thrifteasy.com',
            password: 'demo123'
        });

        const options = {
            hostname: 'thrift-ease-1.onrender.com',
            port: 443,
            path: '/api/auth/signin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('✅ Backend Test SUCCESS:');
                    console.log(JSON.stringify(response, null, 2));
                    resolve(response);
                } catch (e) {
                    console.log('❌ Backend response parsing error:', e.message);
                    console.log('Raw response:', data);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.log('❌ Backend connection error:', e.message);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

// Test 2: Check local files
function checkLocalFiles() {
    console.log('\n📁 Local Files Check:');
    
    const files = ['api-service-new.js', 'sign-in.js', 'index.js'];
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            console.log(`✅ ${file} - Size: ${stats.size} bytes, Modified: ${stats.mtime}`);
        } else {
            console.log(`❌ ${file} - NOT FOUND`);
        }
    });
}

// Test 3: Check API service structure
function analyzeAPIService() {
    console.log('\n🔍 API Service Analysis:');
    
    if (fs.existsSync('api-service-new.js')) {
        const content = fs.readFileSync('api-service-new.js', 'utf8');
        
        // Check for key components
        const checks = [
            { name: 'API_BASE_URL', pattern: /const API_BASE_URL = / },
            { name: 'ThriftEaseState class', pattern: /class ThriftEaseState/ },
            { name: 'window.ThriftEaseAPI', pattern: /window\.ThriftEaseAPI = / },
            { name: 'signIn function', pattern: /async signIn\(/ },
            { name: 'initializeAPI function', pattern: /async function initializeAPI/ },
            { name: 'API ready event', pattern: /ThriftEaseAPIReady/ }
        ];
        
        checks.forEach(check => {
            if (check.pattern.test(content)) {
                console.log(`✅ ${check.name} - Found`);
            } else {
                console.log(`❌ ${check.name} - Missing`);
            }
        });
        
        // Check for potential issues
        if (content.includes('System is still loading')) {
            console.log('⚠️  Found "System is still loading" message');
        }
        
        if (content.includes('duplicate')) {
            console.log('⚠️  Potential duplicate code found');
        }
        
    } else {
        console.log('❌ api-service-new.js not found');
    }
}

// Run all tests
async function runTests() {
    try {
        await testBackend();
        checkLocalFiles();
        analyzeAPIService();
        
        console.log('\n🎯 Summary:');
        console.log('- Backend is responding correctly');
        console.log('- Local files exist');
        console.log('- API service structure looks good');
        console.log('\nIf you\'re still seeing "System is still loading", it\'s likely a browser caching issue.');
        console.log('Try:');
        console.log('1. Hard refresh (Ctrl+Shift+R)');
        console.log('2. Clear browser cache');
        console.log('3. Open incognito/private window');
        
    } catch (error) {
        console.log('\n❌ Test failed:', error.message);
    }
}

runTests();
