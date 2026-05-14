# Seeding Demo Songs to Firestore

This guide explains how to seed the 5 demo worship songs to your Firestore database.

## Prerequisites

1. Firebase project set up (christsongs-app)
2. Firestore database created
3. Firebase Admin SDK credentials

## Option 1: Using Firebase Service Account (Recommended)

### Step 1: Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `christsongs-app`
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file securely

### Step 2: Set Environment Variable

```bash
# Linux/Mac
export FIREBASE_SERVICE_ACCOUNT_JSON='<paste-json-content-here>'

# Windows PowerShell
$env:FIREBASE_SERVICE_ACCOUNT_JSON='<paste-json-content-here>'

# Windows CMD
set FIREBASE_SERVICE_ACCOUNT_JSON=<paste-json-content-here>
```

### Step 3: Run Seed Script

```bash
npm run seed:demo
```

## Option 2: Using Application Default Credentials

If you have gcloud CLI installed and authenticated:

```bash
# Authenticate with gcloud
gcloud auth application-default login

# Set project
gcloud config set project christsongs-app

# Run seed script
npm run seed:demo
```

## Option 3: Manual Seeding via Firebase Console

If you prefer to manually add the songs:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `christsongs-app` project
3. Go to Firestore Database
4. Create the following collections and documents:

### Song 1: Holy Light

**Collection:** `songs`  
**Document ID:** `seed-holy-light`

