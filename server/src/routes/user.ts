import { Router, Request, Response } from 'express';
import {
  loginOrRegister,
  getUserById,
  rechargeLingShi,
  buyVip,
  deductLingShi,
  addRecord,
  getUserRecords
} from '../services/user.js';

const router = Router();

// 中间件：从请求头解析用户身份
function parseUserId(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.replace(/^Bearer\s+/i, '');
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    return userId || null;
  } catch (e) {
    return null;
  }
}

// 极速免密/短信登录或注册
router.post('/login', (req: Request, res: Response) => {
  const { phone, code } = req.body;
  if (!phone || !/^1\d{10}$/.test(phone)) {
    res.status(400).json({ error: '请输入正确的11位手机号码' });
    return;
  }

  // 极速体验模式：验证码任意4位或8888均通过
  const { user, token } = loginOrRegister(phone);
  res.json({
    success: true,
    data: { user, token }
  });
});

// 获取个人资料
router.get('/profile', (req: Request, res: Response) => {
  const userId = parseUserId(req) || (req.query.userId as string);
  if (!userId) {
    res.status(401).json({ error: '未登录或登录已失效' });
    return;
  }

  const user = getUserById(userId);
  if (!user) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }

  res.json({
    success: true,
    data: user
  });
});

// 充值灵石
router.post('/recharge', (req: Request, res: Response) => {
  const userId = parseUserId(req) || req.body.userId;
  const { amount, price } = req.body;

  if (!userId || !amount) {
    res.status(400).json({ error: '参数不完整' });
    return;
  }

  const updatedUser = rechargeLingShi(userId, Number(amount), Number(price) || 0);
  if (!updatedUser) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }

  res.json({
    success: true,
    data: updatedUser
  });
});

// 开通至尊会员卡
router.post('/vip', (req: Request, res: Response) => {
  const userId = parseUserId(req) || req.body.userId;
  if (!userId) {
    res.status(401).json({ error: '未登录' });
    return;
  }

  const updatedUser = buyVip(userId);
  if (!updatedUser) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }

  res.json({
    success: true,
    data: updatedUser
  });
});

// 消费灵石解锁
router.post('/consume', (req: Request, res: Response) => {
  const userId = parseUserId(req) || req.body.userId;
  const { amount, title } = req.body;

  if (!userId || !amount) {
    res.status(400).json({ error: '参数不完整' });
    return;
  }

  const ok = deductLingShi(userId, Number(amount));
  if (!ok) {
    res.status(400).json({ error: '灵石余额不足，请先充值' });
    return;
  }

  if (title) {
    addRecord({
      userId,
      type: 'report',
      title: `解锁研报：${title}`,
      content: `扣减 ${amount} 灵石`,
      price: 0
    });
  }

  const user = getUserById(userId);
  res.json({
    success: true,
    data: user
  });
});

// 存档用户已解锁的研报或起名结果
router.post('/record/save', (req: Request, res: Response) => {
  const userId = parseUserId(req) || req.body.userId;
  const { type, title, content, price } = req.body;

  if (!userId || !title || !content) {
    res.status(400).json({ error: '缺少关键参数' });
    return;
  }

  const record = addRecord({
    userId,
    type: type || 'report',
    title,
    content,
    price: Number(price) || 0
  });

  res.json({
    success: true,
    data: record
  });
});

// 获取用户已购/测算档案库
router.get('/records', (req: Request, res: Response) => {
  const userId = parseUserId(req) || (req.query.userId as string);
  if (!userId) {
    res.status(401).json({ error: '未登录' });
    return;
  }

  const records = getUserRecords(userId);
  res.json({
    success: true,
    data: records
  });
});

export default router;
