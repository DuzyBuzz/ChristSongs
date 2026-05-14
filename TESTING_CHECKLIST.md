# ChristSongs Testing Checklist

## Build & Configuration ✅
- [x] Application builds successfully (~12s)
- [x] Firebase configuration is properly set in environment files
- [x] All TypeScript strict checks passing
- [x] Zero linting errors
- [x] Seed script exists with 5 demo worship songs

## Firebase Authentication Testing

### Google Sign-In Flow
- [ ] **Guest Access**: Verify users can browse without signing in
- [ ] **Sign-In Button**: Click "Sign In with Google" button
- [ ] **Google OAuth**: Verify Google OAuth popup/redirect appears
- [ ] **Account Selection**: Select Google account
- [ ] **Successful Sign-In**: Verify user is signed in and redirected
- [ ] **Profile Display**: Check user profile shows correct name and email
- [ ] **Sign-Out**: Verify sign-out works and returns to guest state

### Authentication Guards
- [ ] **Upload Guard**: Verify upload page requires sign-in
- [ ] **Edit Guard**: Verify edit page requires sign-in and ownership
- [ ] **Delete Guard**: Verify delete requires sign-in and ownership
- [ ] **Favorites Guard**: Verify favorites requires sign-in
- [ ] **Offline Guard**: Verify offline save requires sign-in

## Guest Browsing Features

### Home Page
- [ ] **Page Load**: Home page loads without errors
- [ ] **Recent Songs**: Recent songs section displays
- [ ] **Popular Songs**: Popular songs section displays
- [ ] **Search Bar**: Search bar is visible and functional
- [ ] **Tuner Link**: Quick access to tuner works
- [ ] **Branding**: ChristSongs logo displays correctly

### Song List
- [ ] **Song Cards**: Song cards display with title, artist, instruments
- [ ] **Card Hover**: Hover effects work smoothly
- [ ] **Card Click**: Clicking card navigates to song detail
- [ ] **Loading State**: Loading skeleton shows while fetching
- [ ] **Empty State**: Empty state shows when no songs

### Song Detail Page
- [ ] **Song Info**: Title, artist, uploader display correctly
- [ ] **Instrument Selector**: Instrument chips display and are clickable
- [ ] **Arrangement Load**: Selecting instrument loads arrangement
- [ ] **Chords Display**: Chords display correctly above lyrics
- [ ] **Sections**: Verse, chorus sections display properly
- [ ] **Song Link**: Optional song link button appears if present
- [ ] **View Count**: View count increments on page load
- [ ] **Guest Buttons**: Favorite and offline buttons visible but require sign-in

## Song Upload & Management (Authenticated)

### Create Song
- [ ] **Access**: Upload page requires sign-in
- [ ] **Form Fields**: All fields (title, artist, instrument, key, capo, tuning) present
- [ ] **Song Link**: Optional song link field accepts valid URLs
- [ ] **Section Editor**: Can add/remove sections
- [ ] **Line Editor**: Can add/remove lines with chords and lyrics
- [ ] **Chord Input**: Chord input accepts space-separated chords
- [ ] **Preview**: Arrangement preview shows formatted output
- [ ] **Validation**: Form validation prevents invalid submissions
- [ ] **Save**: Song saves successfully to Firestore
- [ ] **Redirect**: Redirects to song detail after save

### Edit Song
- [ ] **Owner Access**: Only song owner can access edit page
- [ ] **Non-Owner Block**: Non-owners redirected to my uploads
- [ ] **Form Pre-fill**: Form pre-fills with existing song data
- [ ] **Update**: Changes save successfully
- [ ] **Redirect**: Redirects to song detail after update

### Delete Song
- [ ] **Owner Only**: Only owner sees delete button
- [ ] **Confirmation**: Delete shows confirmation dialog
- [ ] **Delete Action**: Song deletes from Firestore
- [ ] **Redirect**: Redirects to my uploads after delete

