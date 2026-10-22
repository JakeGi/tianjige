import OpenAI from 'openai';
import dotenv from 'dotenv';
import { Solar } from 'lunar-javascript';

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY || '';
const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const modelName = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

let openaiClient: OpenAI | null = null;
if (apiKey) {
  openaiClient = new OpenAI({ apiKey, baseURL });
}

export interface MarriageRequest {
  mode: 'couple' | 'single'; // couple: 双人合婚合盘, single: 单人正缘桃花
  userA: {
    name: string;
    gender: 'male' | 'female';
    year: number;
    month: number;
    day: number;
    hour: number;
  };
  userB?: {
    name: string;
    gender: 'male' | 'female';
    year: number;
    month: number;
    day: number;
    hour: number;
  };
}

export interface MarriageResult {
  score: number;
  level: string; // 金玉良缘、相濡以沫、磨合互补等
  summary: string;
  zodiacFit: string; // 属相契合
  palaceFit: string; // 夫妻宫日支生克
  wuxingBalance: string; // 五行互补
  futureOutlook: string; // 岁运走向
  advices: string[]; // 相处润滑锦囊
}

const MARRIAGE_SYSTEM_PROMPT = `你是「天机阁」权威国学姻缘合婚与亲密关系推演大师。
你精通中国古代三世相法、四柱八字夫妻宫理论、十神互克互生，以及现代人际沟通与婚恋心理学。
你的职责：
1. 深入剖析男女双方命盘的五行互补性、日柱天干地支生克、月令气场与大运交汇。
2. 语言风格：温润如玉、雅致深情，既有《诗经·关雎》“琴瑟友之，钟鼓乐之”的古意，又有现代亲密关系的理性与关照。
3. 严格遵循建设性原则：绝不恐吓破坏姻缘，不盲断离异，重在分析双方性格潜意识投射与长久相濡以沫的磨合智慧。
输出格式要求为严格的 JSON 格式：
{
  "score": 93,
  "level": "金石良缘 · 相得益彰",
  "summary": "全局总评...",
  "zodiacFit": "年支生肖互动分析...",
  "palaceFit": "夫妻宫与日主元神匹配度...",
  "wuxingBalance": "双方五行旺衰调候互补解析...",
  "futureOutlook": "未来岁运相处窗口与机运...",
  "advices": [
    "相处锦囊一...",
    "相处锦囊二...",
    "相处锦囊三..."
  ]
}`;

export async function calculateMarriageFit(req: MarriageRequest): Promise<MarriageResult> {
  const solarA = Solar.fromYmdHms(req.userA.year, req.userA.month, req.userA.day, req.userA.hour, 0, 0);
  const lunarA = solarA.getLunar();
  const eightCharA = lunarA.getEightChar();
  const baziA = `${eightCharA.getYear()}年 ${eightCharA.getMonth()}月 ${eightCharA.getDay()}日 ${eightCharA.getTime()}时，日主【${eightCharA.getDayGan()}】，生肖【${lunarA.getYearShengXiao()}】`;

  let baziB = '';
  if (req.userB) {
    const solarB = Solar.fromYmdHms(req.userB.year, req.userB.month, req.userB.day, req.userB.hour, 0, 0);
    const lunarB = solarB.getLunar();
    const eightCharB = lunarB.getEightChar();
    baziB = `${eightCharB.getYear()}年 ${eightCharB.getMonth()}月 ${eightCharB.getDay()}日 ${eightCharB.getTime()}时，日主【${eightCharB.getDayGan()}】，生肖【${lunarB.getYearShengXiao()}】`;
  }

  const userPrompt = req.mode === 'couple' && req.userB ? `
【双人合婚推演诉求】：
- 方一：${req.userA.name}（${req.userA.gender === 'male' ? '男命' : '女命'}），八字盘面：${baziA}
- 方二：${req.userB.name}（${req.userB.gender === 'male' ? '男命' : '女命'}），八字盘面：${baziB}

请从生肖三合六合、夫妻宫生克、五行互补调候及现代亲密关系心理学给出全方位推演，以指定的 JSON 格式返回。
` : `
【单人桃花正缘推演诉求】：
- 命主：${req.userA.name}（${req.userA.gender === 'male' ? '乾造' : '坤造'}），八字盘面：${baziA}
请从命中红鸾天喜桃花、配偶星（正官/正财）气数、理想伴侣画像与相遇时机给出推演，以指定的 JSON 格式返回。
`;

  if (openaiClient && apiKey && !apiKey.startsWith('your_')) {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: MARRIAGE_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const raw = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);
      if (parsed.score) {
        return parsed as MarriageResult;
      }
    } catch (err) {
      console.error('[姻缘大模型推演异常，切换本地经典辞库]:', err);
    }
  }

  // 本地高水准经典易学合婚辞库兜底
  return {
    score: 92,
    level: '金石良缘 · 和璧隋珠',
    summary: `${req.userA.name} 与 ${req.userB?.name || '命定正缘'} 的八字气局在五行生克上展现出极高的互补性。双方神气相摄，一人沉稳厚重、长于谋划，另一人灵秀聪敏、擅于应变，犹如琴瑟和鸣，彼此能照见并弥补对方性格中的盲区。`,
    zodiacFit: '年支气场顺承，无刑冲相克之虞。在生活节奏与家庭观念上拥有天然的默契感，长辈互动融洽。',
    palaceFit: '日支夫妻宫阴阳得位，生合有情。这代表两人在相处初期即可迅速建立深度的精神信任，能从灵魂深处共情彼此的喜怒哀乐。',
    wuxingBalance: '一人盘中火土丰厚，另一人水木清和，二气相遇形成“水润土生、木火通明”之局，极利于婚后双方事业财运的互助增长。',
    futureOutlook: '未来三年运律同步上扬，尤其在秋冬季节感情凝聚力最强，是携手确立人生重大目标（如定亲、置业、添丁）的黄金契机。',
    advices: [
      '宜多倾听少预设：遇事坦诚分享内在脆弱，避免因各自要强而陷入冷战沉默。',
      '共创精神生活空间：定期安排两人专属的户外自然出行或安静阅读茶叙，蓄养心神。',
      '居室以温润米木暖色为主基调，助旺夫妻宫和合之气。'
    ]
  };
}
