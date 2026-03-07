#!/usr/bin/env node
/**
 * generate-card-images.mjs
 *
 * Generates all 22 Major Arcana tarot card images using OpenAI DALL-E 3
 * and saves them to public/cards/card-00.png … card-21.png
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-card-images.mjs
 *
 * Options (env vars):
 *   START_ID=5   Resume from card ID 5 (skip 0–4)
 *   ONLY_ID=3    Generate a single card by ID
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'cards');
const API_KEY = process.env.OPENAI_API_KEY;
const START_ID = process.env.START_ID !== undefined ? parseInt(process.env.START_ID, 10) : 0;
const ONLY_ID = process.env.ONLY_ID !== undefined ? parseInt(process.env.ONLY_ID, 10) : null;

if (!API_KEY) {
  console.error('ERROR: OPENAI_API_KEY environment variable is required.');
  console.error('Usage: OPENAI_API_KEY=sk-... node scripts/generate-card-images.mjs');
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ─── Master style prefix applied to every card ──────────────────────────────
const MASTER_STYLE = `A highly detailed tarot card illustration featuring an expressive adorable dog character, \
soft painterly digital art, semi-realistic fur texture, luminous eyes with emotional depth, \
whimsical yet mystical atmosphere, magical glow accents, subtle star particles, \
cinematic lighting, gentle rim light, rich textured background, \
ornate tarot frame with gold foil detailing, elegant serif tarot title typography, \
vertical composition (2:3 ratio), high resolution, collector-quality tarot deck art, \
not flat vector, not cartoonish, not minimalist, not clipart, \
soft watercolor blending mixed with storybook fantasy realism. `;

const NEGATIVE =
  'flat vector, basic shapes, childish, low detail, emoji style, chibi, oversimplified, ' +
  'harsh outlines, plain white background';

// ─── Per-card prompts ────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 0,
    name: 'The Fool',
    prompt:
      'An adventurous golden retriever puppy stepping forward near a glowing cliff edge under a dreamy sunrise sky, ' +
      'tiny travel satchel tied to a stick over its shoulder, joyful curiosity in its eyes, ' +
      'floating petals and light sparkles around, mystical aura, tarot frame with gold accents.',
  },
  {
    id: 1,
    name: 'The Magician',
    prompt:
      'A clever border collie standing confidently at a mystical altar, ' +
      'surrounded by glowing wand (stick), cup (water bowl), sword (silver feather blade), pentacle (engraved golden tag), ' +
      'cosmic energy swirling between paws, focused gaze, magical light halo.',
  },
  {
    id: 2,
    name: 'The High Priestess',
    prompt:
      'A serene white samoyed sitting before a moonlit veil, ' +
      'silver crescent moon above, soft flowing curtains with subtle symbols, ' +
      'mysterious calm expression, gentle blue aura, hidden wisdom energy.',
  },
  {
    id: 3,
    name: 'The Empress',
    prompt:
      'A nurturing fluffy chow chow reclining in a blooming meadow of roses and wheat, ' +
      'warm golden sunlight, soft maternal expression, glowing crown of flowers, abundant natural surroundings.',
  },
  {
    id: 4,
    name: 'The Emperor',
    prompt:
      'A majestic german shepherd sitting firmly on a stone throne, ' +
      'mountain peaks in background, red royal cloak, steady commanding gaze, ' +
      'structured symmetrical composition.',
  },
  {
    id: 5,
    name: 'The Hierophant',
    prompt:
      'An elderly wise saint bernard dog in ceremonial robes, ' +
      'ornate golden staff beside him, temple pillars in background, ' +
      'gentle sacred glow and spiritual symbolism.',
  },
  {
    id: 6,
    name: 'The Lovers',
    prompt:
      'Two affectionate dogs (husky and golden retriever) touching noses under a glowing angelic light, ' +
      'soft pink and golden sky, intertwined vines forming a heart shape subtly in background.',
  },
  {
    id: 7,
    name: 'The Chariot',
    prompt:
      'A determined shiba inu riding a small mystical chariot pulled by two contrasting spirit dogs (light and shadow), ' +
      'dynamic forward motion, stars streaking across night sky.',
  },
  {
    id: 8,
    name: 'Strength',
    prompt:
      'A calm gentle labrador placing its paw softly on the head of a symbolic lion-shaped light spirit, ' +
      'soft golden aura, flowers around paws, expression of quiet confidence.',
  },
  {
    id: 9,
    name: 'The Hermit',
    prompt:
      'An old wise beagle holding a glowing lantern in a snowy mountain night, ' +
      'soft blue moonlight, contemplative expression, subtle falling snow particles.',
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    prompt:
      'A rotating glowing celestial wheel surrounded by playful floating dog spirits, ' +
      'cosmic clouds and zodiac patterns subtly embedded, golden magical sparks.',
  },
  {
    id: 11,
    name: 'Justice',
    prompt:
      'A dignified doberman holding balanced golden scales in its mouth, ' +
      'sword resting upright beside it, symmetrical architecture background, calm neutrality.',
  },
  {
    id: 12,
    name: 'The Hanged Man',
    prompt:
      'A relaxed corgi hanging gently upside down from a glowing tree branch, ' +
      'serene smile, radiant halo around head, mystical twilight forest.',
  },
  {
    id: 13,
    name: 'Death',
    prompt:
      'A shadowy yet peaceful black wolf-dog spirit walking through mist, ' +
      'soft white roses blooming behind it, moonlight illuminating path, ' +
      'symbolic transformation not horror.',
  },
  {
    id: 14,
    name: 'Temperance',
    prompt:
      'An elegant afghan hound pouring glowing water between two crystal bowls, ' +
      'rainbow aura blending around, harmonious balanced composition.',
  },
  {
    id: 15,
    name: 'The Devil',
    prompt:
      'A mischievous dark-coated dog with glowing amber eyes, ' +
      'playful but mysterious grin, loose symbolic chains on ground, ' +
      'deep red mystical background with subtle smoke.',
  },
  {
    id: 16,
    name: 'The Tower',
    prompt:
      'A tall ancient tower struck by lightning, ' +
      'small surprised dog leaping safely away, glowing sparks and dramatic sky, ' +
      'dynamic cinematic lighting.',
  },
  {
    id: 17,
    name: 'The Star',
    prompt:
      'A hopeful white puppy sitting beside a shimmering lake under a star-filled sky, ' +
      'one paw touching glowing water surface, celestial light reflections.',
  },
  {
    id: 18,
    name: 'The Moon',
    prompt:
      'Two dogs (domestic and wolf-like) howling beneath a large luminous moon, ' +
      'mist rising from water, dreamlike purple-blue night palette.',
  },
  {
    id: 19,
    name: 'The Sun',
    prompt:
      'A joyful corgi running across a sunflower field under radiant golden sun, ' +
      'bright glowing sky, warm happiness energy.',
  },
  {
    id: 20,
    name: 'Judgement',
    prompt:
      'A group of dogs awakening under beams of divine light from the sky, ' +
      'angelic trumpet made of golden light above, sense of renewal.',
  },
  {
    id: 21,
    name: 'The World',
    prompt:
      'A graceful elegant dog surrounded by a glowing wreath of leaves and cosmic light, ' +
      'four symbolic elemental corners subtly present, harmonious completion energy.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function padId(id) {
  return String(id).padStart(2, '0');
}

function outputPath(id) {
  return path.join(OUTPUT_DIR, `card-${padId(id)}.png`);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateImage(card) {
  const fullPrompt = MASTER_STYLE + card.prompt;
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1792',
      quality: 'hd',
      style: 'vivid',
      response_format: 'url',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;
  if (!imageUrl) throw new Error('No image URL in response');
  return imageUrl;
}

async function downloadImage(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const cards = ONLY_ID !== null
    ? CARDS.filter((c) => c.id === ONLY_ID)
    : CARDS.filter((c) => c.id >= START_ID);

  if (cards.length === 0) {
    console.error(`No cards found for the given filter (ONLY_ID=${ONLY_ID}, START_ID=${START_ID})`);
    process.exit(1);
  }

  console.log(`Generating ${cards.length} card image(s) with DALL-E 3 (hd, 1024x1792)...`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  let success = 0;
  let failed = 0;

  for (const card of cards) {
    const dest = outputPath(card.id);
    console.log(`[${card.id}/21] ${card.name} → card-${padId(card.id)}.png`);

    // Skip if already generated (re-run safety)
    if (fs.existsSync(dest)) {
      console.log(`  ✓ Already exists, skipping.\n`);
      success++;
      continue;
    }

    let attempt = 0;
    let lastError = null;
    while (attempt < 3) {
      try {
        const imageUrl = await generateImage(card);
        await downloadImage(imageUrl, dest);
        const sizeKb = Math.round(fs.statSync(dest).size / 1024);
        console.log(`  ✓ Saved (${sizeKb} KB)\n`);
        success++;
        lastError = null;
        break;
      } catch (err) {
        attempt++;
        lastError = err;
        console.warn(`  ✗ Attempt ${attempt} failed: ${err.message}`);
        if (attempt < 3) {
          const wait = attempt * 3000;
          console.log(`  Retrying in ${wait / 1000}s...`);
          await sleep(wait);
        }
      }
    }

    if (lastError) {
      console.error(`  ✗ Failed after 3 attempts. Skipping card ${card.id}.\n`);
      failed++;
    }

    // Polite delay between requests
    if (card !== cards[cards.length - 1]) {
      await sleep(500);
    }
  }

  console.log('─'.repeat(50));
  console.log(`Done. Success: ${success}  Failed: ${failed}`);
  if (failed > 0) {
    console.log(`Re-run with START_ID=<failed_id> or ONLY_ID=<id> to retry specific cards.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
