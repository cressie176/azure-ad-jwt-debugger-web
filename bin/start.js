#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = process.cwd();

console.log('\n🚀 Starting Azure AD JWT Debugger Web...\n');

// Check if .env.local exists
const envLocalPath = join(projectRoot, '.env.local');
if (!existsSync(envLocalPath)) {
  console.error('⚠️  Warning: .env.local file not found!');
  console.error('');
  console.error('Please create a .env.local file with your Azure AD configuration:');
  console.error('');
  console.error('VITE_AZURE_TENANT_ID=your-tenant-id');
  console.error('VITE_AZURE_CLIENT_ID=your-client-id');
  console.error('VITE_API_URL=http://localhost:3002/api/debug/token');
  console.error('');
  console.error('See the README.md for more details.');
  console.error('');
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = join(projectRoot, 'node_modules');
if (!existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...\n');

  const install = spawn('npm', ['install'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  });

  install.on('close', (code) => {
    if (code !== 0) {
      console.error('\n❌ Failed to install dependencies');
      process.exit(1);
    }
    startDevServer();
  });
} else {
  startDevServer();
}

function startDevServer() {
  console.log('🔧 Starting Vite dev server...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  📍 Local:   http://localhost:5173');
  console.log('');
  console.log('  ⚙️  Azure AD redirect URI must be configured:');
  console.log('     http://localhost:5173 (SPA platform)');
  console.log('');
  console.log('  ⚙️  Backend service must be running at:');
  console.log('     http://localhost:3002');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const devServer = spawn('npm', ['run', 'dev'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  });

  devServer.on('close', (code) => {
    process.exit(code);
  });

  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down...\n');
    devServer.kill('SIGINT');
  });

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    devServer.kill('SIGTERM');
  });
}
