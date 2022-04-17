const { exec } = require('child_process');

exec('cp package.json ./dist/package.json');
exec('cp README.md ./dist/README.md');
