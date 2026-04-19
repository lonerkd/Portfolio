import React from 'react';
import { Mail, Twitter, Instagram, Tv, ExternalLink } from 'lucide-react';

/* ══════════════════════════════════════
   SITE CONTENT CONFIGURATION
   Edit this file to update the portfolio without touching code.
   ══════════════════════════════════════ */

// 1. VIDEOS (The Bento Grid)
// `objectPosition` controls how the thumbnail is cropped (e.g. 'center', 'top', 'bottom', 'left', 'right', '50% 20%')
export const VIDEOS = [
  { id: '10m',      title: '10 Million',             cat: 'Music Video',    role: 'Solo Shot / Edited',              year: '2026', desc: 'Shot, lit, and edited solo.',    yt: '3frfHolmYkE',  did: '10A2uzDxrEEgx-6tiS3M_qbhAq72dglZt', feat: true, objectPosition: 'center' },
  { id: 'brief',    title: 'The Briefcase',           cat: 'Short Film',     role: 'Lead Actor / DP / Editor',        year: '2024', desc: 'Crime thriller. Two couriers, one briefcase.',    yt: 'pUZkiH74yTU',  did: '1EM1AVe-50e6IMKL2m8teeakg6aSL3ctr', feat: true, objectPosition: 'center' },
  { id: 'cook',     title: 'Live Cooking Demo',       cat: 'Live Multi-Cam', role: 'Producer / Director / DP',        year: '2025', desc: 'Real-time switching, no second takes.',                              yt: 'R2IZKAHYmME', did: '13fmSRFNiGZl2b57-cd0qVnjcPx9IDUUZ', feat: false, objectPosition: 'center' },
  { id: 'audio',    title: 'The Audio Blueprint',     cat: 'Doc Teaser',     role: 'Director / Writer / Editor',      year: '2025', desc: 'Sound design — the secret weapon behind iconic movies.',  yt: 'FiTiVNZxTPs',  did: '1hpS5fIfDRthOgzCD0jda5IcuHiverR8n', feat: false, objectPosition: 'center' },
  { id: 'psa',      title: 'The Grand PSA',           cat: 'Commercial',     role: 'Writer / Director / DP / Editor', year: '2025', desc: 'Wrote, directed, shot, and graded.',             yt: 'Z9hXm2u4cZw',  did: '1Mmk_nM_WXCskja0NEIa6PlM51cul-z00', feat: false, objectPosition: 'center' },
  { id: 'black',    title: 'Black Stuff',             cat: 'Music Video',    role: 'Solo Shot / Edited',              year: '2025', desc: 'Dark aesthetics, deep narrative weight.',                    yt: 'NqcGtFr95oM',  did: '1KHdETMZDHqrRzkL7Ook-61KHxFwcGnKB', feat: true, objectPosition: 'center' },
  { id: 'news',     title: 'Banded Peak News Pack',   cat: 'Broadcast',      role: 'Camera Op / Editor',              year: '2024', desc: 'Broadcast news package under deadline.',                                     yt: 'l6JnCA7e3DY',  did: '1iw925ZsP2evEINyDqP6iesQYellQ4Z9u', feat: false, objectPosition: 'center' },
  { id: 'intv',     title: 'Live Interview Show',     cat: 'Live Multi-Cam', role: 'Director / Producer',             year: '2025', desc: 'Directing multiple camera operators in real time.',  yt: 'rctvfSJsO9Y', did: '1A7dgksrR-9KJ6TyxfO6Ch3TOc2bqbL0t', feat: false, objectPosition: 'center' },
  { id: 'altitude', title: 'The Pursuit of Altitude', cat: 'Documentary',    role: 'Writer / Director / DP / Editor', year: '2024', desc: 'Visual storytelling through landscape and movement.',  yt: 'wHwXBw2xk5M', did: '1-bPAYnQROhT9awRMEBWuDCGSw04CtBgE', feat: false, objectPosition: 'center' },
  { id: 'fraud',    title: 'Fraud',                   cat: 'Doc Teaser',     role: 'Producer / Editor',               year: '2024', desc: 'How fraud operates in plain sight.',                                        yt: 'E6rydhe1PAY', did: '10AfFlmGp1qbqI_9BKSQnYfyTi7o_SFbp', feat: false, objectPosition: 'center' },
  { id: 'sports',   title: 'Live Sports Show Intro',  cat: 'Live Multi-Cam', role: 'Director / Editor',               year: '2025', desc: 'Live broadcast opener. Motion graphics meets live energy.',           yt: 'gWYoZh9kl9I',  did: null, feat: false, objectPosition: 'center' },
];

