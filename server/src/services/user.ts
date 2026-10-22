import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
  lingShi: number;
  isVip: boolean;
  vipExpireAt: string | null;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  userId: string;
  type: 'report' | 'naming' | 'marriage' | 'recharge' | 'vip';
  title: string;
  content: string;
  price: number;
  createdAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');

// 确保数据目录与文件存在
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(RECORDS_FILE)) {
    fs.writeFileSync(RECORDS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readUsers(): User[] {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveUsers(users: User[]) {
  ensureDataFiles();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function readRecords(): UserRecord[] {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(RECORDS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveRecords(records: UserRecord[]) {
  ensureDataFiles();
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// 手机号极速登录/注册
export function loginOrRegister(phone: string): { user: User; token: string } {
  const users = readUsers();
  let user = users.find(u => u.phone === phone);

  if (!user) {
    // 首次登录静默自动注册，赠送新人开运灵石 88
    const id = 'usr_' + Date.now() + Math.random().toString(36).slice(2, 6);
    user = {
      id,
      phone,
      nickname: `天机道友_${phone.slice(-4)}`,
      avatar: '☯️',
      lingShi: 88, // 初始赠送灵石
      isVip: false,
      vipExpireAt: null,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);

    // 记录新手赠送
    addRecord({
      userId: id,
      type: 'recharge',
      title: '天机阁新人结缘礼',
      content: '赠送初始推演灵石 88 枚',
      price: 0
    });
  }

  // 简易 Token：userId 结合时间戳编码
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  return { user, token };
}

// 获取用户最新画像
export function getUserById(userId: string): User | null {
  const users = readUsers();
  return users.find(u => u.id === userId) || null;
}

// 充值灵石
export function rechargeLingShi(userId: string, amount: number, price: number): User | null {
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return null;

  user.lingShi += amount;
  saveUsers(users);

  addRecord({
    userId,
    type: 'recharge',
    title: `灵石加油包充值 (${amount} 灵石)`,
    content: `成功充值 ${amount} 灵石，实付 ¥${price}`,
    price
  });

  return user;
}

// 开通/续费年度研习 VIP
export function buyVip(userId: string): User | null {
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return null;

  user.isVip = true;
  user.lingShi += 2000; // 年卡额外赠送 2000 灵石
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  user.vipExpireAt = nextYear.toISOString().split('T')[0];
  saveUsers(users);

  addRecord({
    userId,
    type: 'vip',
    title: '开通天机阁·年度至尊研习卡',
    content: `尊享一年无限次排盘与专属古籍库，加赠 2000 灵石，到期日：${user.vipExpireAt}`,
    price: 198
  });

  return user;
}

// 扣减灵石消费
export function deductLingShi(userId: string, amount: number): boolean {
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  if (!user || user.lingShi < amount) return false;

  user.lingShi -= amount;
  saveUsers(users);
  return true;
}

// 存档用户已解锁的研报或起名记录
export function addRecord(data: Omit<UserRecord, 'id' | 'createdAt'>): UserRecord {
  const records = readRecords();
  const newRecord: UserRecord = {
    ...data,
    id: 'rec_' + Date.now() + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString()
  };
  records.unshift(newRecord);
  saveRecords(records);
  return newRecord;
}

// 查询用户全部历史记录
export function getUserRecords(userId: string): UserRecord[] {
  const records = readRecords();
  return records.filter(r => r.userId === userId);
}
