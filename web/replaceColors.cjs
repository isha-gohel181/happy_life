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
    
    // Replace hex
    let newContent = content
        .replace(/#b1e346/gi, '#8B5CF6')
        // Replace rgb/rgba variants
        .replace(/163,\s*230,\s*53/g, '139, 92, 246')
        .replace(/177,\s*227,\s*70/g, '139, 92, 246')
        // Replace bg-[#b1e346] classes with bg-accent or exact hex
        .replace(/bg-\[#b1e346\]/gi, 'bg-accent')
        .replace(/text-\[#b1e346\]/gi, 'text-accent')
        .replace(/border-\[#b1e346\]/gi, 'border-accent');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated:', file);
        count++;
    }
});
console.log(`Successfully updated colors in ${count} files.`);
