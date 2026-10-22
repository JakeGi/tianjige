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

export interface NamingRequest {
  surname: string;
  gender: 'male' | 'female';
  birthTime?: {
    year: number;
    month: number;
    day: number;
    hour: number;
  };
  nameLength: 'single' | 'double' | 'any';
  style: string; // 诗经楚辞、唐诗宋词、周易哲学、典雅高洁
  wishes?: string; // 期望寄托
}

export interface NameCandidate {
  name: string;
  fullName: string;
  pinyin: string;
  wuxing: string;
  score: number;
  origin: string; // 典故出处
  meaning: string; // 寓意深解
  baziFit: string; // 喜用神契合
}

const NAMING_SYSTEM_PROMPT = `你是「天机阁」权威国学姓名学大师。
你精研中国传统音韵学、三才五格、《说文解字》、古典诗词（诗经、楚辞、唐诗、宋词、易经）及八字五行调候学。
你的职责：
1. 依据用户的姓氏、性别、八字五行所缺和意向典籍风格，精选富有深厚文化底蕴、声调平仄押韵、朗朗上口、意蕴开阔的高分吉名。
2. 绝不使用低俗、生僻、带有歧义或凶煞偏旁的字。
3. 严格以 JSON 格式输出，不要包含任何 markdown 代码块外部的闲聊。
输出格式要求为严格的 JSON 数组：
[
  {
    "name": "名(不含姓)",
    "fullName": "姓名",
    "pinyin": "pīn yīn",
    "wuxing": "如：木水",
    "score": 98,
    "origin": "典故出处，如《诗经·小雅》：“如月之恒，如日之升。”",
    "meaning": "名字所承载的开阔气象与文人风骨解析",
    "baziFit": "五行补益分析，如：水木相生，润泽日元，补益命局喜用神"
  }
]`;

export async function generateNames(req: NamingRequest): Promise<{
  candidates: NameCandidate[];
  baziAnalysis: string;
}> {
  let baziSummary = '命造气局平和';
  if (req.birthTime) {
    try {
      const solar = Solar.fromYmdHms(
        req.birthTime.year,
        req.birthTime.month,
        req.birthTime.day,
        req.birthTime.hour,
        0,
        0
      );
      const lunar = solar.getLunar();
      const eightChar = lunar.getEightChar();
      baziSummary = `四柱八字为【${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${eightChar.getTime()}】，生肖【${lunar.getYearShengXiao()}】。五行纳音为【${eightChar.getYearNaYin()}】。日元为【${eightChar.getDayGan()}】。`;
    } catch (e) {
      // ignore
    }
  }

  const userPrompt = `【起名诉求】：
- 姓氏：${req.surname}
- 性别：${req.gender === 'male' ? '男孩' : '女孩'}
- 字数：${req.nameLength === 'single' ? '单字名' : req.nameLength === 'double' ? '双字名' : '双字为主'}
- 文化风格倾向：${req.style || '诗经楚辞与唐诗宋词'}
- 父母心愿与期望：${req.wishes || '品学兼优，心胸旷达，前程似锦'}
- 命局参数：${baziSummary}

请推荐 4 个极具东方风骨、平仄顺畅且符合五行调候的精选好名，严格按指定的 JSON 数组格式返回。`;

  if (openaiClient && apiKey && !apiKey.startsWith('your_')) {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: NAMING_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const raw = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : parsed.names || parsed.candidates || Object.values(parsed)[0];
      if (Array.isArray(list) && list.length > 0) {
        return {
          candidates: list,
          baziAnalysis: baziSummary
        };
      }
    } catch (err) {
      console.error('[起名大模型生成异常，切换本地智能辞库]:', err);
    }
  }

  // 本地国学辞库优质兜底方案
  return {
    candidates: getFallbackNames(req),
    baziAnalysis: baziSummary
  };
}

