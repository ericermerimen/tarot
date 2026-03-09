import type { DrawnCard, CardMeaning, SpreadKey } from '@/types/tarot';

export interface SpreadSummary {
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
}

export function getPositionalInterpretation(
  cardData: DrawnCard,
  position: string,
  spreadType: SpreadKey
): { text: string; textZh: string } {
  const meaning = cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
  const name = cardData.card.name;
  const nameZh = cardData.card.nameZh;
  const posLower = position.toLowerCase();

  if (spreadType === 'love') {
    const loveText = meaning.love;
    const loveTextZh = meaning.loveZh;
    const frames: Record<string, { en: string; zh: string }> = {
      you: {
        en: `${name} in the You position reflects the energy you're bringing to your relationship right now: ${loveText}`,
        zh: `「你」位置的${nameZh}反映了你目前帶入關係的能量：${loveTextZh}`,
      },
      partner: {
        en: `${name} in the Partner position shows the energy your partner (or potential love) carries: ${loveText}`,
        zh: `「對方」位置的${nameZh}展示了你伴侶（或心儀對象）帶來的能量：${loveTextZh}`,
      },
      connection: {
        en: `${name} in the Connection position reveals the nature of the bond between you: ${loveText}`,
        zh: `「連結」位置的${nameZh}揭示了你們之間聯繫的本質：${loveTextZh}`,
      },
      challenge: {
        en: `${name} in the Challenge position highlights what needs to be worked through together: ${loveText}`,
        zh: `「挑戰」位置的${nameZh}指出了你們需要共同克服的事：${loveTextZh}`,
      },
      outcome: {
        en: `${name} in the Outcome position reveals where your love story is heading: ${loveText}`,
        zh: `「結果」位置的${nameZh}揭示了你的愛情故事走向：${loveTextZh}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh };
    return { text: loveText, textZh: loveTextZh };
  }

  if (spreadType === 'threeCard') {
    const frames: Record<string, { en: string; zh: string }> = {
      past: {
        en: `${name} in the Past position reveals the energy or experience that shaped where you are now: ${meaning.meaning}`,
        zh: `「過去」位置的${nameZh}揭示了塑造你現在處境的能量或經歷：${meaning.meaningZh}`,
      },
      present: {
        en: `${name} in the Present position reflects what you're actively navigating right now: ${meaning.meaning}`,
        zh: `「現在」位置的${nameZh}反映了你當前正在經歷的能量：${meaning.meaningZh}`,
      },
      future: {
        en: `${name} in the Future position indicates the energy moving toward you: ${meaning.meaning}`,
        zh: `「未來」位置的${nameZh}指示了正向你走來的能量：${meaning.meaningZh}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh };
    return { text: meaning.meaning, textZh: meaning.meaningZh };
  }

  if (spreadType === 'celticCross') {
    const contextText = posLower === 'advice' && meaning.advice ? meaning.advice : meaning.meaning;
    const contextTextZh = posLower === 'advice' && meaning.adviceZh ? meaning.adviceZh : meaning.meaningZh;
    const frames: Record<string, { en: string; zh: string }> = {
      present: {
        en: `${name} at the center defines the heart of your current situation: ${contextText}`,
        zh: `中心位置的${nameZh}定義了你當前處境的核心：${contextTextZh}`,
      },
      challenge: {
        en: `${name} as the Crossing card shows the immediate challenge or opposing force you must face: ${contextText}`,
        zh: `交叉牌位置的${nameZh}展示了你必須面對的直接挑戰或對立力量：${contextTextZh}`,
      },
      past: {
        en: `${name} in the Past position shows the recent events or energies that led directly to this moment: ${contextText}`,
        zh: `「過去」位置的${nameZh}展示了直接導致這一刻的近期事件或能量：${contextTextZh}`,
      },
      future: {
        en: `${name} in the Future position points to what's coming in the near term: ${contextText}`,
        zh: `「未來」位置的${nameZh}指向近期將要發生的事：${contextTextZh}`,
      },
      above: {
        en: `${name} in the Above position reflects your conscious goals and highest aspirations around this question: ${contextText}`,
        zh: `「目標」位置的${nameZh}反映了你圍繞這個問題的意識目標和最高願望：${contextTextZh}`,
      },
      below: {
        en: `${name} in the Below position uncovers the subconscious patterns or hidden roots influencing your situation: ${contextText}`,
        zh: `「潛意識」位置的${nameZh}揭示了影響你處境的潛意識模式或隱藏根源：${contextTextZh}`,
      },
      advice: {
        en: `${name} in the Advice position offers guidance on how to move forward: ${contextText}`,
        zh: `「建議」位置的${nameZh}提供了如何前進的指引：${contextTextZh}`,
      },
      external: {
        en: `${name} in the External position shows the outside forces, people, or circumstances shaping your situation: ${contextText}`,
        zh: `「外在影響」位置的${nameZh}展示了塑造你處境的外部力量、人物或環境：${contextTextZh}`,
      },
      'hopes/fears': {
        en: `${name} in the Hopes/Fears position reveals what you're simultaneously hoping for and dreading — these often mirror each other: ${contextText}`,
        zh: `「希望/恐懼」位置的${nameZh}揭示了你同時渴望和畏懼的事——這兩者往往互為鏡像：${contextTextZh}`,
      },
      outcome: {
        en: `${name} in the Outcome position reveals the most likely result if the current energies continue on their path: ${contextText}`,
        zh: `「結果」位置的${nameZh}揭示了如果當前能量持續下去的最可能結果：${contextTextZh}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh };
    return { text: contextText, textZh: contextTextZh };
  }

  return { text: meaning.meaning, textZh: meaning.meaningZh };
}

export type ThemeBucket = 'transformation' | 'innerJourney' | 'struggle' | 'growth' | 'achievement' | 'loveConnection' | 'guidance';

const KEYWORD_THEME_MAP: Record<string, ThemeBucket> = {
  // transformation
  'beginnings': 'transformation',
  'change': 'transformation',
  'transition': 'transformation',
  'endings': 'transformation',
  'transformation': 'transformation',
  'cycles': 'transformation',
  'awakening': 'transformation',
  'completion': 'transformation',
  'reckoning': 'transformation',
  'upheaval': 'transformation',
  'revelation': 'transformation',
  'disruption': 'transformation',
  'fate': 'transformation',
  'karma': 'transformation',
  // inner journey
  'intuition': 'innerJourney',
  'mystery': 'innerJourney',
  'inner knowledge': 'innerJourney',
  'subconscious': 'innerJourney',
  'soul searching': 'innerJourney',
  'introspection': 'innerJourney',
  'inner guidance': 'innerJourney',
  'solitude': 'innerJourney',
  'suspension': 'innerJourney',
  'shadow': 'innerJourney',
  'illusion': 'innerJourney',
  'the unconscious': 'innerJourney',
  'fear': 'innerJourney',
  'confusion': 'innerJourney',
  'letting go': 'innerJourney',
  'sacrifice': 'innerJourney',
  'reflection': 'innerJourney',
  // struggle
  'bondage': 'struggle',
  'addiction': 'struggle',
  'restriction': 'struggle',
  'chaos': 'struggle',
  'materialism': 'struggle',
  // growth
  'innocence': 'growth',
  'spontaneity': 'growth',
  'free spirit': 'growth',
  'abundance': 'growth',
  'fertility': 'growth',
  'nurturing': 'growth',
  'hope': 'growth',
  'inspiration': 'growth',
  'courage': 'growth',
  'patience': 'growth',
  'compassion': 'growth',
  'serenity': 'growth',
  'spirituality': 'growth',
  'nature': 'growth',
  'strength': 'growth',
  // achievement
  'manifestation': 'achievement',
  'willpower': 'achievement',
  'skill': 'achievement',
  'concentration': 'achievement',
  'authority': 'achievement',
  'structure': 'achievement',
  'stability': 'achievement',
  'control': 'achievement',
  'determination': 'achievement',
  'success': 'achievement',
  'positivity': 'achievement',
  'vitality': 'achievement',
  'joy': 'achievement',
  'integration': 'achievement',
  'accomplishment': 'achievement',
  'free will': 'achievement',
  // love & connection
  'love': 'loveConnection',
  'harmony': 'loveConnection',
  'relationships': 'loveConnection',
  'choices': 'loveConnection',
  'values': 'loveConnection',
  'partnership': 'loveConnection',
  // guidance
  'tradition': 'guidance',
  'conformity': 'guidance',
  'morality': 'guidance',
  'ethics': 'guidance',
  'justice': 'guidance',
  'fairness': 'guidance',
  'truth': 'guidance',
  'cause and effect': 'guidance',
  'balance': 'guidance',
  'moderation': 'guidance',
  'purpose': 'guidance',
  'absolution': 'guidance',
};

export function detectTheme(cards: DrawnCard[]): ThemeBucket {
  const counts: Record<ThemeBucket, number> = {
    transformation: 0, innerJourney: 0, struggle: 0,
    growth: 0, achievement: 0, loveConnection: 0, guidance: 0,
  };

  for (const drawn of cards) {
    for (const kw of drawn.card.keywords) {
      const bucket = KEYWORD_THEME_MAP[kw.toLowerCase()];
      if (bucket) counts[bucket]++;
    }
  }

  return (Object.entries(counts) as [ThemeBucket, number][])
    .reduce((best, curr) => curr[1] > best[1] ? curr : best, ['transformation', 0] as [ThemeBucket, number])[0];
}

interface PatternObservation {
  en: string;
  zh: string;
}

export interface PatternResult {
  reversalRatio: number;
  patternNote: PatternObservation | null;
}

export function detectPatterns(cards: DrawnCard[]): PatternResult {
  const reversedCount = cards.filter(c => c.isReversed).length;
  const reversalRatio = reversedCount / cards.length;

  let patternNote: PatternObservation | null = null;

  if (reversalRatio === 0) {
    patternNote = {
      en: 'All cards appear upright — the energy here is direct, accessible, and ready to be worked with.',
      zh: '所有牌均為正位——此次解讀的能量直接而清晰，隨時可以運用。',
    };
  } else if (reversalRatio >= 0.5) {
    patternNote = {
      en: 'Much of this reading\'s energy turns inward — blocked or internalized forces asking to be acknowledged and released before they can move forward.',
      zh: '這次解讀的大部分能量向內轉——被阻塞或內化的力量正在尋求被承認和釋放，之後才能向前推進。',
    };
  }

  return { reversalRatio, patternNote };
}

interface PairInsight {
  en: string;
  zh: string;
}

// Keys are always `${smallerId}-${largerId}` to be order-independent.
const ICONIC_PAIRS: Record<string, PairInsight> = {
  '16-17': { // Tower + Star
    en: 'Disruption and hope appear side by side — what breaks open here makes space for something truer.',
    zh: '動盪與希望並肩出現——此處的破裂為更真實的事物騰出了空間。',
  },
  '6-15': { // Lovers + Devil
    en: 'Bondage and choice face each other — this reading hinges on what you are willing to release.',
    zh: '束縛與選擇相對而立——這次解讀的關鍵在於你願意放下什麼。',
  },
  '13-21': { // Death + World
    en: 'An ending and a completion appear together — a full cycle closes, and wholeness is within reach.',
    zh: '結束與圓滿同時出現——一個完整的循環結束，圓滿就在眼前。',
  },
  '2-18': { // High Priestess + Moon
    en: 'Two cards of hidden truth align — what you seek is already known to you beneath the surface.',
    zh: '兩張隱藏真相的牌相互呼應——你所尋找的，在內心深處早已知曉。',
  },
  '0-10': { // Fool + Wheel of Fortune
    en: 'A leap of faith meets a turning cycle — timing and trust are everything here.',
    zh: '信念的躍進遇上輪迴的轉動——時機與信任在此至關重要。',
  },
  '20-21': { // Judgment + World
    en: 'Awakening and completion in the same breath — you stand at the threshold of something fully realized.',
    zh: '覺醒與圓滿同時出現——你站在某件完全實現之事的門檻上。',
  },
  '13-17': { // Death + Star
    en: 'Transformation followed by renewal — what is released here becomes the fertile ground for hope.',
    zh: '轉化之後是更新——此處釋放的事物成為希望的沃土。',
  },
  '15-16': { // Devil + Tower
    en: 'Shadow and disruption collide — what has been suppressed is now breaking through, whether invited or not.',
    zh: '陰影與動盪碰撞——被壓抑的事物正在破土而出，無論你是否準備好。',
  },
  '19-21': { // Sun + World
    en: 'Radiant joy and wholeness together — this is the reading of someone arriving at where they were always heading.',
    zh: '燦爛的喜悅與圓滿同在——這是一個人抵達他們一直前往之處的解讀。',
  },
  '7-8': { // Chariot + Strength
    en: 'Outer drive meets inner courage — lasting progress here requires both force of will and compassion.',
    zh: '外在驅動力遇上內在勇氣——持久的進步需要意志力與慈悲心並行。',
  },
  '9-18': { // Hermit + Moon
    en: 'Deep solitude and the unconscious — a powerful call to sit with what is unresolved rather than push forward.',
    zh: '深度獨處與潛意識——強烈呼喚你靜坐於未解決的事物中，而非急於前進。',
  },
  '0-16': { // Fool + Tower
    en: 'Reckless beginnings meet sudden upheaval — the ground shifts beneath an unprepared leap.',
    zh: '魯莽的開始遇上突然的動盪——未準備好的躍進下，腳下的地面正在動搖。',
  },
};

export function detectIconicPair(a: DrawnCard, b: DrawnCard): PairInsight | null {
  const key = `${Math.min(a.card.id, b.card.id)}-${Math.max(a.card.id, b.card.id)}`;
  return ICONIC_PAIRS[key] ?? null;
}

const THEME_ACTION_EN: Record<ThemeBucket, string> = {
  transformation: 'embrace what is shifting and release what no longer serves',
  innerJourney: 'turn inward and trust what you already know beneath the surface',
  struggle: 'face what is difficult with honesty rather than avoidance',
  growth: 'nurture what is emerging and give it room to expand',
  achievement: 'step fully into your capability and see what you have already built',
  loveConnection: 'open your heart and invest genuinely in your connections',
  guidance: 'seek clarity and align your actions with your deeper values',
};

const THEME_ACTION_ZH: Record<ThemeBucket, string> = {
  transformation: '擁抱正在轉變的事物，釋放不再服務於你的一切',
  innerJourney: '向內轉，相信你在表面之下早已知曉的一切',
  struggle: '以誠實而非迴避的態度面對困難',
  growth: '滋養正在萌發的事物，給予它成長的空間',
  achievement: '充分展現你的能力，看見你已經建立的一切',
  loveConnection: '敞開你的心，真誠地投入你的連結',
  guidance: '尋求清晰，讓你的行動與更深層的價值觀一致',
};

export function buildClosingGuidance(outcomeCard: DrawnCard, theme: ThemeBucket): { en: string; zh: string } {
  const label = outcomeCard.card.name + (outcomeCard.isReversed ? ' (Reversed)' : '');
  const labelZh = outcomeCard.card.nameZh + (outcomeCard.isReversed ? ' (逆位)' : '');
  return {
    en: `${label} closes this reading with an invitation to ${THEME_ACTION_EN[theme]}.`,
    zh: `${labelZh}以邀請結束這次解讀：${THEME_ACTION_ZH[theme]}。`,
  };
}

export function generateReadingSummary(cards: DrawnCard[], spreadType: SpreadKey): SpreadSummary | null {
  const getMeaning = (cardData: DrawnCard): CardMeaning => {
    return cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
  };

  const getCardLabel = (cardData: DrawnCard): string => {
    const rev = cardData.isReversed ? ' (Reversed)' : '';
    return `${cardData.card.name}${rev}`;
  };

  const getCardLabelZh = (cardData: DrawnCard): string => {
    const rev = cardData.isReversed ? ' (逆位)' : '';
    return `${cardData.card.nameZh}${rev}`;
  };

  if (spreadType === 'threeCard') {
    const [past, present, future] = cards;
    const pastM = getMeaning(past);
    const presentM = getMeaning(present);
    const futureM = getMeaning(future);

    const theme = detectTheme(cards);
    const { patternNote } = detectPatterns(cards);
    const pairInsight = detectIconicPair(past, present) ?? detectIconicPair(present, future);
    const closing = buildClosingGuidance(future, theme);

    const THEME_OPENING_EN: Record<ThemeBucket, string> = {
      transformation: 'This reading is marked by transformation — change is not coming, it is already here.',
      innerJourney: 'The cards are pulling inward, asking you to examine what lies beneath the surface.',
      struggle: 'There is friction running through this reading — forces in tension that demand honest attention.',
      growth: 'An energy of expansion and possibility runs through your cards.',
      achievement: 'The cards reflect a moment of momentum — capability meeting opportunity.',
      loveConnection: 'Connection is the thread that binds this reading.',
      guidance: 'The cards point toward clarity — a call to examine and realign.',
    };

    const THEME_OPENING_ZH: Record<ThemeBucket, string> = {
      transformation: '這次解讀以轉變為標誌——變化不是即將到來，它已經在這裡了。',
      innerJourney: '牌正在向內引導，要求你審視表面之下的一切。',
      struggle: '這次解讀中貫穿著摩擦——緊張的力量需要誠實的關注。',
      growth: '你的牌中流淌著擴展與可能性的能量。',
      achievement: '牌反映了一個動力時刻——能力與機會的相遇。',
      loveConnection: '連結是貫穿這次解讀的主線。',
      guidance: '牌指向清晰——呼喚審視與重新校準。',
    };

    const summaryParts: string[] = [
      THEME_OPENING_EN[theme],
      `From your past, ${getCardLabel(past)} — ${pastM.meaning} — carried you into your present, where ${getCardLabel(present)} now reflects ${presentM.meaning} The path ahead opens through ${getCardLabel(future)}: ${futureM.meaning}`,
    ];

    const summaryPartsZh: string[] = [
      THEME_OPENING_ZH[theme],
      `從你的過去，${getCardLabelZh(past)}——${pastM.meaningZh}——將你帶入當下，在那裡${getCardLabelZh(present)}現在反映著${presentM.meaningZh}前方的道路通過${getCardLabelZh(future)}開啟：${futureM.meaningZh}`,
    ];

    if (patternNote) {
      summaryParts.push(patternNote.en);
      summaryPartsZh.push(patternNote.zh);
    }

    if (pairInsight) {
      summaryParts.push(pairInsight.en);
      summaryPartsZh.push(pairInsight.zh);
    }

    summaryParts.push(closing.en);
    summaryPartsZh.push(closing.zh);

    return {
      title: 'Your Timeline Reading',
      titleZh: '你的時間線解讀',
      summary: summaryParts.join(' '),
      summaryZh: summaryPartsZh.join(' '),
    };
  }

  if (spreadType === 'love') {
    const [you, partner, connection, challenge, outcome] = cards;
    const youM = getMeaning(you);
    const partnerM = getMeaning(partner);
    const connectionM = getMeaning(connection);
    const challengeM = getMeaning(challenge);
    const outcomeM = getMeaning(outcome);

    const theme = detectTheme(cards);
    const { patternNote } = detectPatterns(cards);
    const pairInsight = detectIconicPair(you, partner) ?? detectIconicPair(challenge, outcome);
    const closing = buildClosingGuidance(outcome, theme);

    const summaryParts = [
      `In matters of the heart, ${getCardLabel(you)} reflects how you are showing up in love right now: ${youM.love} Your partner or love interest, represented by ${getCardLabel(partner)}, brings this energy: ${partnerM.love} The connection between you, shaped by ${getCardLabel(connection)}, reveals: ${connectionM.love} The challenge you face together through ${getCardLabel(challenge)}: ${challengeM.love} And the path ahead, carried by ${getCardLabel(outcome)}: ${outcomeM.love}`,
    ];

    const summaryPartsZh = [
      `在感情方面，${getCardLabelZh(you)}反映了你目前在愛情中的狀態：${youM.loveZh}代表對方的${getCardLabelZh(partner)}帶來這樣的能量：${partnerM.loveZh}由${getCardLabelZh(connection)}塑造的連結揭示了：${connectionM.loveZh}你們共同面對的挑戰——${getCardLabelZh(challenge)}：${challengeM.loveZh}而前方的道路，由${getCardLabelZh(outcome)}承載：${outcomeM.loveZh}`,
    ];

    if (patternNote) {
      summaryParts.push(patternNote.en);
      summaryPartsZh.push(patternNote.zh);
    }

    if (pairInsight) {
      summaryParts.push(pairInsight.en);
      summaryPartsZh.push(pairInsight.zh);
    }

    summaryParts.push(closing.en);
    summaryPartsZh.push(closing.zh);

    return {
      title: 'Your Love Reading',
      titleZh: '你的愛情解讀',
      summary: summaryParts.join(' '),
      summaryZh: summaryPartsZh.join(' '),
    };
  }

  if (spreadType === 'celticCross') {
    const [present, challenge, past, future, above, below, advice, external, hopes, outcome] = cards;
    const presentM = getMeaning(present);
    const challengeM = getMeaning(challenge);
    const pastM = getMeaning(past);
    const futureM = getMeaning(future);
    const aboveM = getMeaning(above);
    const belowM = getMeaning(below);
    const adviceM = getMeaning(advice);
    const externalM = getMeaning(external);
    const hopesM = getMeaning(hopes);
    const outcomeM = getMeaning(outcome);

    const theme = detectTheme(cards);
    const { patternNote } = detectPatterns(cards);
    const pairInsight = detectIconicPair(present, challenge) ?? detectIconicPair(hopes, outcome);
    const closing = buildClosingGuidance(outcome, theme);

    const THEME_OPENING_EN: Record<ThemeBucket, string> = {
      transformation: 'This reading is marked by transformation — change is not coming, it is already here.',
      innerJourney: 'The cards are pulling inward, asking you to examine what lies beneath the surface.',
      struggle: 'There is friction running through this reading — forces in tension that demand honest attention.',
      growth: 'An energy of expansion and possibility runs through your cards.',
      achievement: 'The cards reflect a moment of momentum — capability meeting opportunity.',
      loveConnection: 'Connection is the thread that binds this reading.',
      guidance: 'The cards point toward clarity — a call to examine and realign.',
    };

    const THEME_OPENING_ZH: Record<ThemeBucket, string> = {
      transformation: '這次解讀以轉變為標誌——變化不是即將到來，它已經在這裡了。',
      innerJourney: '牌正在向內引導，要求你審視表面之下的一切。',
      struggle: '這次解讀中貫穿著摩擦——緊張的力量需要誠實的關注。',
      growth: '你的牌中流淌著擴展與可能性的能量。',
      achievement: '牌反映了一個動力時刻——能力與機會的相遇。',
      loveConnection: '連結是貫穿這次解讀的主線。',
      guidance: '牌指向清晰——呼喚審視與重新校準。',
    };

    const narrativeEn = [
      THEME_OPENING_EN[theme],
      `At the heart of your reading, ${getCardLabel(present)} defines your current situation — ${presentM.meaning.toLowerCase()} Crossing this is ${getCardLabel(challenge)}, representing the immediate force you must face: ${challengeM.meaning.toLowerCase()}`,
      `Your foundation in the recent past, ${getCardLabel(past)}, speaks of ${pastM.meaning.toLowerCase()} The near future brings ${getCardLabel(future)}: ${futureM.meaning.toLowerCase()}`,
      `Your highest aspirations are reflected by ${getCardLabel(above)} — ${aboveM.meaning.toLowerCase()} While deep in your subconscious, ${getCardLabel(below)} reveals ${belowM.meaning.toLowerCase()}`,
      `For guidance, ${getCardLabel(advice)} advises: ${adviceM.advice ?? adviceM.meaning.toLowerCase()} External influences from ${getCardLabel(external)} suggest ${externalM.meaning.toLowerCase()}`,
      `Your hopes and fears are embodied by ${getCardLabel(hopes)}: ${hopesM.meaning.toLowerCase()} The final outcome, ${getCardLabel(outcome)}, reveals ${outcomeM.meaning.toLowerCase()}`,
    ].join(' ');

    const narrativeZh = [
      THEME_OPENING_ZH[theme],
      `在你的解讀核心，${getCardLabelZh(present)}定義了你的當前處境——${presentM.meaningZh}與之交叉的是${getCardLabelZh(challenge)}，代表你必須面對的直接力量：${challengeM.meaningZh}`,
      `你近期過去的根基，${getCardLabelZh(past)}，訴說著${pastM.meaningZh}近期的未來帶來${getCardLabelZh(future)}：${futureM.meaningZh}`,
      `你最高的願望由${getCardLabelZh(above)}反映——${aboveM.meaningZh}在你的潛意識深處，${getCardLabelZh(below)}揭示了${belowM.meaningZh}`,
      `在指導方面，${getCardLabelZh(advice)}建議：${adviceM.adviceZh ?? adviceM.meaningZh}來自${getCardLabelZh(external)}的外部影響暗示${externalM.meaningZh}`,
      `你的希望與恐懼由${getCardLabelZh(hopes)}體現：${hopesM.meaningZh}最終結果——${getCardLabelZh(outcome)}揭示了${outcomeM.meaningZh}`,
    ].join(' ');

    const finalParts = [narrativeEn];
    const finalPartsZh = [narrativeZh];

    if (patternNote) {
      finalParts.push(patternNote.en);
      finalPartsZh.push(patternNote.zh);
    }

    if (pairInsight) {
      finalParts.push(pairInsight.en);
      finalPartsZh.push(pairInsight.zh);
    }

    finalParts.push(closing.en);
    finalPartsZh.push(closing.zh);

    return {
      title: 'Your Celtic Cross Reading',
      titleZh: '你的凱爾特十字解讀',
      summary: finalParts.join(' '),
      summaryZh: finalPartsZh.join(' '),
    };
  }

  return null;
}