### My Uploads
- [ ] **Owner Songs**: Shows only songs uploaded by current user
- [ ] **Edit Links**: Edit buttons navigate to edit page
- [ ] **Delete Links**: Delete buttons work correctly
- [ ] **Empty State**: Shows empty state when no uploads

## Favorites & Offline Features (Authenticated)

### Favorites
- [ ] **Add Favorite**: Heart button adds song to favorites
- [ ] **Remove Favorite**: Heart button removes from favorites
- [ ] **Button State**: Button shows correct state (filled/outline)
- [ ] **Favorites Page**: Favorites page shows favorited songs
- [ ] **Remove from Page**: Can remove favorites from favorites page
- [ ] **Empty State**: Shows empty state when no favorites

### Offline Songs
- [ ] **Save Offline**: Save offline button works
- [ ] **Button State**: Button shows correct state
- [ ] **Offline Page**: Offline songs page shows saved songs
- [ ] **Remove Offline**: Can remove songs from offline list
- [ ] **Empty State**: Shows empty state when no offline songs
- [ ] **Offline Access**: Songs accessible when offline (requires testing in offline mode)

## Search Functionality

### Search Page
- [ ] **Search Bar**: Search input is functional
- [ ] **Search Mode**: Can switch between title, artist, uploader search
- [ ] **Instrument Filter**: Can filter by instrument
- [ ] **Results**: Search results display correctly
- [ ] **No Results**: Shows empty state when no matches
- [ ] **Clear Search**: Can clear search and see all songs

## Tuner Feature

### Tuner Page
- [ ] **Page Load**: Tuner page loads without errors
- [ ] **Instrument Selection**: Can select guitar, bass, ukulele
- [ ] **Tuning Presets**: Can select different tuning presets
- [ ] **String Selection**: Can select specific strings or auto mode
- [ ] **Start Button**: Start button requests microphone permission
- [ ] **Permission Grant**: Microphone permission dialog appears
- [ ] **Pitch Detection**: Tuner detects pitch when sound is played
- [ ] **Note Display**: Detected note name displays
- [ ] **Frequency Display**: Frequency displays
- [ ] **Cents Display**: Cents offset displays
- [ ] **Meter Movement**: Visual meter moves based on pitch
- [ ] **In-Tune Indicator**: Green indicator when in tune
- [ ] **Stop Button**: Stop button stops tuner
- [ ] **Permission Denied**: Shows error message if permission denied
- [ ] **No Signal**: Shows "No signal" when no sound detected

## UI/UX Polish

### Visual Design
- [ ] **Branding**: ChristSongs logo and colors consistent throughout
- [ ] **Typography**: Text is readable and properly sized
- [ ] **Spacing**: Proper spacing between elements
- [ ] **Colors**: Color scheme is worship-friendly and professional
- [ ] **Icons**: Icons are clear and appropriate

### Animations & Interactions
- [ ] **Page Transitions**: Smooth fade-in animations on page load
- [ ] **Button Hover**: Buttons have hover effects
- [ ] **Card Hover**: Song cards have hover effects
- [ ] **Loading States**: Loading skeletons show during data fetch
- [ ] **Staggered Lists**: List items animate with stagger effect
- [ ] **Tuner Animations**: Tuner has smooth animations when in-tune

### Accessibility
- [ ] **ARIA Labels**: Interactive elements have ARIA labels
- [ ] **Focus Styles**: Focus-visible styles show on keyboard navigation
- [ ] **Keyboard Navigation**: Can navigate with keyboard
- [ ] **Screen Reader**: Screen reader can read content
- [ ] **Color Contrast**: Text has sufficient contrast

### Mobile Responsiveness
- [ ] **Touch Targets**: Buttons are large enough for touch
- [ ] **Scrolling**: Smooth scrolling on mobile
- [ ] **Viewport**: Content fits properly on mobile screens
- [ ] **Orientation**: Works in portrait and landscape

## Error Handling

