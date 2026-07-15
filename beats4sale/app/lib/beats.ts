// ── Beat catalog data & types ──

export type LicenseTier = 'basic' | 'premium' | 'exclusive';

export interface License {
  tier: LicenseTier;
  label: string;
  price: number;
  description: string;
  features: { text: string; included: boolean }[];
}

export interface Beat {
  id: string;
  title: string;
  bpm: number;
  key: string;
  duration: string;
  tags: string[];
  badge?: 'hot' | 'new' | 'exclusive' | null;
  color1: string;
  color2: string;
  waveHeights: number[];
  moods: string[];
  previewUrl?: string;
}

export const LICENSE_TIERS: Record<LicenseTier, License> = {
  basic: {
    tier: 'basic',
    label: 'Basic License',
    price: 29.99,
    description: 'Perfect for independent artists dropping mixtapes and SoundCloud projects.',
    features: [
      { text: 'MP3 Lease', included: true },
      { text: '2,500 streams/sales', included: true },
      { text: '1 Music Video', included: true },
      { text: 'Non-Profit Performances', included: true },
      { text: 'Instant Download', included: true },
      { text: 'WAV Files', included: false },
      { text: 'Stems / Trackout', included: false },
      { text: 'Radio Broadcasting', included: false },
    ],
  },
  premium: {
    tier: 'premium',
    label: 'Premium License',
    price: 79.99,
    description: 'For serious artists ready for commercial releases and bigger platforms.',
    features: [
      { text: 'MP3 + WAV Lease', included: true },
      { text: 'Unlimited Streams', included: true },
      { text: 'Unlimited Music Videos', included: true },
      { text: 'Radio Broadcasting', included: true },
      { text: '200K Sales Limit', included: true },
      { text: 'Instant Download', included: true },
      { text: 'Stems / Trackout', included: false },
      { text: 'Full Exclusive Rights', included: false },
    ],
  },
  exclusive: {
    tier: 'exclusive',
    label: 'Exclusive Rights',
    price: 299.99,
    description: 'Full ownership transfer — the beat is yours forever. Removed from store.',
    features: [
      { text: 'MP3 + WAV + Stems', included: true },
      { text: 'Full Exclusive Rights', included: true },
      { text: 'Unlimited Everything', included: true },
      { text: 'Sync Licensing Rights', included: true },
      { text: 'Beat Removed from Store', included: true },
      { text: 'Custom Contract', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Full Copyright Transfer', included: true },
    ],
  },
};

export const BEATS: Beat[] = [
  {
    id: 'beat-001',
    title: 'Midnight Frequency',
    bpm: 140,
    key: 'A Minor',
    duration: '2:45',
    tags: ['Trap', 'Dark', 'Hard'],
    badge: 'hot',
    color1: '#0d1a2a',
    color2: '#1a0d2a',
    waveHeights: [20,35,50,65,80,55,40,30,70,90,60,45,75,55,40,30,85,65,50,35,60,80,45,30,70,55,90,40,65,80,35,50,75,45,30,60,85,55,40,70,90,35,50,65,80,45,30,55,70,85],
    moods: ['Aggressive', 'Cinematic'],
  },
  {
    id: 'beat-002',
    title: 'Neon Boulevard',
    bpm: 128,
    key: 'F Major',
    duration: '3:12',
    tags: ['Hip-Hop', 'Melodic', 'Vibe'],
    badge: 'new',
    color1: '#001a2a',
    color2: '#0a1a10',
    waveHeights: [40,60,80,55,30,70,90,45,65,50,35,75,85,40,60,55,80,30,70,90,45,65,35,50,75,60,40,80,55,70,30,90,45,65,50,35,85,60,40,75,55,80,30,70,90,45,65,35,50,80],
    moods: ['Chill', 'Smooth'],
  },
  {
    id: 'beat-003',
    title: 'Steel Pulse',
    bpm: 145,
    key: 'D Minor',
    duration: '2:58',
    tags: ['Drill', 'UK', 'Dark'],
    badge: null,
    color1: '#1a0a10',
    color2: '#0a0d1a',
    waveHeights: [55,35,70,90,45,65,80,30,50,75,60,40,85,55,35,70,90,45,65,50,30,80,55,75,40,60,85,35,70,90,45,65,50,30,80,55,40,75,60,85,35,70,90,45,65,50,30,80,55,75],
    moods: ['Aggressive', 'Street'],
  },
  {
    id: 'beat-004',
    title: 'Cloud Nine',
    bpm: 88,
    key: 'G Major',
    duration: '3:30',
    tags: ['R&B', 'Soulful', 'Smooth'],
    badge: 'new',
    color1: '#0a1520',
    color2: '#150a20',
    waveHeights: [30,45,60,40,55,70,35,50,65,80,45,30,75,55,40,65,90,35,60,80,45,30,70,55,40,85,60,35,75,50,65,80,30,45,70,55,90,35,60,40,75,55,80,30,65,45,70,85,35,50],
    moods: ['Romantic', 'Chill'],
  },
  {
    id: 'beat-005',
    title: 'Apex Protocol',
    bpm: 155,
    key: 'C Minor',
    duration: '2:22',
    tags: ['Trap', 'Hard', 'Epic'],
    badge: 'hot',
    color1: '#1a1000',
    color2: '#0a0010',
    waveHeights: [70,90,55,40,80,60,35,75,45,65,90,30,50,85,55,40,70,60,35,80,45,65,90,30,75,55,40,85,60,35,70,90,45,65,50,30,80,55,40,75,60,85,35,70,90,45,65,50,30,80],
    moods: ['Hype', 'Aggressive'],
  },
  {
    id: 'beat-006',
    title: 'Afterglow',
    bpm: 95,
    key: 'E♭ Major',
    duration: '3:45',
    tags: ['Pop', 'Melodic', 'Emotional'],
    badge: 'exclusive',
    color1: '#200a15',
    color2: '#0a1520',
    waveHeights: [35,55,75,45,65,30,80,50,70,40,60,85,35,55,75,45,65,30,80,50,70,40,60,85,35,55,75,45,65,30,80,50,70,40,60,85,35,55,75,45,65,30,80,50,70,40,60,85,35,55],
    moods: ['Emotional', 'Uplifting'],
  },
];
