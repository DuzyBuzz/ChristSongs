# ChristSongs

ChristSongs is a mobile-first Ionic Angular application for worship teams and community uploaders. It keeps browsing public by default, uses Google sign-in only for write and sync actions, loads arrangements on demand, and supports offline reading for account-backed song saves.

## Stack

- Ionic Angular 8 with Angular 20 standalone components
- Capacitor 8
- Firebase Authentication with Google Sign-In
- Cloud Firestore with local persistence enabled
- Firebase Admin seed tooling for demo content
- Tailwind CSS layered on top of Ionic theming

## Implemented MVP Scope

- Guest-first splash bootstrap into the public song library
- Google sign-in flow via Firebase Auth only for protected actions
- Firestore-backed user profile upsert
- Home feed with recent and popular songs
- Firestore-friendly search by title, artist, uploader, and instrument
- Song detail with lazy arrangement loading by instrument
- Post-login continuation for favorite, offline, upload, and edit actions
- Create, edit, and delete flows for uploader-owned songs
- Favorites and offline song registration per user
- Profile summary counts and persisted settings
- Shared branding assets for auth, header, profile, and native app resources
- Five admin-seeded public demo songs with arrangements
- Firestore rules and indexes for the implemented queries

## Architecture

The app is organized by feature and keeps cross-cutting concerns in `src/app/core`, reusable UI in `src/app/shared`, and Firestore-facing logic inside focused services.

- `src/app/core`: providers, guards, auth/session services, layout shells, route constants
- `src/app/shared`: reusable UI, validators, and utilities
- `src/app/models`: cross-feature domain models
- `src/app/features/auth`: splash and sign-in flow
- `src/app/features/songs`: browsing, search support utilities, arrangement loading
- `src/app/features/uploads`: reactive editor, payload mapping, owner-safe mutations
- `src/app/features/library`: favorites and offline collections
- `src/app/features/profile`: profile summary and sign-out
- `src/app/features/settings`: persisted local app settings
- `src/assets/branding`: official ChristSongs logo, splash, illustration, and icon assets
- `firebase/firestore/seed`: admin-based demo song seed scripts

## Firestore Data Shape

Collections used by the app:

- `users/{uid}`
- `songs/{songId}`
- `songs/{songId}/arrangements/{arrangementId}`
- `users/{uid}/favorites/{songId}`
- `users/{uid}/offlineSongs/{songId}`
- `reports/{reportId}`

Main design decisions:

- guests can read `active` public songs and their arrangements without authentication
- `songs` stores only metadata needed for listing and search
- arrangement content lives in the `arrangements` subcollection
- arrangement documents are addressed by normalized instrument id when possible to reduce reads
- personal collections stay owner-only under `users/{uid}`
- most screens use one-time reads instead of realtime listeners

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Review the Firebase config in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

3. Ensure Firebase Authentication has Google Sign-In enabled and your app domain is allowed.

4. If you want to seed the shared demo catalog, provide Firebase admin credentials through either `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON`.

5. Start the app locally.

```bash
npx ng serve
```

6. Build the production web bundle used by Capacitor.

```bash
npx ng build
```

7. Preview the demo seed payload or write it to Firestore.

```bash
npm run seed:demo:dry
npm run seed:demo
```

## Capacitor

The generated web bundle is written to `www`, which matches the Capacitor config.

Useful commands:

```bash
npx cap sync
npx cap open android
npx cap open ios
```

The current auth flow uses Firebase Auth popup on web and redirect on native runtime because only Firebase web configuration was provided in this repository. Before shipping native builds, verify authorized domains, redirect handling, and any platform-specific deep-link requirements in your Firebase project.

The bundled native resource placeholders live under `resources/android/icon` and `resources/ios/icon`, using the same ChristSongs icon asset as the web build.

## Firestore Deployment

Deploy the included rules and indexes with the Firebase CLI after selecting the target project.

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Files included:

- `firestore.rules`
- `firestore.indexes.json`

## Notes

- Browsing home, search, and song detail is intentionally public.
- Uploads, favorites, offline sync, profile, and owner edits redirect through Google sign-in only when those actions are attempted.
- Offline reading relies on Firestore local persistence plus the per-user `offlineSongs` collection.
- Favorites are stored per user. The `favoritesCount` field remains in the schema for future server-side aggregation, but client writes do not mutate song ownership metadata.
- Song metadata updates and deletes remain owner-only to match the security model.
- Demo seeding uses the Firebase Admin SDK, so it requires admin credentials and bypasses client security rules by design.

## Validation

The current codebase has been validated with:

```bash
npx ng build
```