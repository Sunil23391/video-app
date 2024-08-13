const { execSync } = require('child_process');
const fs = require('fs');

const argv = require('yargs').argv;
const dir = argv.directory

if (fs.existsSync(`./${dir}/node_modules`)) {
    execSync(`cd ${dir} && npm start`, { stdio: 'inherit' });
} else {
    execSync(`cd ${dir} && npm install && npm start`, { stdio: 'inherit' });
}