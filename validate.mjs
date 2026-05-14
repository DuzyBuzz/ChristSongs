#!/usr/bin/env node

/**
 * Automated validation script for ChristSongs application
 * Tests build, configuration, and code quality
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();
const REQUIRED_FILES = [
  'src/environments/environment.ts',
  'src/environments/environment.prod.ts',
  'firestore.rules',
  'firebase/firestore/seed/demo-songs.mjs',
  'firebase/firestore/seed/run-demo-seed.mjs',
  'src/app/core/services/auth.service.ts',
  'src/app/features/auth/services/google-auth-adapter.service.ts',
  'src/app/features/songs/services/song-query.service.ts',
  'src/app/features/uploads/services/song-editor.service.ts',
  'src/app/features/tuner/services/tuner.service.ts',
];

const REQUIRED_GUARDS = [
  'src/app/core/guards/sign-in-required.guard.ts',
  'src/app/core/guards/guest.guard.ts',
  'src/app/features/uploads/guards/song-owner.guard.ts',
];

const REQUIRED_PAGES = [
  'src/app/features/songs/pages/home/home.page.ts',
  'src/app/features/songs/pages/song-detail/song-detail.page.ts',
  'src/app/features/search/pages/search/search.page.ts',
  'src/app/features/uploads/pages/create-song/create-song.page.ts',
  'src/app/features/uploads/pages/edit-song/edit-song.page.ts',
  'src/app/features/uploads/pages/my-uploads/my-uploads.page.ts',
  'src/app/features/tuner/pages/tuner/tuner.page.ts',
  'src/app/features/library/pages/favorites/favorites.page.ts',
  'src/app/features/library/pages/offline-songs/offline-songs.page.ts',
  'src/app/features/profile/pages/profile/profile.page.ts',
];

let passedTests = 0;
let failedTests = 0;
const errors = [];

function log(message, type = 'info') {
  const prefix = {
    info: '  ',
    success: '✅',
    error: '❌',
    warning: '⚠️ ',
  }[type];
  console.log(`${prefix} ${message}`);
}

function test(name, fn) {
  try {
    fn();
    log(name, 'success');
    passedTests++;
    return true;
  } catch (error) {
    log(`${name}: ${error.message}`, 'error');
    errors.push({ test: name, error: error.message });
    failedTests++;
    return false;
  }
}

function fileExists(path) {
  const fullPath = join(ROOT_DIR, path);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${path}`);
  }
}

function fileContains(path, searchString) {
  const fullPath = join(ROOT_DIR, path);
  const content = readFileSync(fullPath, 'utf-8');
  if (!content.includes(searchString)) {
    throw new Error(`File ${path} does not contain: ${searchString}`);
  }
}

function runCommand(command, description) {
  try {
    execSync(command, { cwd: ROOT_DIR, stdio: 'pipe' });
    return true;
  } catch (error) {
    throw new Error(`${description} failed: ${error.message}`);
  }
}

console.log('\n🔍 ChristSongs Automated Validation\n');
console.log('=' .repeat(50));

// Test 1: Required Files
console.log('\n📁 Testing Required Files...');
REQUIRED_FILES.forEach((file) => {
  test(`File exists: ${file}`, () => fileExists(file));
});

// Test 2: Required Guards
console.log('\n🛡️  Testing Guards...');
REQUIRED_GUARDS.forEach((guard) => {
  test(`Guard exists: ${guard}`, () => fileExists(guard));
});

// Test 3: Required Pages
console.log('\n📄 Testing Pages...');
REQUIRED_PAGES.forEach((page) => {
  test(`Page exists: ${page}`, () => fileExists(page));
});

// Test 4: Firebase Configuration
console.log('\n🔥 Testing Firebase Configuration...');
test('Environment has Firebase config', () => {
  fileContains('src/environments/environment.ts', 'firebase');
  fileContains('src/environments/environment.ts', 'apiKey');
  fileContains('src/environments/environment.ts', 'projectId');
});

test('Firebase config has correct project ID', () => {
  fileContains('src/environments/environment.ts', 'christsongs-app');
});

// Test 5: Seed Data
console.log('\n🌱 Testing Seed Data...');
test('Seed script exists', () => {
  fileExists('firebase/firestore/seed/run-demo-seed.mjs');
});

test('Demo songs data exists', () => {
  fileExists('firebase/firestore/seed/demo-songs.mjs');
});

test('Demo songs has 5 songs', () => {
  const content = readFileSync(
    join(ROOT_DIR, 'firebase/firestore/seed/demo-songs.mjs'),
    'utf-8'
  );
  const matches = content.match(/id:\s*'seed-/g);
  if (!matches || matches.length !== 5) {
    throw new Error(`Expected 5 demo songs, found ${matches?.length || 0}`);
  }
});

test('Seed script dry-run works', () => {
  runCommand('npm run seed:demo:dry', 'Seed dry-run');
});

// Test 6: Authentication
console.log('\n🔐 Testing Authentication...');
test('Auth service exists', () => {
  fileExists('src/app/core/services/auth.service.ts');
});

test('Google Auth adapter exists', () => {
  fileExists('src/app/features/auth/services/google-auth-adapter.service.ts');
});

test('Auth service has Google Sign-In', () => {
  fileContains('src/app/core/services/auth.service.ts', 'signInWithGoogle');
});

test('Google Auth uses GoogleAuthProvider', () => {
  fileContains(
    'src/app/features/auth/services/google-auth-adapter.service.ts',
    'GoogleAuthProvider'
  );
});

// Test 7: Firestore Rules
console.log('\n🔒 Testing Firestore Rules...');
test('Firestore rules exist', () => {
  fileExists('firestore.rules');
});

test('Rules allow public read', () => {
  fileContains('firestore.rules', 'isPublic == true');
});

test('Rules enforce owner-only edit', () => {
  fileContains('firestore.rules', 'uploaderUid == request.auth.uid');
});

// Test 8: TypeScript Configuration
console.log('\n📘 Testing TypeScript Configuration...');
test('TypeScript strict mode enabled', () => {
  fileContains('tsconfig.json', '"strict": true');
});

// Test 9: Routing
console.log('\n🛣️  Testing Routing...');
test('App routes exist', () => {
  fileExists('src/app/app.routes.ts');
});

test('Routes have guards', () => {
  fileContains('src/app/app.routes.ts', 'signInRequiredGuard');
  fileContains('src/app/app.routes.ts', 'songOwnerGuard');
});

// Test 10: Build
console.log('\n🏗️  Testing Build...');
test('Application builds successfully', () => {
  runCommand('./node_modules/.bin/ng build --configuration production', 'Production build');
});

test('Build output exists', () => {
  fileExists('www/index.html');
});

// Test 11: Code Quality
console.log('\n✨ Testing Code Quality...');
test('No TODO comments in source', () => {
  const result = execSync(
    'grep -r "TODO\\|FIXME\\|XXX" src/app --include="*.ts" || true',
    { cwd: ROOT_DIR, encoding: 'utf-8' }
  );
  if (result.trim().length > 0) {
    throw new Error('Found TODO/FIXME/XXX comments in source code');
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Test Summary\n');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (errors.length > 0) {
  console.log('\n❌ Failed Tests:\n');
  errors.forEach(({ test, error }) => {
    console.log(`  • ${test}`);
    console.log(`    ${error}\n`);
  });
}

console.log('\n' + '='.repeat(50));

if (failedTests > 0) {
  console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed! Application is ready for deployment.\n');
  process.exit(0);
}
