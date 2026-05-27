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
  { regex: /text-white\/40/g, replacement: 'text-gray-500' },
  { regex: /text-white\/50/g, replacement: 'text-gray-500' },
  { regex: /text-white\/60/g, replacement: 'text-gray-600' },
  { regex: /text-white\/70/g, replacement: 'text-gray-600' },
  { regex: /text-white\/80/g, replacement: 'text-gray-700' },
  { regex: /text-white/g, replacement: 'text-gray-900' },
  { regex: /border-white\/5/g, replacement: 'border-gray-200' },
  { regex: /border-white\/10/g, replacement: 'border-gray-200' },
  { regex: /border-white\/20/g, replacement: 'border-gray-300' },
  { regex: /bg-white\/5/g, replacement: 'bg-gray-50' },
  { regex: /bg-white\/10/g, replacement: 'bg-gray-100' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
