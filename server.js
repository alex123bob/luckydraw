const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6006;

console.log('🚀 Lucky Draw Development Server');
console.log('📁 Serving from: public/, css/, js/, data/');
console.log('💡 For production, use: npm run build');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve CSS and JS from their directories
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Development server: http://localhost:${PORT}`);
    console.log(`📱 Open in your browser to start developing`);
    console.log(`\n✨ Production build commands:`);
    console.log(`   npm run build           # Build for /luckydraw/`);
    console.log(`   npm run build:root      # Build for root /`);
    console.log(`   npm run preview         # Preview build locally`);
});