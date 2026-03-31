const fs = require('fs');
let c = fs.readFileSync('src/constants.ts','utf8');
c = c.replace(/imageUrl:\s*["']https:\/\/picsum\.photos\/seed\/[^"']+["'],?/g, 'imageUrl: "",');
fs.writeFileSync('src/constants.ts', c);
console.log("Replaced picsum items");
