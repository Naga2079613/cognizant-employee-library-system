const { execSync } = require('child_process');

try {
  const output = execSync('npm run lint', { 
    encoding: 'utf8',
    cwd: process.cwd()
  });
  console.log('Lint output:', output);
} catch (error) {
  console.log('Lint errors found:');
  console.log('STDOUT:', error.stdout);
  console.log('STDERR:', error.stderr);
  console.log('Status:', error.status);
}
