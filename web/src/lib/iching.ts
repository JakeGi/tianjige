// 周易六十四卦精要与六爻推演算法
export interface Yao {
  value: 6 | 7 | 8 | 9; // 6: 老阴(变), 7: 少阳, 8: 少阴, 9: 老阳(变)
  isYang: boolean;
  isChanging: boolean;
  name: string;
}

export interface HexagramDetail {
  number: number;
  name: string;
  upperTrigram: string; // 上卦(外卦)
  lowerTrigram: string; // 下卦(内卦)
  nature: string; // 天地水火风雷山泽
  guaci: string; // 卦辞
  xiangci: string; // 大象辞
  modernInsight: string; // 现代生活/职场/心理启示
}

// 八卦基础
export const TRIGRAMS: Record<string, { symbol: string; nature: string; wuxing: string }> = {
  '111': { symbol: '乾', nature: '天', wuxing: '金' },
  '011': { symbol: '兑', nature: '泽', wuxing: '金' },
  '101': { symbol: '离', nature: '火', wuxing: '火' },
  '001': { symbol: '震', nature: '雷', wuxing: '木' },
  '110': { symbol: '巽', nature: '风', wuxing: '木' },
  '010': { symbol: '坎', nature: '水', wuxing: '水' },
  '100': { symbol: '艮', nature: '山', wuxing: '土' },
  '000': { symbol: '坤', nature: '地', wuxing: '土' },
};

// 精选核心卦象字典（涵盖最常见与具代表性的卦意）
export const HEXAGRAM_DATA: Record<string, HexagramDetail> = {
  '乾为天': {
    number: 1,
    name: '乾为天',
    upperTrigram: '乾',
    lowerTrigram: '乾',
    nature: '纯阳至健',
    guaci: '元，亨，利，贞。',
    xiangci: '天行健，君子以自强不息。',
    modernInsight: '当前时机充满刚健进取之势，自我驱动力极强。宜顺应规律，积蓄内力，不可骄矜冒进，潜龙在渊时耐得住寂寞，飞龙在天时方能从容。'
  },
  '坤为地': {
    number: 2,
    name: '坤为地',
    upperTrigram: '坤',
    lowerTrigram: '坤',
    nature: '厚德载物',
    guaci: '元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋。',
    xiangci: '地势坤，君子以厚德载物。',
    modernInsight: '当求宽厚包容、以退为进。此时宜守不宜急攻，注重倾听与团队协作，通过托举他人来成就大局，深蓄厚植。'
  },
  '水雷屯': {
    number: 3,
    name: '水雷屯',
    upperTrigram: '坎',
    lowerTrigram: '震',
    nature: '万物始生',
    guaci: '元亨利贞。勿用有攸往，利建侯。',
    xiangci: '云雷屯，君子以经纶。',
    modernInsight: '万事开头难，如同春草破土，前方虽有阻隔，但内在生机勃发。切忌盲动，需梳理头绪、建立框架与同盟。'
  },
  '山水蒙': {
    number: 4,
    name: '山水蒙',
    upperTrigram: '艮',
    lowerTrigram: '坎',
    nature: '启蒙解惑',
    guaci: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
    xiangci: '山下出泉，蒙；君子以果行育德。',
    modernInsight: '正处于求知探索期或面临迷惘。宜放低姿态虚心求教，遵循专一与诚敬之心，静心沉淀方能破除认知盲区。'
  },
  '水天需': {
    number: 5,
    name: '水天需',
    upperTrigram: '坎',
    lowerTrigram: '乾',
    nature: '守正待时',
    guaci: '有孚，光亨，贞吉。利涉大川。',
    xiangci: '云上于天，需；君子以饮食宴乐。',
    modernInsight: '云汽升天尚未成雨，需耐心等待最恰当的时机。保持从容心境，养精蓄锐，好饭不怕晚，蓄势而后发。'
  },
  '地天泰': {
    number: 11,
    name: '地天泰',
    upperTrigram: '坤',
    lowerTrigram: '乾',
    nature: '天地交泰',
    guaci: '小往大来，吉亨。',
    xiangci: '天地交，泰；后以财成天地之道，辅相天地之宜，以左右民。',
    modernInsight: '阴阳相交，通达顺遂之象。人际沟通顺畅，合作共赢正当时。但需居安思危，珍惜当下的良好发展窗口。'
  },
  '火天大有': {
    number: 14,
    name: '火天大有',
    upperTrigram: '离',
    lowerTrigram: '乾',
    nature: '顺天依时',
    guaci: '元亨。',
    xiangci: '火在天上，大有；君子以遏恶扬善，顺天休命。',
    modernInsight: '日丽中天，资源丰盈，影响力提升。宜心怀谦逊，将收获分享与回馈周围，方能保持恒久昌盛。'
  },
  '地山谦': {
    number: 15,
    name: '地山谦',
    upperTrigram: '坤',
    lowerTrigram: '艮',
    nature: '谦逊受益',
    guaci: '亨，君子有终。',
    xiangci: '地中有山，谦；君子以裒多益寡，称物平施。',
    modernInsight: '《易经》六十四卦中唯一六爻皆吉之卦。高山深藏于地底，大智若愚。越是身处要位，越以虚怀若谷对待周遭，必有善终。'
  },
  '火水未济': {
    number: 64,
    name: '火水未济',
    upperTrigram: '离',
    lowerTrigram: '坎',
    nature: '周而复始',
    guaci: '亨，小狐汔济，濡其尾，无攸利。',
    xiangci: '火在水上，未济；君子以慎辨物居方。',
    modernInsight: '事物永远处于循环更新之中，未完成即意味着无限可能性。保持敬畏与慎微，凡事注重细节复盘，迎接下一轮蜕变。'
  }
};

