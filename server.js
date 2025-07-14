const express = require('express');
const path = require('path');
const app = express();

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle SPA routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 QuickThrift server running on port ${PORT}`);
  console.log(`📱 PWA available at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Server shutting down gracefully...');
  process.exit(0);
});
