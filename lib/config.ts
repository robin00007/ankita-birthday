export interface Reason        { icon: string; text: string; }
export interface TimelineEvent { tag: string; title: string; text: string; dot: string; side: 'left' | 'right'; }
export interface GalleryItem   { caption: string; }
export interface VideoMessage  { senderName: string; relation: string; caption: string; videoUrl: string; }

export interface SiteConfig {
  recipient:     { name: string; iataCode: string; worldName: string; };
  sender:        { name: string; };
  birthday:      string;
  airline:       { name: string; tagline: string; flightCode: string; };
  letter:        { salutation: string; date: string; paragraphs: string[]; };
  reasons:       Reason[];
  timeline:      TimelineEvent[];
  gallery:       GalleryItem[];
  videoMessages: VideoMessage[];
  finale:        { message: string; from: string; };
}

export const defaultConfig: SiteConfig = {
  recipient: { name: 'Ankita', iataCode: 'ANK', worldName: "Ankita's World" },
  sender:    { name: 'Robin' },
  birthday:  '2026-06-08',
  airline:   { name: 'IndiGo', tagline: 'Special', flightCode: 'FL-0608 ♥' },
  letter: {
    salutation: 'My Dearest Ankita,',
    date:       'June 8th, 2026',
    paragraphs: [
      "24. Can you believe it? You are turning 24 today — and honestly, the world has no idea how lucky it is to have had you in it for this long.",
      "Last year, we got to celebrate your birthday together for the first time — and it is a memory I hold so close to my heart. But I won't lie, there is a small part of me that wishes I had found you sooner. I think about all the birthdays before that I missed — all the cakes, all the moments, all the chances to make you feel as special as you deserve. I wish I could go back and be there for every single one.",
      "But here is what I know for certain — now that you are mine and I am yours, I am not letting a single birthday go by without making it unforgettable. Every year from here on, I will make sure you feel more loved than the last. That is not a promise, that is a guarantee.",
      "And yes, I know you are getting older — but before you panic, let me remind you of something important: you are not just getting older, you are getting closer to becoming the world's most beautiful, most iconic, most absolutely irresistible sexy grandma. So really, things are only going up from here. 😌",
      "Happy Birthday, bbbyyy. You are my favourite person on this entire planet — today, tomorrow, and every year after. 🌸❤️",
    ],
  },
  reasons: [
    { icon: '✨', text: 'You make every ordinary moment feel extraordinary' },
    { icon: '😊', text: 'Your smile could light up an entire flight cabin' },
    { icon: '✈️', text: 'You are brave enough to touch the sky every single day' },
    { icon: '😂', text: 'Your laugh is my favorite sound in the entire world' },
    { icon: '💝', text: 'You care deeply for everyone around you — always, always' },
    { icon: '👗', text: 'You look absolutely stunning in your IndiGo uniform' },
    { icon: '🌟', text: 'You handle any pressure with grace that leaves me in awe' },
    { icon: '🌍', text: 'The way you talk about cities makes me want to see the whole world' },
    { icon: '🌱', text: 'You never stop growing, learning, and becoming better' },
    { icon: '💫', text: 'Your kindness is a superpower you use every single day' },
    { icon: '📱', text: 'You make every distance feel like nothing at all' },
    { icon: '❤️', text: 'Because you are simply, completely, irreplaceably — YOU' },
  ],
  timeline: [
    { tag: 'The Beginning',  title: 'When We First Met',      text: "The moment everything changed. One I'd go back to a thousand times without hesitation.", dot: '✨', side: 'left' },
    { tag: 'First Adventure', title: 'Discovering You',        text: 'Our first adventure showed me who you really are — fearless, curious, and wonderfully alive.', dot: '✈️', side: 'right' },
    { tag: 'Your Dream',     title: 'You Became Cabin Crew',  text: 'Watching you wear that IndiGo uniform for the first time — I have never been more proud of anyone.', dot: '👩‍✈️', side: 'left' },
    { tag: 'Every Day',      title: 'Us, Always',             text: 'Every call, every laugh, every moment — apart or together — it has all been completely perfect.', dot: '💕', side: 'right' },
    { tag: 'June 8, 2026',   title: 'Today — Your Birthday', text: 'Here we are. Another year, another reason to celebrate the incredible human you keep becoming.', dot: '🎂', side: 'left' },
  ],
  gallery: [
    { caption: 'Us ♥' },
    { caption: 'Your world, up high' },
    { caption: 'My star' },
    { caption: 'Golden hour' },
    { caption: 'Forever' },
    { caption: 'Getting better with time' },
  ],
  videoMessages: [
    { senderName: 'Mom', relation: 'Family', caption: 'We are so proud of everything you have become. Happy Birthday sweetheart! 🌸', videoUrl: '/videos/video1.mp4' },
    { senderName: 'Brother', relation: 'Family', caption: "No one makes every day brighter than you do. Here's to another amazing year!", videoUrl: '/videos/video2.mp4' },
    { senderName: 'Sister', relation: 'Family', caption: 'The cabin is always warmer when you are on board. Wishing you the best birthday! ✈️', videoUrl: '/videos/video3.mp4' },
  ],
  finale: {
    message: 'May every flight take you somewhere beautiful.\nMay every landing bring you home to joy.\nThe world is more wonderful with you in it.',
    from:    'With infinite love — Robin ♥',
  },
};

export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const out = { ...target };
  for (const key in source) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      (out as Record<string, unknown>)[key] = deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>);
    } else if (sv !== undefined) {
      (out as Record<string, unknown>)[key] = sv;
    }
  }
  return out;
}

export function resolveConfig(encoded?: string | null): SiteConfig {
  if (!encoded) return defaultConfig;
  try {
    const json    = decodeURIComponent(atob(encoded));   // atob first, then decodeURIComponent
    const partial = JSON.parse(json) as Partial<SiteConfig>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return deepMerge(defaultConfig as any, partial as any) as SiteConfig;
  } catch {
    return defaultConfig;
  }
}
