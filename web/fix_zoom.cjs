const fs = require('fs');
const path = 'd:/nexprism/lms_backend/controllers/zoomController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('approval_type: 0', 'approval_type: 2');
if (!content.includes('meeting_authentication: false')) {
    content = content.replace('mute_upon_entry: true,', 'mute_upon_entry: true,\n                meeting_authentication: false,');
}

fs.writeFileSync(path, content);
console.log('Successfully updated zoomController.js');
