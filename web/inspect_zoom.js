const fs = require('fs');
const content = fs.readFileSync('d:/nexprism/lms_backend/controllers/zoomController.js', 'utf8');
const lines = content.split('\n');

let start = -1;
let end = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('/users/me/meetings')) {
        start = Math.max(0, i - 10);
    }
    if (start !== -1 && i > start && lines[i].includes('res.status(201)')) {
        end = i + 5;
        break;
    }
}

const section = lines.slice(start, end).join('\n');
console.log(section);

fs.writeFileSync('d:/nexprism/Edrilla-2.0/tmp_zoom_inspection.txt', section);