// 默认兜底卦象生成
export function getHexagramFromTrigrams(upper: string, lower: string): HexagramDetail {
  const compositeName = `${upper}${lower}`;
  // 查找已知匹配
  for (const key of Object.keys(HEXAGRAM_DATA)) {
    if (HEXAGRAM_DATA[key].upperTrigram === upper && HEXAGRAM_DATA[key].lowerTrigram === lower) {
      return HEXAGRAM_DATA[key];
    }
  }

  return {
    number: 0,
    name: `${upper}${lower}卦`,
    upperTrigram: upper,
    lowerTrigram: lower,
    nature: '阴阳互动',
    guaci: '顺应四时，内修定力，外应万象。',
    xiangci: '君子顺德，正心诚意，以立大本。',
    modernInsight: '事物处在变化之中，注重内外平衡，审视当下的心念与行动，谋定而后动。'
  };
}

// 模拟摇掷三枚铜钱单次结果
// 正面为阳(3)，背面为阴(2)
// 三正面 = 3+3+3 = 9 (老阳，动爻变阴)
// 二正一背 = 3+3+2 = 8 (少阴，静爻)
// 一正二背 = 3+2+2 = 7 (少阳，静爻)
// 三背面 = 2+2+2 = 6 (老阴，动爻变阳)
export function tossCoins(): Yao {
  const coin1 = Math.random() > 0.5 ? 3 : 2;
  const coin2 = Math.random() > 0.5 ? 3 : 2;
  const coin3 = Math.random() > 0.5 ? 3 : 2;
  const sum = (coin1 + coin2 + coin3) as 6 | 7 | 8 | 9;

  const map: Record<6 | 7 | 8 | 9, { isYang: boolean; isChanging: boolean; name: string }> = {
    6: { isYang: false, isChanging: true, name: '老阴 (⚋ 变 ⚊)' },
    7: { isYang: true, isChanging: false, name: '少阳 (⚊)' },
    8: { isYang: false, isChanging: false, name: '少阴 (⚋)' },
    9: { isYang: true, isChanging: true, name: '老阳 (⚊ 变 ⚋)' }
  };

  return {
    value: sum,
    isYang: map[sum].isYang,
    isChanging: map[sum].isChanging,
    name: map[sum].name
  };
}

// 将 6 个爻从初爻(下)到上爻(上)转换为卦象
export function interpretHexagram(yaos: Yao[]): {
  originalHexagram: HexagramDetail;
  transformedHexagram?: HexagramDetail;
  changingYaosCount: number;
} {
  if (yaos.length !== 6) {
    throw new Error('需掷满六爻');
  }

  // 下卦：爻0, 爻1, 爻2
  // 上卦：爻3, 爻4, 爻5
  const lowerBits = yaos.slice(0, 3).map(y => (y.isYang ? '1' : '0')).join('');
  const upperBits = yaos.slice(3, 6).map(y => (y.isYang ? '1' : '0')).join('');

  const lowerTrigram = TRIGRAMS[lowerBits]?.symbol || '坤';
  const upperTrigram = TRIGRAMS[upperBits]?.symbol || '乾';
  const original = getHexagramFromTrigrams(upperTrigram, lowerTrigram);

  // 计算变卦
  const hasChanges = yaos.some(y => y.isChanging);
  let transformed: HexagramDetail | undefined = undefined;

  if (hasChanges) {
    const transformedLowerBits = yaos.slice(0, 3).map(y => {
      if (y.value === 6) return '1'; // 老阴变阳
      if (y.value === 9) return '0'; // 老阳变阴
      return y.isYang ? '1' : '0';
    }).join('');

    const transformedUpperBits = yaos.slice(3, 6).map(y => {
      if (y.value === 6) return '1';
      if (y.value === 9) return '0';
      return y.isYang ? '1' : '0';
    }).join('');

    const transLower = TRIGRAMS[transformedLowerBits]?.symbol || '坤';
    const transUpper = TRIGRAMS[transformedUpperBits]?.symbol || '乾';
    transformed = getHexagramFromTrigrams(transUpper, transLower);
  }

  return {
    originalHexagram: original,
    transformedHexagram: transformed,
    changingYaosCount: yaos.filter(y => y.isChanging).length
  };
}
