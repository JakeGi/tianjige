import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY || '';
const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const modelName = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

let openaiClient: OpenAI | null = null;
if (apiKey) {
  openaiClient = new OpenAI({
    apiKey,
    baseURL
  });
}

// 国学 System Prompt
const TIANJIGE_SYSTEM_PROMPT = `你是「天机阁」AI国学导师与易学心性推演大师。
你精研《渊海子平》《滴天髓》《穷通宝鉴》《三命通会》与《周易》。
你的职责：
1. 结合用户提供的出生四柱八字、日主元神、五行衰旺、藏干与大运，以典雅隽永、洞察深刻的中式文笔，结合现代认知心理学与职业发展学，给出严密而富含哲理的解析。
2. 语言风格：温润博雅，既有古籍引经据典的厚重感（如引用滴天髓、易经大象），又有现代生活/职场的落地可行性指引。
3. 严格遵循正向价值导向：破除宿命论与封建迷信，不恐吓用户，不妄断生死吉凶，强调“知命以立命，尽人事以合天道”，重在发掘个人先天潜能、心理优势与修心平衡之道。
4. 排版规范：使用清晰的章节结构（如【卷一·先天气格】、【卷二·格局赋能】、【卷三·机运转折】、【卷四·修心理法】），善用条理化分段。`;

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (err: any) => void;
}

export async function generateBaziReportStream(
  reportType: string,
  baziSummary: string,
  callbacks: StreamCallbacks
) {
  const prompt = `【推演需求】：生成一份深度分析研报，报告类别为：${reportType}。
【命主盘面参数】：
${baziSummary}

请遵循天机阁国学导师标准，为该盘面撰写一份详实透彻、文采斐然的个性化分析。`;

  // 如果配置了有效的 API KEY，调用真实 DeepSeek
  if (openaiClient && apiKey && !apiKey.startsWith('your_')) {
    try {
      const responseStream = await openaiClient.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: TIANJIGE_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 3000
      });

      for await (const chunk of responseStream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          callbacks.onToken(content);
        }
      }
      callbacks.onComplete();
      return;
    } catch (err: any) {
      console.error('[DeepSeek API 调用失败，切换为智能推演引擎]:', err?.message || err);
      // 降级到演示生成
    }
  }

  // 演示模式：采用高水准预置易学深度长文，分批流式输出模拟 AI 打字
  await simulateStreamGeneration(reportType, baziSummary, callbacks);
}

// 模拟流式生成
async function simulateStreamGeneration(
  reportType: string,
  baziSummary: string,
  callbacks: StreamCallbacks
) {
  const sampleText = `【天机阁 · ${reportType}】

◆ 卷一 · 先天命元气格与潜意识心性
夫命之理，源于太和。审视此造盘面，日主元神秉赋分明。${baziSummary.includes('木') ? '木气勃发，其性仁，其质端方，犹如乔木之凌云，心怀开阔而行事有恒。' : '五行流转之间，神气内敛，具备极敏锐的感知力与深度思考本能。'}
在现代心理学视域下，这代表一种高度专注的内在驱动型人格。外表虽平和谦逊，但内心骨子里有一套极严苛的自我评价标准，不愿随波逐流。面对不确定局势时，往往能先于常人嗅出危机与转机。

◆ 卷二 · 十神赋能与职场/财富发展机运
《滴天髓》云：“令各得其所，势顺其自然。”
观月令提纲与财官印之互动，命局中最具竞争力的特质在于“化繁为简的抽象整合能力”。
1. 赛道选择：宜深耕于具有长期知识复利、规则相对透明或注重专业深度的领域；
2. 借力思维：命带贵人星照拂，在重要抉择节点，多倾听年长智者或资深同行的客观复盘，切忌单打独斗陷入信息茧房；
3. 财富守成：正偏财有其节律，求财当如春种秋收，守住核心现金流，方可乘风而起。

◆ 卷三 · 岁运流转与关键转折窗口
十年大运正由积蓄之境步入开拓之象。在接下来的岁运周期中，天干气场交会，将迎来一次职场格局或人际生态的重大升级。
- 上半年：重在夯实根基，清理冗余债务与内耗关系，修整心神；
- 下半年：利于对外发声、确立专业品牌与承接关键项目，易得外部协同之力。

◆ 卷四 · 东方哲学修心指南与调候建议
老子曰：“知人者智，自知者明。胜人者有力，自胜者强。”
天机阁修心锦囊：
1. 居室案头宜常备绿植或温润石木，取水木相生之清气；
2. 每逢情绪波澜，闭目观息三分钟，使气沉丹田，万缘放下；
3. 凡事留三分余地，大智若拙，以清静心应万变境。`;

  const chunks = sampleText.split('');
  for (let i = 0; i < chunks.length; i += 3) {
    const chunk = chunks.slice(i, i + 3).join('');
    callbacks.onToken(chunk);
    await new Promise(r => setTimeout(r, 20));
  }
  callbacks.onComplete();
}