```json
{
  "title": "Holy Light",
  "titleLower": "holy light",
  "artist": "ChristSongs Worship",
  "artistLower": "christsongs worship",
  "slug": "holy-light-christsongs-worship",
  "uploaderUid": "christsongs-demo",
  "uploaderName": "ChristSongs Team",
  "uploaderNameLower": "christsongs team",
  "isPublic": true,
  "status": "active",
  "instrumentsAvailable": ["guitar"],
  "searchKeywords": ["holy", "light", "christsongs", "worship"],
  "views": 186,
  "favoritesCount": 19,
  "version": 1,
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

**Subcollection:** `arrangements`  
**Document ID:** `guitar`

```json
{
  "instrument": "guitar",
  "key": "G",
  "capo": 2,
  "tuning": "standard",
  "transposeEnabled": true,
  "sections": [
    {
      "type": "verse",
      "title": "Verse 1",
      "lines": [
        {
          "lyrics": "When morning breaks Your mercy sings again",
          "chords": ["G", "D", "Em", "C"]
        },
        {
          "lyrics": "You lead our hearts from fear into Your praise",
          "chords": ["G", "D", "C", "D"]
        }
      ]
    },
    {
      "type": "chorus",
      "title": "Chorus",
      "lines": [
        {
          "lyrics": "Holy Light shine over every weary soul",
          "chords": ["G", "C", "Em", "D"]
        },
        {
          "lyrics": "Jesus Christ awaken us to hope again",
          "chords": ["G", "C", "Em", "D"]
        }
      ]
    }
  ],
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

### Song 2: Shepherd of Peace

**Collection:** `songs`  
**Document ID:** `seed-shepherd-of-peace`

```json
{
  "title": "Shepherd of Peace",
  "titleLower": "shepherd of peace",
  "artist": "Grace Harbor",
  "artistLower": "grace harbor",
  "slug": "shepherd-of-peace-grace-harbor",
  "uploaderUid": "christsongs-demo",
  "uploaderName": "ChristSongs Team",
  "uploaderNameLower": "christsongs team",
  "isPublic": true,
  "status": "active",
  "instrumentsAvailable": ["piano"],
  "searchKeywords": ["shepherd", "peace", "grace", "harbor"],
  "views": 142,
  "favoritesCount": 13,
  "version": 1,
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

**Subcollection:** `arrangements`  
**Document ID:** `piano`

```json
{
  "instrument": "piano",
  "key": "D",
  "capo": 0,
  "tuning": "standard",
  "transposeEnabled": true,
  "sections": [
    {
      "type": "verse",
      "title": "Verse 1",
      "lines": [
        {
          "lyrics": "In restless nights You guard my heart with peace",
          "chords": ["D", "A", "Bm", "G"]
        },
        {
          "lyrics": "Your steady voice becomes my refuge song",
          "chords": ["D", "A", "G", "A"]
        }
      ]
    },
    {
      "type": "chorus",
      "title": "Chorus",
      "lines": [
        {
          "lyrics": "Shepherd of peace be near to us",
          "chords": ["D", "G", "Bm", "A"]
        },
        {
          "lyrics": "Lead every wandering heart back home",
          "chords": ["D", "G", "Bm", "A"]
        }
      ]
    }
  ],
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

### Song 3: Morning Mercy Song

**Collection:** `songs`  
**Document ID:** `seed-morning-mercy-song`

```json
{
  "title": "Morning Mercy Song",
  "titleLower": "morning mercy song",
  "artist": "Northside Collective",
  "artistLower": "northside collective",
  "slug": "morning-mercy-song-northside-collective",
  "uploaderUid": "christsongs-demo",
  "uploaderName": "ChristSongs Team",
  "uploaderNameLower": "christsongs team",
  "isPublic": true,
  "status": "active",
  "instrumentsAvailable": ["guitar"],
  "searchKeywords": ["morning", "mercy", "song", "northside", "collective"],
  "views": 215,
  "favoritesCount": 27,
  "version": 1,
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

**Subcollection:** `arrangements`  
**Document ID:** `guitar`

```json
{
  "instrument": "guitar",
  "key": "C",
  "capo": 0,
  "tuning": "standard",
  "transposeEnabled": true,
  "sections": [
    {
      "type": "verse",
      "title": "Verse 1",
      "lines": [
        {
          "lyrics": "Before the city finds its voice we sing",
          "chords": ["C", "G", "Am", "F"]
        },
        {
          "lyrics": "The kindness of the Lord is waking us",
          "chords": ["C", "G", "F", "G"]
        }
      ]
    },
    {
      "type": "chorus",
      "title": "Chorus",
      "lines": [
        {
          "lyrics": "Morning mercy never runs dry",
          "chords": ["C", "F", "Am", "G"]
        },
        {
          "lyrics": "Every promise stands through every trial",
          "chords": ["C", "F", "Am", "G"]
        }
      ]
    }
  ],
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

### Song 4: King of Grace

**Collection:** `songs`  
**Document ID:** `seed-king-of-grace`

```json
{
  "title": "King of Grace",
  "titleLower": "king of grace",
  "artist": "Bright River Music",
  "artistLower": "bright river music",
  "slug": "king-of-grace-bright-river-music",
  "uploaderUid": "christsongs-demo",
  "uploaderName": "ChristSongs Team",
  "uploaderNameLower": "christsongs team",
  "isPublic": true,
  "status": "active",
  "instrumentsAvailable": ["piano"],
  "searchKeywords": ["king", "grace", "bright", "river", "music"],
  "views": 163,
  "favoritesCount": 17,
  "version": 1,
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

**Subcollection:** `arrangements`  
**Document ID:** `piano`

```json
{
  "instrument": "piano",
  "key": "E",
  "capo": 0,
  "tuning": "standard",
  "transposeEnabled": true,
  "sections": [
    {
      "type": "verse",
      "title": "Verse 1",
      "lines": [
        {
          "lyrics": "You traded crowns of gold for wooden beams",
          "chords": ["E", "B", "C#m", "A"]
        },
        {
          "lyrics": "And showed the world how deep redemption runs",
          "chords": ["E", "B", "A", "B"]
        }
      ]
    },
    {
      "type": "chorus",
      "title": "Chorus",
      "lines": [
        {
          "lyrics": "King of grace we lift Your name on high",
          "chords": ["E", "A", "C#m", "B"]
        },
        {
          "lyrics": "Every breath belongs to You alone",
          "chords": ["E", "A", "C#m", "B"]
        }
      ]
    }
  ],
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

### Song 5: River of Praise

**Collection:** `songs`  
**Document ID:** `seed-river-of-praise`

```json
{
  "title": "River of Praise",
  "titleLower": "river of praise",
  "artist": "Open Table Worship",
  "artistLower": "open table worship",
  "slug": "river-of-praise-open-table-worship",
  "uploaderUid": "christsongs-demo",
  "uploaderName": "ChristSongs Team",
  "uploaderNameLower": "christsongs team",
  "isPublic": true,
  "status": "active",
  "instrumentsAvailable": ["guitar"],
  "searchKeywords": ["river", "praise", "open", "table", "worship"],
  "views": 199,
  "favoritesCount": 21,
  "version": 1,
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

**Subcollection:** `arrangements`  
**Document ID:** `guitar`

```json
{
  "instrument": "guitar",
  "key": "A",
  "capo": 0,
  "tuning": "standard",
  "transposeEnabled": true,
  "sections": [
    {
      "type": "verse",
      "title": "Verse 1",
      "lines": [
        {
          "lyrics": "Spirit move like water through this room",
          "chords": ["A", "E", "F#m", "D"]
        },
        {
          "lyrics": "Teach our weary mouths a brand new song",
          "chords": ["A", "E", "D", "E"]
        }
      ]
    },
    {
      "type": "chorus",
      "title": "Chorus",
      "lines": [
        {
          "lyrics": "Let a river of praise rise in us",
          "chords": ["A", "D", "F#m", "E"]
        },
        {
          "lyrics": "Till every generation knows Your love",
          "chords": ["A", "D", "F#m", "E"]
        }
      ]
    }
  ],
  "createdAt": "<current-timestamp>",
  "updatedAt": "<current-timestamp>"
}
```

## Verification

After seeding, verify the songs appear in your app:

1. Open the ChristSongs app
2. Navigate to the Home page
3. You should see the 5 demo songs in the "Recent Songs" section
4. Click on each song to verify the arrangements load correctly
5. Test search functionality with song titles and artists

## Troubleshooting

### Error: Cannot find package 'firebase-admin'

Make sure you've installed dependencies:
```bash
npm install
```

### Error: Permission denied

Make sure your Firebase service account has the following roles:
- Cloud Datastore User
- Firebase Admin SDK Administrator Service Agent

### Error: Project not found

Make sure the project ID in the seed script matches your Firebase project:
```javascript
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? 'christsongs-app';
```

## Notes

- The seed script uses `merge: true` so it won't overwrite existing songs
- You can run the seed script multiple times safely
- The demo songs are owned by the `christsongs-demo` user
- All demo songs are public and searchable
