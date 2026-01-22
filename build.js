const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_DIR = 'dist';
const BASE_PATH = process.env.BASE_PATH || '/luckydraw/'; // Change to '/' if deploying to root

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Create subdirectories
['css', 'js', 'data'].forEach(dir => {
    const dirPath = path.join(BUILD_DIR, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Copy CSS file
const cssContent = fs.readFileSync('css/style.css', 'utf8');
fs.writeFileSync(path.join(BUILD_DIR, 'css', 'style.css'), cssContent);
console.log('✓ Copied CSS file');

// Copy JS file
const jsContent = fs.readFileSync('js/app.js', 'utf8');
fs.writeFileSync(path.join(BUILD_DIR, 'js', 'app.js'), jsContent);
console.log('✓ Copied JS file');

// Copy data file
const dataContent = fs.readFileSync('data/default-users.json', 'utf8');
fs.writeFileSync(path.join(BUILD_DIR, 'data', 'default-users.json'), dataContent);
console.log('✓ Copied data file');

// Process HTML file
let htmlContent = fs.readFileSync('public/index.html', 'utf8');

// Update paths in HTML for production
if (BASE_PATH === '/') {
    // For root deployment, use absolute paths
    htmlContent = htmlContent
        .replace('href="css/style.css"', 'href="/css/style.css"')
        .replace('src="js/app.js"', 'src="/js/app.js"');
} else {
    // For subdirectory deployment, use paths relative to base
    htmlContent = htmlContent
        .replace('href="css/style.css"', `href="${BASE_PATH}css/style.css"`)
        .replace('src="js/app.js"', `src="${BASE_PATH}js/app.js"`);
}

// Add base tag for subdirectory deployment
if (BASE_PATH !== '/') {
    const baseTag = `    <base href="${BASE_PATH}">`;
    const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    
    if (htmlContent.includes('<base href=')) {
        // Update existing base tag
        htmlContent = htmlContent.replace(/<base href="[^"]*">/, baseTag);
    } else {
        // Insert base tag after viewport meta
        htmlContent = htmlContent.replace(viewportMeta, `${viewportMeta}\n${baseTag}`);
    }
}

fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), htmlContent);
console.log('✓ Processed HTML file');

// Create a simple nginx configuration for the build
const nginxConfig = `# Nginx configuration for Lucky Draw static build
server {
    listen 80;
    server_name localhost;
    
    root /path/to/${BUILD_DIR};
    index index.html;
    
    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# For production at /luckydraw
# server {
#     listen 443 ssl;
#     server_name lijialab.com;
#     
#     location /luckydraw {
#         alias /path/to/${BUILD_DIR};
#         try_files $uri $uri/ /luckydraw/index.html;
#     }
# }
`;

fs.writeFileSync(path.join(BUILD_DIR, 'nginx-example.conf'), nginxConfig);
console.log('✓ Created nginx example configuration');

console.log('\n🎉 Build completed!');
console.log(`📁 Build output in: ${BUILD_DIR}/`);
console.log(`🌐 Base path: ${BASE_PATH}`);
console.log('\nTo deploy:');
console.log(`1. Copy ${BUILD_DIR}/ contents to your web server`);
console.log(`2. Configure nginx to serve from ${BASE_PATH}`);
console.log(`3. See ${BUILD_DIR}/nginx-example.conf for configuration`);