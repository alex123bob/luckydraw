const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6006;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve CSS and JS from their directories
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Add base path middleware for proxy support
app.use((req, res, next) => {
    // Store original URL for reference
    req.originalBaseUrl = req.baseUrl || '';
    next();
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Lucky Draw app running at http://localhost:${PORT}`);
    console.log(`📱 Open in your browser to start using the app`);
    console.log(`✨ Features:`);
    console.log(`   • Add/Edit/Delete users`);
    console.log(`   • Random lucky draw with animation`);
    console.log(`   • Winner history tracking`);
    console.log(`   • Responsive design for all devices`);
    console.log(`   • Data persistence with local storage`);
    console.log(`   • Export/Import functionality`);
});