// 2. WRITING / DOCUMENTS
export const WRITING_FEATURE = {
  title: 'Femme Fatale',
  subtitle: 'Noir Thriller · Feature Film',
  desc: 'A deconstruction of narrative control set between Port-au-Prince in 1957 and 1960s Paris. Femme Fatale follows Iris Beaumont — a woman who survives not with weapons, but with the story she chooses to tell.',
  pills: ['Screenplay', '100+ Pages'],
  draftLink: 'https://drive.google.com/file/d/15UV22p-90rGDGfhROKqiIxELp87vCsik/view',
  bibleLink: 'https://drive.google.com/file/d/1xx9bJWGSEekWqqVmpVS64k7KWo276lVZ/view'
};

export const OTHER_WRITING = [
  { type: 'Production Book', title: 'Studio Music Video', sub: 'Frank Ocean "Chanel"', did: '174wk77-9dBwOoJlMvROLpIsnf-kByrC6' },
  { type: 'Doc One Sheet', title: 'The Audio Blueprint', sub: 'Sound design doc', did: '1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-' },
  { type: 'PSA Script', title: 'A Stage for Every Story', sub: 'The Grand Theatre', did: '1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf' },
  { type: 'Short Film Script', title: 'The Briefcase', sub: 'Crime thriller', did: '1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ' },
];

// 3. STATS BAR
export const STATS_DATA = [
  { num: '12', label: 'Projects' },
  { num: '4+', label: 'Years' },
  { num: '5', label: 'Hats' },
  { num: '2', label: 'Working on Now' },
];

// 4. PITCH CHECKLIST
export const PITCH_CHECKLIST = [
  'Creative Vision',
  'Music Video Experience',
  'Camera Obsessed',
  'Full-Time Ready',
  'Stream & Vlog Content'
];
export const PITCH_TEXT = "You said you need all five. I've got all five.";

// 5. STORY SECTION PARAGRAPHS
export const STORY_PARAGRAPHS = [
  <>I'm a storyteller, a world-builder, a misfit. I'm the founder of Misfits Cavern, a creative collective dedicated to telling stories that matter. I'm a writer, director, and editor with a passion for building worlds and crafting narratives that resonate with audiences.</>,
  <>I believe in the power of storytelling to change the world. I believe that every story matters, and that every voice deserves to be heard. That's why I created Misfits Cavern - to provide a platform for misfits and rebels to share their stories with the world.</>,
  <>I'm not just a filmmaker. I'm a visionary, a leader, and a creative force. I'm here to make a difference, one story at a time.</>
];
export const STORY_EXPANDED_PARAGRAPHS = [
  <>I've done every job on set because I wanted to understand the whole system. Camera, lighting, editing, writing, directing — I do all of it so that when I'm behind the camera, I'm not just holding a rig. <span style={{ color:'var(--fg)', fontWeight:500 }}>I'm crafting narrative.</span></>,
  <>I've also been a writer my whole career — I have a show bible, screenplays, production books. I understand narrative. I understand what makes a moment worth remembering. That instinct doesn't turn off because we're live.</>,
  <><span style={{ color:'var(--fg)', fontWeight:500 }}>I'm not looking for a job. I'm looking for the right mission to dedicate my soul to.</span></>
];

// 6. HERO SECTION
export const HERO_TAGLINE = "Misfits Cavern";
export const HERO_TITLE_1 = "I DON'T";
export const HERO_TITLE_2 = "JUST FILM";
export const HERO_SUBTEXT_1 = "I build worlds and craft narratives.";

// 7. CONTACT LINKS
export const CONTACT_LINKS = [
  { label:'Email Me',             href:'mailto:peterolowude@icloud.com',                                                      icon:<Mail size={15} />,           primary: true },
  { label:'X / Twitter',          href:'https://x.com/lonerfss',                                                              icon:<Twitter size={15} /> },
  { label:'Instagram',            href:'https://www.instagram.com/lonerkid',                                                   icon:<Instagram size={15} /> },
  { label:'Twitch',               href:'https://www.twitch.tv/lonerfs',                                                       icon:<Tv size={15} /> },
];

export const FOOTER_TEXT = "© 2026 Peter Olowude · Misfits Cavern";