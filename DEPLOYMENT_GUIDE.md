# ChristSongs - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Capacitor CLI installed: `npm install -g @capacitor/cli`
- Git repository access
- Firebase project configured (christsongs-app)
- Google Cloud project for Google Sign-In

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ChristSongs
npm install
```

### 2. Firebase Configuration

The Firebase configuration is already set in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

**Configuration values:**
```typescript
{
  apiKey: 'AIzaSyAtMnkD-27RM-93JadM-gm2K_l8SVt7zG8',
  authDomain: 'christsongs-app.firebaseapp.com',
  projectId: 'christsongs-app',
  storageBucket: 'christsongs-app.firebasestorage.app',
  messagingSenderId: '777054310400',
  appId: '1:777054310400:web:1f713591ff47b1739248e5',
  measurementId: 'G-DEZGVMTPBE',
}
```

### 3. Start Development Server

```bash
npm start
# or
npx ng serve
```

The app will be available at `http://localhost:4200`

## Firebase Setup

### 1. Login to Firebase

```bash
firebase login
```

### 2. Select Project

```bash
firebase use christsongs-app
```

### 3. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

This deploys the security rules from `firestore.rules`.

### 4. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

This deploys the composite indexes from `firestore.indexes.json`.

### 5. Enable Authentication Providers

In Firebase Console:
1. Go to Authentication > Sign-in method
2. Enable Google Sign-In provider
3. Add authorized domains:
   - `localhost` (for development)
   - Your production domain
   - Your Capacitor app domain

## Web Deployment

### Option 1: Firebase Hosting

1. **Build the production bundle:**
   ```bash
   npm run build
   ```

2. **Initialize Firebase Hosting (first time only):**
   ```bash
   firebase init hosting
   ```
   - Select `www` as the public directory
   - Configure as single-page app: Yes
   - Don't overwrite index.html

3. **Deploy to Firebase Hosting:**
   ```bash
   firebase deploy --only hosting
   ```

### Option 2: Custom Web Server

1. **Build the production bundle:**
   ```bash
   npm run build
   ```

2. **Deploy the `www` directory to your web server**

The app requires:
- HTTPS (for Google Sign-In)
- Single Page Application routing
- Proper MIME types for static assets

## Mobile Deployment

### Prerequisites

- **For Android:**
  - Android Studio installed
  - Android SDK configured
  - Java JDK 11+

- **For iOS:**
  - Xcode installed
  - Apple Developer account
  - macOS machine

### 1. Build Web Assets

```bash
npm run build
```

### 2. Sync Capacitor

```bash
npx cap sync
```

This copies the web assets to native platforms and updates native dependencies.

### 3. Android Deployment

#### Development Build

```bash
npx cap open android
```

This opens Android Studio. Then:
1. Wait for Gradle sync
2. Click Run (green play button)
3. Select device/emulator

#### Production Build

In Android Studio:
1. Build > Generate Signed Bundle / APK
2. Select Android App Bundle
3. Create/select keystore
4. Build release bundle
5. Upload to Google Play Console

**Before release:**
- Update `android/app/build.gradle` version
- Test on physical devices
- Update app icons and splash screens

### 4. iOS Deployment

#### Development Build

```bash
npx cap open ios
```

This opens Xcode. Then:
1. Select your development team
2. Configure signing
3. Select device/simulator
4. Click Run

#### Production Build

In Xcode:
1. Product > Archive
2. Upload to App Store Connect
3. Submit for review

**Before release:**
- Update version in Xcode
- Configure provisioning profiles
- Test on physical devices
- Update app icons and launch screens

## Firebase Authentication Configuration

### Google Sign-In for Web

Already configured in the Firebase project. Ensure authorized domains include:
- `localhost` (development)
- Your production web domain

### Google Sign-In for Android

1. Get SHA-1 fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. Add to Firebase Console:
   - Project Settings > Your apps > Android app
   - Add SHA-1 fingerprint

3. Download `google-services.json`
4. Place in `android/app/` directory

### Google Sign-In for iOS

1. Add iOS app in Firebase Console
2. Download `GoogleService-Info.plist`
3. Add to Xcode project
4. Configure URL schemes in Xcode

## Environment-Specific Configuration

### Development

Uses `src/environments/environment.ts`
- Firebase config pointing to dev project (if separate)
- Debug logging enabled
- Development API endpoints

### Production

Uses `src/environments/environment.prod.ts`
- Firebase config pointing to production project
- Production optimizations
- Analytics enabled

## Seeding Demo Data

### Prerequisites

Set up Firebase Admin credentials:

**Option 1: Service Account Key**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
```

**Option 2: Environment Variable**
```bash
export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

### Seed Commands

**Dry run (preview):**
```bash
npm run seed:demo:dry
```

**Actual seeding:**
```bash
npm run seed:demo
```

This creates 5 demo songs with arrangements in your Firestore database.

## Post-Deployment Checklist

### Firebase Console

- [ ] Firestore rules deployed
- [ ] Firestore indexes created
- [ ] Google Sign-In enabled
- [ ] Authorized domains added
- [ ] App Check configured (recommended)
- [ ] Analytics enabled

### Security

- [ ] Firestore rules tested
- [ ] Authentication flow tested
- [ ] Ownership validation tested
- [ ] Input validation working
- [ ] API keys secured

### Performance

- [ ] Production build optimized
- [ ] Lazy loading working
- [ ] Offline persistence enabled
- [ ] Images optimized
- [ ] Bundle size reasonable

### Mobile Specific

- [ ] Deep linking configured (if needed)
- [ ] Push notifications configured (if needed)
- [ ] App icons set
- [ ] Splash screens set
- [ ] Store listings prepared
- [ ] Privacy policy added

## Monitoring and Analytics

### Firebase Analytics

Already configured with `measurementId: 'G-DEZGVMTPBE'`

Track custom events:
```typescript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();
logEvent(analytics, 'song_viewed', {
  song_id: 'abc123',
  instrument: 'guitar'
});
```

### Error Monitoring

Consider adding:
- Sentry
- Firebase Crashlytics (for mobile)
- Google Cloud Error Reporting

### Performance Monitoring

- Firebase Performance Monitoring
- Web Vitals tracking
- Custom performance marks

## Troubleshooting

### Build Errors

**Error: Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: Angular CLI version mismatch**
```bash
npm install -g @angular/cli@latest
```

### Firebase Errors

**Error: Permission denied**
- Check Firestore rules
- Verify authentication
- Check user permissions

**Error: Index not found**
- Deploy Firestore indexes
- Wait 1-2 minutes for indexes to build

### Capacitor Errors

**Error: Plugin not found**
```bash
npx cap sync
```

**Error: Web assets not found**
```bash
npm run build
npx cap copy
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Update Angular
ng update @angular/core @angular/cli

# Update Ionic
npm install @ionic/angular@latest

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest
```

### Database Maintenance

- Monitor Firestore usage
- Review security rules regularly
- Optimize indexes
- Archive old data if needed

## Support

For issues and questions:
1. Check the README.md
2. Review the VALIDATION_REPORT.md
3. Consult Firebase documentation
4. Check Ionic/Angular documentation

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Ionic Documentation](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
