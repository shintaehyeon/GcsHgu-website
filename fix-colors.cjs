const fs = require('fs');
const path = require('path');

const filePaths = [
    'src/GCSPage.jsx',
    'src/pages/BoardPage.jsx',
    'src/pages/AdminPage.jsx',
    'src/pages/LoginPage.jsx',
];

filePaths.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Fix weird fallback var
        content = content.replace(/\[var\(--fallback-remove-me-900,\s*#2d4b15\)\]/g, 'gcs-900');
        
        // Fix remaining blue buttons (4B89DC -> gcs-500, 3572C6 -> gcs-600)
        content = content.replace(/#4B89DC/g, 'var(--tw-colors-gcs-500)');
        content = content.replace(/#3572C6/g, 'var(--tw-colors-gcs-600)');
        content = content.replace(/bg-\[#4B89DC\]/g, 'bg-gcs-500');
        content = content.replace(/hover:bg-\[#3572C6\]/g, 'hover:bg-gcs-600');
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', file);
    }
});
