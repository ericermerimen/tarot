import type { DrawnCard, CardMeaning } from '@/types/tarot';

export interface SpreadSummary {
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
}

export function getPositionalInterpretation(
  cardData: DrawnCard,
  position: string,
  spreadType: string
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

export function generateReadingSummary(cards: DrawnCard[], spreadType: string, positions: string[], positionsZh: string[]): SpreadSummary | null {
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

    return {
      title: 'Your Timeline Reading',
      titleZh: '你的時間線解讀',
      summary: `Your past, shaped by ${getCardLabel(past)}, speaks of ${pastM.meaning.toLowerCase()} This energy has led you to your present moment, where ${getCardLabel(present)} reveals that ${presentM.meaning.toLowerCase()} Looking ahead, ${getCardLabel(future)} illuminates your path forward: ${futureM.meaning.toLowerCase()} The journey from ${past.card.keywords[0]} through ${present.card.keywords[0]} toward ${future.card.keywords[0]} suggests a meaningful progression unfolding in your life.`,
      summaryZh: `你的過去由${getCardLabelZh(past)}塑造，暗示著${pastM.meaningZh}這股能量引領你來到當下，${getCardLabelZh(present)}揭示了${presentM.meaningZh}展望未來，${getCardLabelZh(future)}照亮了你前進的道路：${futureM.meaningZh}從「${past.card.keywordsZh?.[0] || past.card.keywords[0]}」經過「${present.card.keywordsZh?.[0] || present.card.keywords[0]}」走向「${future.card.keywordsZh?.[0] || future.card.keywords[0]}」，暗示著你生命中正在展開一段有意義的進程。`,
    };
  }

  if (spreadType === 'love') {
    const [you, partner, connection, challenge, outcome] = cards;
    const youM = getMeaning(you);
    const partnerM = getMeaning(partner);
    const connectionM = getMeaning(connection);
    const challengeM = getMeaning(challenge);
    const outcomeM = getMeaning(outcome);

    return {
      title: 'Your Love Reading',
      titleZh: '你的愛情解讀',
      summary: `In matters of the heart, ${getCardLabel(you)} in the You position reveals how you're showing up in love right now: ${youM.love} Your partner or love interest, represented by ${getCardLabel(partner)}, brings this energy: ${partnerM.love} The connection between you, shaped by ${getCardLabel(connection)}, speaks to the bond you share: ${connectionM.love} The challenge you face together, ${getCardLabel(challenge)}, points to: ${challengeM.love} Ultimately, ${getCardLabel(outcome)} as the outcome reveals where this love story is headed: ${outcomeM.love} Trust the wisdom of these cards as you navigate your heart's journey.`,
      summaryZh: `在感情方面，「你」位置的${getCardLabelZh(you)}揭示了你目前在愛情中的狀態：${youM.loveZh}代表對方的${getCardLabelZh(partner)}帶來這樣的能量：${partnerM.loveZh}由${getCardLabelZh(connection)}塑造的連結訴說了你們共同的紐帶：${connectionM.loveZh}你們共同面對的挑戰——${getCardLabelZh(challenge)}，指向：${challengeM.loveZh}最終，${getCardLabelZh(outcome)}作為結果揭示了這段愛情故事的走向：${outcomeM.loveZh}在你的感情旅程中，請相信這些牌的智慧。`,
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

    return {
      title: 'Your Celtic Cross Reading',
      titleZh: '你的凱爾特十字解讀',
      summary: `At the heart of your reading, ${getCardLabel(present)} defines your current situation — ${presentM.meaning.toLowerCase()} Crossing this is ${getCardLabel(challenge)}, representing the challenge you must face: ${challengeM.meaning.toLowerCase()} Your foundation in the past, ${getCardLabel(past)}, tells of ${pastM.meaning.toLowerCase()} The near future brings ${getCardLabel(future)}: ${futureM.meaning.toLowerCase()}

Your highest aspirations are reflected by ${getCardLabel(above)} — ${aboveM.meaning.toLowerCase()} While deep in your subconscious, ${getCardLabel(below)} reveals ${belowM.meaning.toLowerCase()} For guidance, ${getCardLabel(advice)} advises that ${adviceM.meaning.toLowerCase()} External influences from ${getCardLabel(external)} suggest ${externalM.meaning.toLowerCase()}

Your hopes and fears are embodied by ${getCardLabel(hopes)}: ${hopesM.meaning.toLowerCase()} The final outcome, ${getCardLabel(outcome)}, reveals ${outcomeM.meaning.toLowerCase()} Take these insights as a compass for your journey ahead.`,
      summaryZh: `在你的解讀核心，${getCardLabelZh(present)}定義了你的當前處境——${presentM.meaningZh}與之交叉的是${getCardLabelZh(challenge)}，代表你必須面對的挑戰：${challengeM.meaningZh}你過去的根基——${getCardLabelZh(past)}，訴說著${pastM.meaningZh}近期的未來帶來${getCardLabelZh(future)}：${futureM.meaningZh}

你最高的願望由${getCardLabelZh(above)}反映——${aboveM.meaningZh}在你的潛意識深處，${getCardLabelZh(below)}揭示了${belowM.meaningZh}在指導方面，${getCardLabelZh(advice)}建議${adviceM.meaningZh}來自${getCardLabelZh(external)}的外部影響暗示${externalM.meaningZh}

你的希望與恐懼由${getCardLabelZh(hopes)}體現：${hopesM.meaningZh}最終結果——${getCardLabelZh(outcome)}揭示了${outcomeM.meaningZh}將這些洞見作為你前路的指南針。`,
    };
  }

  return null;
}
