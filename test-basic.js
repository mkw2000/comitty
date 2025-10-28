#!/usr/bin/env node

// Simple test to verify CLI works
const { execSync } = require('child_process');
const path = require('path');

try {
  // Test help command
  console.log('Testing --help command...');
  const helpOutput = execSync(`node ${path.join(__dirname, 'dist/cli.js')} --help`, {
    encoding: 'utf-8'
  });
  console.log('✅ Help command works');
  console.log('Sample output:');
  console.log(helpOutput.split('\n').slice(0, 10).join('\n') + '\n...');

  // Test version command
  console.log('\nTesting --version command...');
  const versionOutput = execSync(`node ${path.join(__dirname, 'dist/cli.js')} --version`, {
    encoding: 'utf-8'
  });
  console.log('✅ Version command works:', versionOutput.trim());

  console.log('\n🎉 Basic CLI functionality verified!');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}