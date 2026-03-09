import type { DrawnCard, CardMeaning, SpreadKey } from '@/types/tarot';

export interface SpreadSummary {
  title: string;
  titleZh: string;
  titleJa: string;
  summary: string;
  summaryZh: string;
  summaryJa: string;
  closing: string;
  closingZh: string;
  closingJa: string;
}

export function getPositionalInterpretation(
  cardData: DrawnCard,
  position: string,
  spreadType: SpreadKey
): { text: string; textZh: string; textJa: string } {
  const meaning = cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
  const name = cardData.card.name;
  const nameZh = cardData.card.nameZh;
  const nameJa = cardData.card.nameJa;
  const posLower = position.toLowerCase();

  if (spreadType === 'love') {
    const loveText = meaning.love;
    const loveTextZh = meaning.loveZh;
    const loveTextJa = meaning.loveJa;
    const frames: Record<string, { en: string; zh: string; ja: string }> = {
      you: {
        en: `${name} in the You position reflects the energy you're bringing to your relationship right now: ${loveText}`,
        zh: `「你」位置的${nameZh}反映了你目前帶入關係的能量：${loveTextZh}`,
        ja: `「あなた」の位置の${nameJa}は、今あなたが関係に持ち込んでいるエネルギーを映しています：${loveTextJa}`,
      },
      partner: {
        en: `${name} in the Partner position shows the energy your partner (or potential love) carries: ${loveText}`,
        zh: `「對方」位置的${nameZh}展示了你伴侶（或心儀對象）帶來的能量：${loveTextZh}`,
        ja: `「相手」の位置の${nameJa}は、パートナー（または気になる人）が持つエネルギーを示しています：${loveTextJa}`,
      },
      connection: {
        en: `${name} in the Connection position reveals the nature of the bond between you: ${loveText}`,
        zh: `「連結」位置的${nameZh}揭示了你們之間聯繫的本質：${loveTextZh}`,
        ja: `「繋がり」の位置の${nameJa}は、二人の間の絆の本質を明らかにしています：${loveTextJa}`,
      },
      challenge: {
        en: `${name} in the Challenge position highlights what needs to be worked through together: ${loveText}`,
        zh: `「挑戰」位置的${nameZh}指出了你們需要共同克服的事：${loveTextZh}`,
        ja: `「課題」の位置の${nameJa}は、二人で乗り越えるべきことを示しています：${loveTextJa}`,
      },
      outcome: {
        en: `${name} in the Outcome position reveals where your love story is heading: ${loveText}`,
        zh: `「結果」位置的${nameZh}揭示了你的愛情故事走向：${loveTextZh}`,
        ja: `「結果」の位置の${nameJa}は、あなたの恋の物語が向かう先を明らかにしています：${loveTextJa}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh, textJa: frame.ja };
    return { text: loveText, textZh: loveTextZh, textJa: loveTextJa };
  }

  if (spreadType === 'threeCard') {
    const frames: Record<string, { en: string; zh: string; ja: string }> = {
      past: {
        en: `${name} appears in your Past, revealing the energy that shaped where you stand today. ${meaning.meaning} This foundation, whether you recognized it at the time or not, set the stage for everything unfolding now.`,
        zh: `${nameZh}出現在你的「過去」，揭示了塑造你當前處境的能量。${meaning.meaningZh}無論你當時是否意識到，這段經歷為眼前發生的一切奠定了基礎。`,
        ja: `${nameJa}が「過去」に現れ、今のあなたを形作ったエネルギーを明らかにしています。${meaning.meaningJa}当時気づいていたかどうかに関わらず、この基盤が今起きているすべてのことの舞台を整えました。`,
      },
      present: {
        en: `${name} sits at the center of your Present, reflecting the energy you're living through right now. ${meaning.meaning} This is the lens through which your current experiences are being shaped.`,
        zh: `${nameZh}坐落於你的「現在」中心，反映了你此刻正在經歷的能量。${meaning.meaningZh}這是你當前經歷正在被塑造的透鏡。`,
        ja: `${nameJa}が「現在」の中心に座し、今あなたが生きているエネルギーを映し出しています。${meaning.meaningJa}これが、あなたの現在の経験が形作られるレンズです。`,
      },
      future: {
        en: `${name} emerges in your Future, pointing to the energy that is gathering ahead. ${meaning.meaning} While nothing is fixed, this card suggests the direction things are naturally moving.`,
        zh: `${nameZh}出現在你的「未來」，指向正在前方聚集的能量。${meaning.meaningZh}雖然未來並非固定不變，但這張牌暗示了事物自然發展的方向。`,
        ja: `${nameJa}が「未来」に現れ、前方に集まりつつあるエネルギーを指し示しています。${meaning.meaningJa}未来は固定されていませんが、このカードは物事が自然に向かう方向を示唆しています。`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh, textJa: frame.ja };
    return { text: meaning.meaning, textZh: meaning.meaningZh, textJa: meaning.meaningJa };
  }

  if (spreadType === 'celticCross') {
    const contextText = posLower === 'advice' && meaning.advice ? meaning.advice : meaning.meaning;
    const contextTextZh = posLower === 'advice' && meaning.adviceZh ? meaning.adviceZh : meaning.meaningZh;
    const contextTextJa = posLower === 'advice' && meaning.adviceJa ? meaning.adviceJa : meaning.meaningJa;
    const frames: Record<string, { en: string; zh: string; ja: string }> = {
      present: {
        en: `${name} at the center defines the heart of your current situation: ${contextText}`,
        zh: `中心位置的${nameZh}定義了你當前處境的核心：${contextTextZh}`,
        ja: `中心に位置する${nameJa}は、あなたの現状の核心を定義しています：${contextTextJa}`,
      },
      challenge: {
        en: `${name} as the Crossing card shows the immediate challenge or opposing force you must face: ${contextText}`,
        zh: `交叉牌位置的${nameZh}展示了你必須面對的直接挑戰或對立力量：${contextTextZh}`,
        ja: `交差カードとしての${nameJa}は、あなたが向き合うべき直接的な課題や対立する力を示しています：${contextTextJa}`,
      },
      past: {
        en: `${name} in the Past position shows the recent events or energies that led directly to this moment: ${contextText}`,
        zh: `「過去」位置的${nameZh}展示了直接導致這一刻的近期事件或能量：${contextTextZh}`,
        ja: `「過去」の位置の${nameJa}は、この瞬間に直接つながる最近の出来事やエネルギーを示しています：${contextTextJa}`,
      },
      future: {
        en: `${name} in the Future position points to what's coming in the near term: ${contextText}`,
        zh: `「未來」位置的${nameZh}指向近期將要發生的事：${contextTextZh}`,
        ja: `「未来」の位置の${nameJa}は、近い将来に訪れるものを指し示しています：${contextTextJa}`,
      },
      above: {
        en: `${name} in the Above position reflects your conscious goals and highest aspirations around this question: ${contextText}`,
        zh: `「目標」位置的${nameZh}反映了你圍繞這個問題的意識目標和最高願望：${contextTextZh}`,
        ja: `「目標」の位置の${nameJa}は、この問いに関するあなたの意識的な目標と最高の願望を映しています：${contextTextJa}`,
      },
      below: {
        en: `${name} in the Below position uncovers the subconscious patterns or hidden roots influencing your situation: ${contextText}`,
        zh: `「潛意識」位置的${nameZh}揭示了影響你處境的潛意識模式或隱藏根源：${contextTextZh}`,
        ja: `「潜在意識」の位置の${nameJa}は、あなたの状況に影響を与えている無意識のパターンや隠れた根源を明らかにしています：${contextTextJa}`,
      },
      advice: {
        en: `${name} in the Advice position offers guidance on how to move forward: ${contextText}`,
        zh: `「建議」位置的${nameZh}提供了如何前進的指引：${contextTextZh}`,
        ja: `「助言」の位置の${nameJa}は、前に進むための導きを示しています：${contextTextJa}`,
      },
      external: {
        en: `${name} in the External position shows the outside forces, people, or circumstances shaping your situation: ${contextText}`,
        zh: `「外在影響」位置的${nameZh}展示了塑造你處境的外部力量、人物或環境：${contextTextZh}`,
        ja: `「外的影響」の位置の${nameJa}は、あなたの状況を形作る外部の力、人物、環境を示しています：${contextTextJa}`,
      },
      'hopes/fears': {
        en: `${name} in the Hopes/Fears position reveals what you're simultaneously hoping for and dreading — these often mirror each other: ${contextText}`,
        zh: `「希望/恐懼」位置的${nameZh}揭示了你同時渴望和畏懼的事——這兩者往往互為鏡像：${contextTextZh}`,
        ja: `「希望/恐れ」の位置の${nameJa}は、あなたが同時に望み恐れていることを明らかにしています——この二つはしばしば鏡のように映し合います：${contextTextJa}`,
      },
      outcome: {
        en: `${name} in the Outcome position reveals the most likely result if the current energies continue on their path: ${contextText}`,
        zh: `「結果」位置的${nameZh}揭示了如果當前能量持續下去的最可能結果：${contextTextZh}`,
        ja: `「結果」の位置の${nameJa}は、現在のエネルギーがこのまま続いた場合の最も可能性の高い結果を明らかにしています：${contextTextJa}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh, textJa: frame.ja };
    return { text: contextText, textZh: contextTextZh, textJa: contextTextJa };
  }

  return { text: meaning.meaning, textZh: meaning.meaningZh, textJa: meaning.meaningJa };
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
  'determination': 'achievement',
  'success': 'achievement',
  'accomplishment': 'achievement',
  // moved to growth — these are too generic and bias toward achievement
  'positivity': 'growth',
  'vitality': 'growth',
  'joy': 'growth',
  'integration': 'growth',
  // moved to innerJourney
  'control': 'innerJourney',
  'free will': 'innerJourney',
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
  ja: string;
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
      ja: 'すべてのカードが正位置で現れています——このリーディングのエネルギーは直接的で、アクセスしやすく、すぐに取り組める状態です。',
    };
  } else if (reversalRatio >= 0.5) {
    patternNote = {
      en: 'Much of this reading\'s energy turns inward — blocked or internalized forces asking to be acknowledged and released before they can move forward.',
      zh: '這次解讀的大部分能量向內轉——被阻塞或內化的力量正在尋求被承認和釋放，之後才能向前推進。',
      ja: 'このリーディングのエネルギーの多くが内側に向かっています——認められ、解放されることを求める、阻まれたまたは内在化された力です。',
    };
  }

  return { reversalRatio, patternNote };
}

interface PairInsight {
  en: string;
  zh: string;
  ja: string;
}

// Keys are always `${smallerId}-${largerId}` to be order-independent.
const ICONIC_PAIRS: Record<string, PairInsight> = {
  '16-17': { // Tower + Star
    en: 'Disruption and hope appear side by side — what breaks open here makes space for something truer.',
    zh: '動盪與希望並肩出現——此處的破裂為更真實的事物騰出了空間。',
    ja: '崩壊と希望が並んで現れています——ここで壊れるものが、より真実なもののための空間を作ります。',
  },
  '6-15': { // Lovers + Devil
    en: 'Bondage and choice face each other — this reading hinges on what you are willing to release.',
    zh: '束縛與選擇相對而立——這次解讀的關鍵在於你願意放下什麼。',
    ja: '束縛と選択が向かい合っています——このリーディングの鍵は、あなたが何を手放す覚悟があるかにかかっています。',
  },
  '13-21': { // Death + World
    en: 'An ending and a completion appear together — a full cycle closes, and wholeness is within reach.',
    zh: '結束與圓滿同時出現——一個完整的循環結束，圓滿就在眼前。',
    ja: '終わりと完成が共に現れています——一つの完全な循環が閉じ、全体性が手の届くところにあります。',
  },
  '2-18': { // High Priestess + Moon
    en: 'Two cards of hidden truth align — what you seek is already known to you beneath the surface.',
    zh: '兩張隱藏真相的牌相互呼應——你所尋找的，在內心深處早已知曉。',
    ja: '隠された真実を持つ二枚のカードが揃っています——あなたが探しているものは、表面の下ですでに知っているのです。',
  },
  '0-10': { // Fool + Wheel of Fortune
    en: 'A leap of faith meets a turning cycle — timing and trust are everything here.',
    zh: '信念的躍進遇上輪迴的轉動——時機與信任在此至關重要。',
    ja: '信念の跳躍が巡る運命の輪と出会います——ここではタイミングと信頼がすべてです。',
  },
  '20-21': { // Judgment + World
    en: 'Awakening and completion in the same breath — you stand at the threshold of something fully realized.',
    zh: '覺醒與圓滿同時出現——你站在某件完全實現之事的門檻上。',
    ja: '目覚めと完成が同時に——あなたは完全に実現された何かの入り口に立っています。',
  },
  '13-17': { // Death + Star
    en: 'Transformation followed by renewal — what is released here becomes the fertile ground for hope.',
    zh: '轉化之後是更新——此處釋放的事物成為希望的沃土。',
    ja: '変容の後に再生が続きます——ここで手放されたものが希望の肥沃な土壌となります。',
  },
  '15-16': { // Devil + Tower
    en: 'Shadow and disruption collide — what has been suppressed is now breaking through, whether invited or not.',
    zh: '陰影與動盪碰撞——被壓抑的事物正在破土而出，無論你是否準備好。',
    ja: '影と崩壊が衝突します——抑圧されてきたものが、招かれたかどうかに関わらず、今まさに突き破ろうとしています。',
  },
  '19-21': { // Sun + World
    en: 'Radiant joy and wholeness together — this is the reading of someone arriving at where they were always heading.',
    zh: '燦爛的喜悅與圓滿同在——這是一個人抵達他們一直前往之處的解讀。',
    ja: '輝かしい喜びと全体性が共にあります——これは、ずっと向かっていた場所にたどり着いた人のリーディングです。',
  },
  '7-8': { // Chariot + Strength
    en: 'Outer drive meets inner courage — lasting progress here requires both force of will and compassion.',
    zh: '外在驅動力遇上內在勇氣——持久的進步需要意志力與慈悲心並行。',
    ja: '外的な推進力が内なる勇気と出会います——ここでの持続的な進歩には、意志の力と思いやりの両方が必要です。',
  },
  '9-18': { // Hermit + Moon
    en: 'Deep solitude and the unconscious — a powerful call to sit with what is unresolved rather than push forward.',
    zh: '深度獨處與潛意識——強烈呼喚你靜坐於未解決的事物中，而非急於前進。',
    ja: '深い孤独と無意識——前に進むよりも、未解決のものと共に座るようにという力強い呼びかけです。',
  },
  '0-16': { // Fool + Tower
    en: 'Reckless beginnings meet sudden upheaval — the ground shifts beneath an unprepared leap.',
    zh: '魯莽的開始遇上突然的動盪——未準備好的躍進下，腳下的地面正在動搖。',
    ja: '無謀な始まりが突然の激変と出会います——準備なき跳躍の下で、地面が揺れ動いています。',
  },
};

export function detectIconicPair(a: DrawnCard, b: DrawnCard): PairInsight | null {
  const key = `${Math.min(a.card.id, b.card.id)}-${Math.max(a.card.id, b.card.id)}`;
  return ICONIC_PAIRS[key] ?? null;
}

const THEME_ACTION_EN: Record<ThemeBucket, string[]> = {
  transformation: [
    'embrace what is shifting and release what no longer serves',
    'let the old form dissolve — something truer is taking shape',
    'release your grip on what was, and stop resisting the change that is already happening',
  ],
  innerJourney: [
    'turn inward and trust what you already know beneath the surface',
    'sit with the questions you have been avoiding — the answers live there',
    'slow down enough to hear what your deeper self has been trying to say',
  ],
  struggle: [
    'face what is difficult with honesty rather than avoidance',
    'name the tension clearly — it loses power when it is seen',
    'resist the urge to escape; the way through is the way forward',
  ],
  growth: [
    'nurture what is emerging and give it room to expand',
    'trust the pace of what is growing — not everything blooms on demand',
    'tend to the small signs of progress; they are the roots of something larger',
  ],
  achievement: [
    'step fully into your capability and see what you have already built',
    'claim the momentum you have earned — hesitation is the only thing in the way',
    'act from the place of someone who already knows they can do this',
  ],
  loveConnection: [
    'open your heart and invest genuinely in your connections',
    'be present with the people who matter — that alone changes everything',
    'let yourself be known; real connection requires that risk',
  ],
  guidance: [
    'seek clarity and align your actions with your deeper values',
    'ask what you actually believe, then act from that place',
    'let your values be the compass, not just the comfort',
  ],
};

const THEME_ACTION_ZH: Record<ThemeBucket, string[]> = {
  transformation: [
    '擁抱正在轉變的事物，釋放不再服務於你的一切',
    '讓舊有的形式消解——更真實的事物正在成形',
    '放開對舊有事物的執念，停止抗拒那已經在發生的改變',
  ],
  innerJourney: [
    '向內轉，相信你在表面之下早已知曉的一切',
    '靜坐於你一直在迴避的問題中——答案就住在那裡',
    '放慢腳步，聆聽你內心深處一直想說的話',
  ],
  struggle: [
    '以誠實而非迴避的態度面對困難',
    '清晰地命名這份張力——被看見後，它便失去力量',
    '抗拒逃避的衝動；穿越其中，才是前進之路',
  ],
  growth: [
    '滋養正在萌發的事物，給予它成長的空間',
    '信任成長的節奏——並非一切都按需開花',
    '照料那些細小的進步跡象；它們是更大事物的根基',
  ],
  achievement: [
    '充分展現你的能力，看見你已經建立的一切',
    '承接你已經贏得的動力——猶豫是唯一的障礙',
    '以一個已知自己能做到的人的姿態行動',
  ],
  loveConnection: [
    '敞開你的心，真誠地投入你的連結',
    '與那些重要的人同在——光是這一點，就能改變一切',
    '讓自己被認識；真實的連結需要這份冒險',
  ],
  guidance: [
    '尋求清晰，讓你的行動與更深層的價值觀一致',
    '問問自己真正相信什麼，然後從那個地方行動',
    '讓你的價值觀成為指南針，而不只是安慰',
  ],
};

const THEME_ACTION_JA: Record<ThemeBucket, string[]> = {
  transformation: [
    '変わりゆくものを受け入れ、もう役に立たないものを手放しましょう',
    '古い形を溶かしましょう——より真実なものが形を成しつつあります',
    '過去への執着を手放し、すでに起きている変化への抵抗をやめましょう',
  ],
  innerJourney: [
    '内に向かい、表面の下ですでに知っていることを信じましょう',
    '避けてきた問いに向き合いましょう——答えはそこにあります',
    '深い自分が伝えようとしていることに耳を傾けるため、十分に立ち止まりましょう',
  ],
  struggle: [
    '回避ではなく誠実さで困難に向き合いましょう',
    '緊張を明確に名前づけましょう——見られた時、それは力を失います',
    '逃げたい衝動に抗いましょう。その中を通ることが前に進む道です',
  ],
  growth: [
    '芽生えつつあるものを育み、広がる余地を与えましょう',
    '成長のペースを信じましょう——すべてが求めに応じて咲くわけではありません',
    '小さな進歩の兆しを大切に。それはもっと大きなものの根です',
  ],
  achievement: [
    '自分の能力を存分に発揮し、すでに築いたものを見つめましょう',
    '得た勢いを受け止めましょう——ためらいだけが唯一の障害です',
    'すでにできると知っている人として行動しましょう',
  ],
  loveConnection: [
    '心を開き、繋がりに誠実に投資しましょう',
    '大切な人と共にいましょう——それだけですべてが変わります',
    '自分をさらけ出しましょう。本当の繋がりにはそのリスクが必要です',
  ],
  guidance: [
    '明晰さを求め、行動をより深い価値観と一致させましょう',
    '自分が本当に信じていることを問い、その場所から行動しましょう',
    '価値観を指針とし、慰めだけにしないようにしましょう',
  ],
};

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

const THEME_OPENING_JA: Record<ThemeBucket, string> = {
  transformation: 'このリーディングは変容に彩られています——変化は来るのではなく、すでにここにあります。',
  innerJourney: 'カードは内側へと引き込み、表面の下にあるものを見つめるよう求めています。',
  struggle: 'このリーディングには摩擦が走っています——正直に向き合うことを求める緊張した力。',
  growth: '拡張と可能性のエネルギーがあなたのカードを貫いています。',
  achievement: 'カードは勢いの瞬間を映し出しています——能力とチャンスの出会い。',
  loveConnection: '繋がりがこのリーディングを結ぶ糸です。',
  guidance: 'カードは明晰さを指し示しています——見つめ直し、再び整えるための呼びかけ。',
};

export function buildClosingGuidance(outcomeCard: DrawnCard, theme: ThemeBucket, cards: DrawnCard[] = []): { en: string; zh: string; ja: string } {
  const label = `**${outcomeCard.card.name}${outcomeCard.isReversed ? ' (Reversed)' : ''}**`;
  const labelZh = `**${outcomeCard.card.nameZh}${outcomeCard.isReversed ? ' (逆位)' : ''}**`;
  const labelJa = `**${outcomeCard.card.nameJa}${outcomeCard.isReversed ? '（逆位置）' : ''}**`;
  const seed = cards.reduce((sum, c) => sum + c.card.id + (c.isReversed ? 100 : 0), outcomeCard.card.id);
  const actionsEn = THEME_ACTION_EN[theme];
  const actionsZh = THEME_ACTION_ZH[theme];
  const actionsJa = THEME_ACTION_JA[theme];
  const idx = seed % actionsEn.length;
  return {
    en: `${label} closes this reading with an invitation to ${actionsEn[idx]}.`,
    zh: `${labelZh}以邀請結束這次解讀：${actionsZh[idx]}。`,
    ja: `${labelJa}がこのリーディングを締めくくります——${actionsJa[idx]}。`,
  };
}

export function generateReadingSummary(cards: DrawnCard[], spreadType: SpreadKey): SpreadSummary | null {
  const getMeaning = (cardData: DrawnCard): CardMeaning => {
    return cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
  };

  const getCardLabel = (cardData: DrawnCard): string => {
    const rev = cardData.isReversed ? ' (Reversed)' : '';
    return `**${cardData.card.name}${rev}**`;
  };

  const getCardLabelZh = (cardData: DrawnCard): string => {
    const rev = cardData.isReversed ? ' (逆位)' : '';
    return `**${cardData.card.nameZh}${rev}**`;
  };

  const getCardLabelJa = (cardData: DrawnCard): string => {
    const rev = cardData.isReversed ? '（逆位置）' : '';
    return `**${cardData.card.nameJa}${rev}**`;
  };

  if (spreadType === 'threeCard') {
    const [past, present, future] = cards;
    const pastM = getMeaning(past);
    const presentM = getMeaning(present);
    const futureM = getMeaning(future);

    const theme = detectTheme(cards);
    const { patternNote } = detectPatterns(cards);
    const pairInsight = detectIconicPair(past, present) ?? detectIconicPair(present, future);
    const closing = buildClosingGuidance(future, theme, cards);

    const summaryParts: string[] = [
      THEME_OPENING_EN[theme],
      `Looking back, ${getCardLabel(past)} reveals the energy that shaped where you stand today — ${pastM.meaning}`,
      `This has carried you into a present defined by ${getCardLabel(present)}. Right now, ${presentM.meaning}`,
      `As you look ahead, ${getCardLabel(future)} opens the way forward: ${futureM.meaning}`,
    ];

    const summaryPartsZh: string[] = [
      THEME_OPENING_ZH[theme],
      `回望過去，${getCardLabelZh(past)}揭示了塑造你當前處境的能量——${pastM.meaningZh}`,
      `這段經歷將你帶入了由${getCardLabelZh(present)}所定義的當下。此刻，${presentM.meaningZh}`,
      `展望未來，${getCardLabelZh(future)}為你開啟了前方的道路：${futureM.meaningZh}`,
    ];

    const summaryPartsJa: string[] = [
      THEME_OPENING_JA[theme],
      `振り返ると、${getCardLabelJa(past)}が今のあなたを形作ったエネルギーを明らかにしています——${pastM.meaningJa}`,
      `この経験があなたを${getCardLabelJa(present)}に象徴される現在へと導きました。今まさに、${presentM.meaningJa}`,
      `前を見据えると、${getCardLabelJa(future)}が進むべき道を照らしています：${futureM.meaningJa}`,
    ];

    if (patternNote) {
      summaryParts.push(patternNote.en);
      summaryPartsZh.push(patternNote.zh);
      summaryPartsJa.push(patternNote.ja);
    }

    if (pairInsight) {
      summaryParts.push(pairInsight.en);
      summaryPartsZh.push(pairInsight.zh);
      summaryPartsJa.push(pairInsight.ja);
    }

    return {
      title: 'Your Timeline Reading',
      titleZh: '你的時間線解讀',
      titleJa: 'あなたのタイムラインリーディング',
      summary: summaryParts.join('\n\n'),
      summaryZh: summaryPartsZh.join('\n\n'),
      summaryJa: summaryPartsJa.join('\n\n'),
      closing: closing.en,
      closingZh: closing.zh,
      closingJa: closing.ja,
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
    const closing = buildClosingGuidance(outcome, theme, cards);

    const summaryParts = [
      `In matters of the heart, ${getCardLabel(you)} reveals the energy you are bringing into love right now — ${youM.love}`,
      `On the other side, ${getCardLabel(partner)} speaks to the energy your partner or love interest carries: ${partnerM.love}`,
      `Between you, ${getCardLabel(connection)} illuminates the nature of your bond — ${connectionM.love}`,
      `Yet every connection has its growing edges. ${getCardLabel(challenge)} highlights what needs attention: ${challengeM.love}`,
      `Looking to where this story leads, ${getCardLabel(outcome)} points the way: ${outcomeM.love}`,
    ];

    const summaryPartsZh = [
      `在感情方面，${getCardLabelZh(you)}揭示了你目前帶入愛情的能量——${youM.loveZh}`,
      `而另一方面，${getCardLabelZh(partner)}訴說著你的伴侶或心儀對象所攜帶的能量：${partnerM.loveZh}`,
      `在你們之間，${getCardLabelZh(connection)}照亮了你們連結的本質——${connectionM.loveZh}`,
      `然而每段感情都有需要成長的地方。${getCardLabelZh(challenge)}指出了需要關注的部分：${challengeM.loveZh}`,
      `展望這段故事的走向，${getCardLabelZh(outcome)}為你指引方向：${outcomeM.loveZh}`,
    ];

    const summaryPartsJa = [
      `恋愛において、${getCardLabelJa(you)}は今あなたが愛に持ち込んでいるエネルギーを明らかにしています——${youM.loveJa}`,
      `一方で、${getCardLabelJa(partner)}はパートナーや気になる相手が持つエネルギーを語っています：${partnerM.loveJa}`,
      `二人の間で、${getCardLabelJa(connection)}が絆の本質を照らし出しています——${connectionM.loveJa}`,
      `しかし、どんな繋がりにも成長が必要な部分があります。${getCardLabelJa(challenge)}が注目すべき点を示しています：${challengeM.loveJa}`,
      `この物語が向かう先を見据えると、${getCardLabelJa(outcome)}が道を示しています：${outcomeM.loveJa}`,
    ];

    if (patternNote) {
      summaryParts.push(patternNote.en);
      summaryPartsZh.push(patternNote.zh);
      summaryPartsJa.push(patternNote.ja);
    }

    if (pairInsight) {
      summaryParts.push(pairInsight.en);
      summaryPartsZh.push(pairInsight.zh);
      summaryPartsJa.push(pairInsight.ja);
    }

    return {
      title: 'Your Love Reading',
      titleZh: '你的愛情解讀',
      titleJa: 'あなたの恋愛リーディング',
      summary: summaryParts.join('\n\n'),
      summaryZh: summaryPartsZh.join('\n\n'),
      summaryJa: summaryPartsJa.join('\n\n'),
      closing: closing.en,
      closingZh: closing.zh,
      closingJa: closing.ja,
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
    const closing = buildClosingGuidance(outcome, theme, cards);

    const narrativeEn = [
      THEME_OPENING_EN[theme],
      `At the heart of this reading, ${getCardLabel(present)} defines your current reality — ${presentM.meaning.toLowerCase()} Cutting across this is ${getCardLabel(challenge)}, the immediate tension you must navigate: ${challengeM.meaning.toLowerCase()}`,
      `The roots of this moment lie in the recent past, where ${getCardLabel(past)} speaks of ${pastM.meaning.toLowerCase()} From here, the energy shifts toward ${getCardLabel(future)} in the near future: ${futureM.meaning.toLowerCase()}`,
      `Above you, ${getCardLabel(above)} reflects your conscious aspirations — ${aboveM.meaning.toLowerCase()} Beneath the surface, ${getCardLabel(below)} uncovers deeper undercurrents: ${belowM.meaning.toLowerCase()}`,
      `When it comes to guidance, ${getCardLabel(advice)} offers a clear directive: ${adviceM.advice ?? adviceM.meaning.toLowerCase()} Meanwhile, ${getCardLabel(external)} reveals the outside forces shaping your situation: ${externalM.meaning.toLowerCase()}`,
      `Your inner hopes and fears converge in ${getCardLabel(hopes)}: ${hopesM.meaning.toLowerCase()} And the reading resolves into ${getCardLabel(outcome)} as the most likely outcome — ${outcomeM.meaning.toLowerCase()}`,
    ].join('\n\n');

    const narrativeZh = [
      THEME_OPENING_ZH[theme],
      `在這次解讀的核心，${getCardLabelZh(present)}定義了你的當前處境——${presentM.meaningZh}與之交叉的是${getCardLabelZh(challenge)}，你需要面對的當下張力：${challengeM.meaningZh}`,
      `這一刻的根源在於近期的過去，${getCardLabelZh(past)}訴說著${pastM.meaningZh}由此，能量轉向了近期未來的${getCardLabelZh(future)}：${futureM.meaningZh}`,
      `在你之上，${getCardLabelZh(above)}反映了你意識層面的願望——${aboveM.meaningZh}在表面之下，${getCardLabelZh(below)}揭示了更深層的暗流：${belowM.meaningZh}`,
      `在指引方面，${getCardLabelZh(advice)}給出了明確的方向：${adviceM.adviceZh ?? adviceM.meaningZh}同時，${getCardLabelZh(external)}揭示了影響你處境的外在力量：${externalM.meaningZh}`,
      `你內心的希望與恐懼匯聚在${getCardLabelZh(hopes)}：${hopesM.meaningZh}而解讀最終指向${getCardLabelZh(outcome)}作為最可能的結果——${outcomeM.meaningZh}`,
    ].join('\n\n');

    const narrativeJa = [
      THEME_OPENING_JA[theme],
      `このリーディングの核心で、${getCardLabelJa(present)}が現在の状況を映し出しています——${presentM.meaningJa}これに交差するのは${getCardLabelJa(challenge)}、今まさに向き合うべき緊張です：${challengeM.meaningJa}`,
      `この瞬間の根は近い過去にあり、${getCardLabelJa(past)}が語りかけています：${pastM.meaningJa}ここから、エネルギーは近い未来の${getCardLabelJa(future)}へと移り変わります：${futureM.meaningJa}`,
      `あなたの上方に、${getCardLabelJa(above)}が意識的な願望を映しています——${aboveM.meaningJa}その水面下では、${getCardLabelJa(below)}がより深い潮流を明らかにしています：${belowM.meaningJa}`,
      `導きにおいて、${getCardLabelJa(advice)}は明確な指針を示しています：${adviceM.adviceJa ?? adviceM.meaningJa}一方で、${getCardLabelJa(external)}があなたの状況を形作る外的な力を明らかにしています：${externalM.meaningJa}`,
      `あなたの希望と恐れは${getCardLabelJa(hopes)}に集約されています：${hopesM.meaningJa}そしてリーディングは${getCardLabelJa(outcome)}を最も可能性の高い結果として示しています——${outcomeM.meaningJa}`,
    ].join('\n\n');

    const finalParts = [narrativeEn];
    const finalPartsZh = [narrativeZh];
    const finalPartsJa = [narrativeJa];

    if (patternNote) {
      finalParts.push(patternNote.en);
      finalPartsZh.push(patternNote.zh);
      finalPartsJa.push(patternNote.ja);
    }

    if (pairInsight) {
      finalParts.push(pairInsight.en);
      finalPartsZh.push(pairInsight.zh);
      finalPartsJa.push(pairInsight.ja);
    }

    return {
      title: 'Your Celtic Cross Reading',
      titleZh: '你的凱爾特十字解讀',
      titleJa: 'あなたのケルト十字リーディング',
      summary: finalParts.join('\n\n'),
      summaryZh: finalPartsZh.join('\n\n'),
      summaryJa: finalPartsJa.join('\n\n'),
      closing: closing.en,
      closingZh: closing.zh,
      closingJa: closing.ja,
    };
  }

  return null;
}