function getFallbackNames(req: NamingRequest): NameCandidate[] {
  const isBoy = req.gender === 'male';
  if (isBoy) {
    return [
      {
        name: '晏温',
        fullName: `${req.surname}晏温`,
        pinyin: 'yàn wēn',
        wuxing: '火土',
        score: 99,
        origin: '三国·曹植《七启》：“晞微景于榑桑，晏温风于回塘。”',
        meaning: '晏然温雅，春风拂面。寓意为人温润宽厚、心境开阔，能于从容不迫中成就大格局。',
        baziFit: '温润中和，调和全局燥湿之气，利于事业声望与贵人辅弼。'
      },
      {
        name: '墨川',
        fullName: `${req.surname}墨川`,
        pinyin: 'mò chuān',
        wuxing: '水木',
        score: 98,
        origin: '《周易》：“利涉大川，天地交泰。” 兼具翰墨书香与江海胸襟。',
        meaning: '胸罗万卷翰墨，胸怀广纳百川。象征学识渊博，志向高远，能在专业领域深耕立派。',
        baziFit: '水木相生，灵动通达，强化八字命局中的文昌星与创造力气象。'
      },
      {
        name: '凌霄',
        fullName: `${req.surname}凌霄`,
        pinyin: 'líng xiāo',
        wuxing: '水火',
        score: 97,
        origin: '唐·高适《同赋山斋》：“凌霄羽毛异，振翮上青冥。”',
        meaning: '凌云之志，扶摇直上。寓意气度轩昂，有开拓创新的豪迈魄力与非凡前程。',
        baziFit: '阳刚进取，振奋元神动能，补益官印之势。'
      },
      {
        name: '知白',
        fullName: `${req.surname}知白`,
        pinyin: 'zhī bái',
        wuxing: '金水',
        score: 96,
        origin: '《道德经》第二十八章：“知其白，守其黑，为天下式。”',
        meaning: '洞明世事而不染纤尘，大智若愚，克己守正，具有高维度的认知与长久定力。',
        baziFit: '金生水旺，清澈明理，强化直觉辨识力。'
      }
    ];
  } else {
    return [
      {
        name: '云舒',
        fullName: `${req.surname}云舒`,
        pinyin: 'yún shū',
        wuxing: '水金',
        score: 99,
        origin: '明·陈继儒《幽窗小记》：“去留无意，望天上云卷云舒。”',
        meaning: '云淡风轻，舒卷自如。寓意心境通透优雅，处变不惊，一生从容自适、福慧双全。',
        baziFit: '水润金明，五行气机流畅，增益日主灵秀之气与人缘贵气。'
      },
      {
        name: '清婉',
        fullName: `${req.surname}清婉`,
        pinyin: 'qīng wǎn',
        wuxing: '水木',
        score: 98,
        origin: '《诗经·郑风·野有蔓草》：“有美一人，清扬婉兮。”',
        meaning: '清丽脱俗，婉约温雅。展现东方女性知书达理、纯净高洁的气质与修养。',
        baziFit: '木秀于春，水以滋养，相生相融，五行调候吉祥。'
      },
      {
        name: '栖迟',
        fullName: `${req.surname}栖迟`,
        pinyin: 'qī chí',
        wuxing: '木水',
        score: 97,
        origin: '《诗经·陈风·衡门》：“衡门之下，可以栖迟。”',
        meaning: '栖心恬淡，知止而后有定。寓意懂得生活真意，不为外界虚浮所扰，一生安宁富足。',
        baziFit: '厚积薄发，生克有情，护佑心神安定、家宅和顺。'
      },
      {
        name: '望舒',
        fullName: `${req.surname}望舒`,
        pinyin: 'wàng shū',
        wuxing: '水金',
        score: 96,
        origin: '屈原《楚辞·离骚》：“前望舒使先驱兮，后飞廉使奔属。”（望舒为神话中为月亮驾车的神）',
        meaning: '朗月生辉，皎洁明亮。象征聪颖清雅、目光深远，如明月清辉般温暖耀眼。',
        baziFit: '金水相涵，秀气发越，助益学业与艺术鉴赏力。'
      }
    ];
  }
}
