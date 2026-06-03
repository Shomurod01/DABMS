const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
      filelist.push(filePath);
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

const replacements = [
  { regex: /text-gray-500/g, replacement: 'text-white/50' },
  { regex: /text-gray-600/g, replacement: 'text-white/60' },
  { regex: /text-gray-700/g, replacement: 'text-white/80' },
  { regex: /text-gray-900/g, replacement: 'text-white' },
  { regex: /border-gray-200/g, replacement: 'border-white/10' },
  { regex: /border-gray-300/g, replacement: 'border-white/20' },
  { regex: /bg-gray-50/g, replacement: 'bg-white/5' },
  { regex: /bg-gray-100/g, replacement: 'bg-white/10' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Reverted ${file}`);
  }
});
