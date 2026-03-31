const fs = require('fs');
const path = require('path');

const srcFiles = [
  path.join(__dirname, 'src/constants.ts'),
  path.join(__dirname, '../prey-pros-backend/database/seeders/001_seed_data.sql')
];

srcFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[^"']+/g, '');
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  } else {
    console.log('File not found:', filePath);
  }
});
