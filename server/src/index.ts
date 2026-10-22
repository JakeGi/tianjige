import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRouter from './routes/ai.js';
import userRouter from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// 注册路由
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

// 根目录欢迎与探活
app.get('/', (req, res) => {
  res.json({
    name: '天机阁后端 API 服务 (Tianji Pavilion Server)',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/ai/health',
      reportStream: 'POST /api/ai/report'
    }
  });
});

app.listen(PORT, () => {
  console.log(`[天机阁服务端] 已成功启动在端口: http://localhost:${PORT}`);
  console.log(`[DeepSeek 对接状态] ${process.env.DEEPSEEK_API_KEY ? '已配置 API Key' : '未检测到 API Key，将采用智能流式推演引擎'}`);
});
