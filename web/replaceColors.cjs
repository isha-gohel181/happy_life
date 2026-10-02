const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const targetDir = path.resolve(__dirname, 'src');
const files = walk(targetDir);
let count = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace hex and rgba variants of the orange/amber theme to blue #2171B5
    let newContent = content
        .replace(/#D99B2A/gi, '#2171B5')
        .replace(/217,\s*155,\s*42/g, '33, 113, 181')
        .replace(/#c2841f/gi, '#1b5c94')
        .replace(/#f3b94a/gi, '#4b9ee5')
        .replace(/#fbf9f4/gi, '#f8fafc');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated:', file);
        count++;
    }
});
console.log(`Successfully updated theme colors in ${count} files.`);