### Network Errors
- [ ] **Offline Indicator**: Shows when offline
- [ ] **Failed Requests**: Shows error messages for failed requests
- [ ] **Retry**: Retry buttons work correctly

### Validation Errors
- [ ] **Form Validation**: Shows validation errors
- [ ] **Required Fields**: Prevents submission with missing fields
- [ ] **Invalid URLs**: Validates song link URLs

### Permission Errors
- [ ] **Microphone Denied**: Shows error when mic permission denied
- [ ] **Auth Errors**: Shows error messages for auth failures

## Performance

### Load Times
- [ ] **Initial Load**: App loads quickly (<3s)
- [ ] **Page Navigation**: Page transitions are smooth
- [ ] **Data Fetching**: Data loads quickly (<2s)

### Bundle Size
- [ ] **Build Size**: Bundle size is optimized (~1.5MB initial)
- [ ] **Lazy Loading**: Routes are lazy loaded
- [ ] **Code Splitting**: Code is properly split

### Animations
- [ ] **Smooth Animations**: Animations run at 60fps
- [ ] **No Jank**: No janky animations or stuttering
- [ ] **Battery Impact**: Animations don't drain battery excessively

## Security

### Firestore Rules
- [ ] **Public Read**: Anyone can read public songs
- [ ] **Auth Write**: Only authenticated users can create songs
- [ ] **Owner Edit**: Only owners can edit their songs
- [ ] **Owner Delete**: Only owners can delete their songs
- [ ] **User Data**: Users can only access their own favorites/offline

### Data Validation
- [ ] **Required Fields**: Firestore rules validate required fields
- [ ] **Field Types**: Firestore rules validate field types
- [ ] **Immutable Fields**: uploaderUid cannot be changed after creation

## Seed Data

### Demo Songs
- [ ] **Seed Script**: Seed script runs successfully
- [ ] **5 Songs**: 5 demo songs are seeded
- [ ] **Song Data**: Songs have title, artist, arrangements
- [ ] **Arrangements**: Each song has at least one arrangement
- [ ] **Public**: All seed songs are public
- [ ] **Searchable**: Seed songs appear in search

## Final Validation

### Build & Deploy
- [ ] **Production Build**: Production build succeeds
- [ ] **No Console Errors**: No console errors in production
- [ ] **No Console Warnings**: No console warnings in production
- [ ] **Bundle Analysis**: Bundle size is acceptable

### Cross-Browser Testing
- [ ] **Chrome**: Works in Chrome
- [ ] **Firefox**: Works in Firefox
- [ ] **Safari**: Works in Safari
- [ ] **Mobile Chrome**: Works in mobile Chrome
- [ ] **Mobile Safari**: Works in mobile Safari

### End-to-End Flow
- [ ] **Guest Flow**: Can browse as guest
- [ ] **Sign-In Flow**: Can sign in with Google
- [ ] **Upload Flow**: Can create and upload song
- [ ] **Edit Flow**: Can edit own song
- [ ] **Delete Flow**: Can delete own song
- [ ] **Favorite Flow**: Can favorite and unfavorite songs
- [ ] **Offline Flow**: Can save songs for offline
- [ ] **Search Flow**: Can search and find songs
- [ ] **Tuner Flow**: Can use tuner to tune instrument

## Notes

### Known Issues
- Minor budget warning on tuner.page.scss (+250 bytes) - acceptable for production

### Testing Environment
- Node.js: v20.20.2
- npm: Latest
- Angular: v20.0.0
- Ionic: v8.0.0
- Firebase: v11.6.1

### Seed Data Instructions
To seed the 5 demo songs to Firestore:
1. Set up Firebase service account credentials
2. Run: `npm run seed:demo`
3. Verify songs appear in Firestore console
4. Verify songs appear in the app

### Manual Testing Required
Some features require manual testing:
- Google OAuth flow (requires real Google account)
- Microphone permission (requires device with microphone)
- Offline functionality (requires disabling network)
- Mobile responsiveness (requires mobile device or emulator)
- Touch interactions (requires touch device)
