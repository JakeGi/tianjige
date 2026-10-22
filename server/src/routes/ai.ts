import { Router, Request, Response } from 'express';
import { generateBaziReportStream } from '../services/deepseek.js';

const router = Router();

// 健康检查与模型状态
router.get('/health', (req: Request, res: Response) => {
  const hasKey = !!process.env.DEEPSEEK_API_KEY && !process.env.DEEPSEEK_API_KEY.startsWith('your_');
  res.json({
    status: 'ok',
    service: 'tianjige-tianyuan-engine',
    aiEngineReady: hasKey,
    version: '2.6.0',
    timestamp: new Date().toISOString()
  });
});

// SSE 流式生成 AI 深度研报
router.post('/report', async (req: Request, res: Response) => {
  const { reportType, baziSummary } = req.body;

  if (!reportType) {
    res.status(400).json({ error: '缺少 reportType 参数' });
    return;
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  try {
    await generateBaziReportStream(
      reportType,
      baziSummary || '命主四柱干支完备，五行流通平衡。',
      {
        onToken: (token: string) => {
          res.write(`data: ${JSON.stringify({ token })}\n\n`);
        },
        onComplete: () => {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        },
        onError: (err: any) => {
          res.write(`data: ${JSON.stringify({ error: err?.message || '推演异常' })}\n\n`);
          res.end();
        }
      }
    );
  } catch (err: any) {
    console.error('SSE Stream Error:', err);
    res.write(`data: ${JSON.stringify({ error: '服务端流式生成中断' })}\n\n`);
    res.end();
  }
});

// 国学起名接口
router.post('/naming', async (req: Request, res: Response) => {
  const { surname, gender, birthTime, nameLength, style, wishes } = req.body;

  if (!surname) {
    res.status(400).json({ error: '请提供姓氏' });
    return;
  }

  try {
    const { generateNames } = await import('../services/naming.js');
    const result = await generateNames({
      surname,
      gender: gender || 'male',
      birthTime,
      nameLength: nameLength || 'double',
      style: style || '诗经楚辞与唐诗宋词',
      wishes
    });
    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('起名接口异常:', err);
    res.status(500).json({ error: '起名推演失败，请稍后重试' });
  }
});

// 姻缘合婚与桃花推演接口
router.post('/marriage', async (req: Request, res: Response) => {
  const { mode, userA, userB } = req.body;

  if (!userA || !userA.name) {
    res.status(400).json({ error: '请提供生辰信息' });
    return;
  }

  try {
    const { calculateMarriageFit } = await import('../services/marriage.js');
    const result = await calculateMarriageFit({
      mode: mode || 'couple',
      userA,
      userB
    });
    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('姻缘接口异常:', err);
    res.status(500).json({ error: '姻缘推演失败，请稍后重试' });
  }
});

export default router;
