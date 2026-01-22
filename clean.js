const fs = require('fs');
const path = require('path');

// Directories to clean
const dirsToClean = ['dist'];

console.log('🧹 Cleaning build directories...');

dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`  Removing ${dir}/...`);
        fs.rmSync(dir, { recursive: true, force: true });
    } else {
        console.log(`  ${dir}/ not found, skipping...`);
    }
});

console.log('✅ Cleanup complete!');