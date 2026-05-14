export const seedUploader = {
  uid: 'christsongs-demo',
  name: 'ChristSongs Team',
};

function splitChords(chordsText) {
  return chordsText
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function line(lyrics, chordsText) {
  return {
    lyrics,
    chords: splitChords(chordsText),
  };
}

function section(type, title, lines) {
  return {
    type,
    title,
    lines,
  };
}

export function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildSearchKeywords(...values) {
  const keywords = new Set();

  values
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .forEach((value) => {
      const slug = slugify(value);

      if (slug) {
        keywords.add(slug);
      }

      value
        .toLowerCase()
        .split(/\s+/)
        .filter((fragment) => fragment.length >= 2)
        .forEach((fragment) => keywords.add(fragment));
    });

  return [...keywords];
}

export const demoSongs = [
  {
    id: 'seed-holy-light',
    title: 'Holy Light',
    artist: 'ChristSongs Worship',
    instrument: 'guitar',
    key: 'G',
    capo: 2,
    tuning: 'standard',
    transposeEnabled: true,
    views: 186,
    favoritesCount: 19,
    sections: [
      section('verse', 'Verse 1', [
        line('When morning breaks Your mercy sings again', 'G D Em C'),
        line('You lead our hearts from fear into Your praise', 'G D C D'),
      ]),
      section('chorus', 'Chorus', [
        line('Holy Light shine over every weary soul', 'G C Em D'),
        line('Jesus Christ awaken us to hope again', 'G C Em D'),
      ]),
    ],
  },
  {
    id: 'seed-shepherd-of-peace',
    title: 'Shepherd of Peace',
    artist: 'Grace Harbor',
    instrument: 'piano',
    key: 'D',
    capo: 0,
    tuning: 'standard',
    transposeEnabled: true,
    views: 142,
    favoritesCount: 13,
    sections: [
      section('verse', 'Verse 1', [
        line('In restless nights You guard my heart with peace', 'D A Bm G'),
        line('Your steady voice becomes my refuge song', 'D A G A'),
      ]),
      section('chorus', 'Chorus', [
        line('Shepherd of peace be near to us', 'D G Bm A'),
        line('Lead every wandering heart back home', 'D G Bm A'),
      ]),
    ],
  },
  {
    id: 'seed-morning-mercy-song',
    title: 'Morning Mercy Song',
    artist: 'Northside Collective',
    instrument: 'guitar',
    key: 'C',
    capo: 0,
    tuning: 'standard',
    transposeEnabled: true,
    views: 215,
    favoritesCount: 27,
    sections: [
      section('verse', 'Verse 1', [
        line('Before the city finds its voice we sing', 'C G Am F'),
        line('The kindness of the Lord is waking us', 'C G F G'),
      ]),
      section('chorus', 'Chorus', [
        line('Morning mercy never runs dry', 'C F Am G'),
        line('Every promise stands through every trial', 'C F Am G'),
      ]),
    ],
  },
  {
    id: 'seed-king-of-grace',
    title: 'King of Grace',
    artist: 'Bright River Music',
    instrument: 'piano',
    key: 'E',
    capo: 0,
    tuning: 'standard',
    transposeEnabled: true,
    views: 163,
    favoritesCount: 17,
    sections: [
      section('verse', 'Verse 1', [
        line('You traded crowns of gold for wooden beams', 'E B C#m A'),
        line('And showed the world how deep redemption runs', 'E B A B'),
      ]),
      section('chorus', 'Chorus', [
        line('King of grace we lift Your name on high', 'E A C#m B'),
        line('Every breath belongs to You alone', 'E A C#m B'),
      ]),
    ],
  },
  {
    id: 'seed-river-of-praise',
    title: 'River of Praise',
    artist: 'Open Table Worship',
    instrument: 'guitar',
    key: 'A',
    capo: 0,
    tuning: 'standard',
    transposeEnabled: true,
    views: 199,
    favoritesCount: 21,
    sections: [
      section('verse', 'Verse 1', [
        line('Spirit move like water through this room', 'A E F#m D'),
        line('Teach our weary mouths a brand new song', 'A E D E'),
      ]),
      section('chorus', 'Chorus', [
        line('Let a river of praise rise in us', 'A D F#m E'),
        line('Till every generation knows Your love', 'A D F#m E'),
      ]),
    ],
  },
];