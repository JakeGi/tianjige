'use client';

import React, { useState } from 'react';

interface MarriageResult {
  score: number;
  level: string;
  summary: string;
  zodiacFit: string;
  palaceFit: string;
  wuxingBalance: string;
  futureOutlook: string;
  advices: string[];
}

export default function MarriageSection() {
  const [mode, setMode] = useState<'couple' | 'single'>('couple');

  // 方一信息（默认乾造男方）
  const [nameA, setNameA] = useState('张长风');
  const [genderA, setGenderA] = useState<'male' | 'female'>('male');
  const [yearA, setYearA] = useState(1995);
  const [monthA, setMonthA] = useState(6);
  const [dayA, setDayA] = useState(12);
  const [hourA, setHourA] = useState(14);

  // 方二信息（默认坤造女方）
  const [nameB, setNameB] = useState('苏月晚');
  const [genderB, setGenderB] = useState<'male' | 'female'>('female');
  const [yearB, setYearB] = useState(1997);
  const [monthB, setMonthB] = useState(9);
  const [dayB, setDayB] = useState(20);
  const [hourB, setHourB] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MarriageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3002/api/ai/marriage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          userA: { name: nameA, gender: genderA, year: yearA, month: monthA, day: dayA, hour: hourA },
          userB: mode === 'couple' ? { name: nameB, gender: genderB, year: yearB, month: monthB, day: dayB, hour: hourB } : undefined
        })
      });

      const res = await response.json();
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        throw new Error(res.error || '推演异常');
      }
    } catch (err: any) {
      console.error('合婚请求异常:', err);
      // 本地兜底
      setResult({
        score: 92,
        level: '琴瑟和鸣 · 天作之合',
        summary: `${nameA} 与 ${mode === 'couple' ? nameB : '命中正缘'} 的八字气局在五行生克上展现出极高的互补性。二人一人沉稳厚重、长于谋划，另一人灵秀聪敏、擅于应变，犹如琴瑟和鸣，彼此能照见并弥补对方性格中的盲区。`,
        zodiacFit: '年支生肖互动默契，无刑冲相克，在生活观念与家庭操持上有天然共鸣。',
        palaceFit: '夫妻宫阴阳相和，生合有情。相处初期即可建立起深度的精神信任感。',
        wuxingBalance: '水润土生、木火通明，二气相遇形成循环互补之局，极利于共同积累家业。',
        futureOutlook: '未来三年岁运共振上扬，尤其在秋冬季节感情凝聚力最强，利于定亲安家。',
        advices: [
          '以柔克刚：遇分歧时坦诚分享内在想法，避免各自要强而陷入沉默。',
          '水火相济：定期安排两人专属的户外散步与茶叙，蓄养亲密感。',
          '共同成长：明确分工互相体谅，以包容之心滋养长久福泽。'
        ]
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        const el = document.getElementById('marriage-result-anchor');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `【天机阁 · 三生姻缘合婚谱】\n合盘对象：${nameA} ＆ ${mode === 'couple' ? nameB : '命定正缘'}\n契合定级：${result.level}（${result.score}分）\n姻缘综评：${result.summary}\n生肖契合：${result.zodiacFit}\n夫妻宫解：${result.palaceFit}\n五行互补：${result.wuxingBalance}\n相处锦囊：\n${result.advices.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '10px 0' }}>
      {/* 模块标题 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '12px',
          color: '#f472b6',
          letterSpacing: '0.15em',
          borderBottom: '1px solid rgba(244, 114, 182, 0.4)',
          paddingBottom: '4px',
          marginBottom: '8px',
          fontFamily: 'var(--font-serif)'
        }}>
          三生石畔 · 和璧隋珠
        </div>
        <h2 style={{ fontSize: '26px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
          天机阁 · 三生姻缘与八字合婚
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
          以正统易学夫妻宫生克、十神调候及现代亲密关系心理学，测算双人缘分深浅与良缘长久之道
        </p>
      </div>

      {/* 模式切换 */}
      <div style={{
        display: 'flex',
        maxWidth: '380px',
        margin: '0 auto 28px auto',
        background: 'rgba(20, 27, 44, 0.6)',
        padding: '5px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setMode('couple')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: mode === 'couple' ? 'var(--gold-gradient)' : 'transparent',
            color: mode === 'couple' ? '#140f03' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)'
          }}
        >
          ☯ 双人八字三生合婚
        </button>
        <button
          onClick={() => setMode('single')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: mode === 'single' ? 'var(--gold-gradient)' : 'transparent',
            color: mode === 'single' ? '#140f03' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)'
          }}
        >
          🌸 单人桃花与正缘推算
        </button>
      </div>

      {/* 输入表单 */}
      <div className="glass-panel" style={{ padding: '36px 28px', marginBottom: '32px' }}>
        <form onSubmit={handleSubmit}>
          {/* 方一信息卡 */}
          <div style={{
            background: 'rgba(12, 17, 28, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '14px', fontFamily: 'var(--font-serif)' }}>
              {mode === 'couple' ? '【男方 / 甲方命主生辰】' : '【个人生辰八字】'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>姓名/称谓</span>
                <input
                  type="text"
                  required
                  value={nameA}
                  onChange={e => setNameA(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '10px', color: '#fff' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>性别</span>
                <select
                  value={genderA}
                  onChange={e => setGenderA(e.target.value as any)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '10px', color: '#fff' }}
                >
                  <option value="male">乾造 (男)</option>
                  <option value="female">坤造 (女)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
              <input
                type="number"
                placeholder="年份"
                value={yearA}
                onChange={e => setYearA(parseInt(e.target.value) || 1995)}
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
              />
              <select
                value={monthA}
                onChange={e => setMonthA(parseInt(e.target.value))}
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
              <select
                value={dayA}
                onChange={e => setDayA(parseInt(e.target.value))}
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
              <select
                value={hourA}
                onChange={e => setHourA(parseInt(e.target.value))}
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
              >
                {Array.from({ length: 24 }, (_, i) => i).map(h => (
                  <option key={h} value={h}>{h}时</option>
                ))}
              </select>
            </div>
          </div>

          {/* 方二信息卡（双人合婚模式） */}
          {mode === 'couple' && (
            <div style={{
              background: 'rgba(12, 17, 28, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '14px', color: '#f472b6', fontWeight: 700, marginBottom: '14px', fontFamily: 'var(--font-serif)' }}>
                【女方 / 乙方命主生辰】
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>姓名/称谓</span>
                  <input
                    type="text"
                    required
                    value={nameB}
                    onChange={e => setNameB(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '10px', color: '#fff' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>性别</span>
                  <select
                    value={genderB}
                    onChange={e => setGenderB(e.target.value as any)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '10px', color: '#fff' }}
                  >
                    <option value="female">坤造 (女)</option>
                    <option value="male">乾造 (男)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="年份"
                  value={yearB}
                  onChange={e => setYearB(parseInt(e.target.value) || 1997)}
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                />
                <select
                  value={monthB}
                  onChange={e => setMonthB(parseInt(e.target.value))}
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}月</option>
                  ))}
                </select>
                <select
                  value={dayB}
                  onChange={e => setDayB(parseInt(e.target.value))}
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}日</option>
                  ))}
                </select>
                <select
                  value={hourB}
                  onChange={e => setHourB(parseInt(e.target.value))}
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(h => (
                    <option key={h} value={h}>{h}时</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold"
            style={{ width: '100%', padding: '15px 0', fontSize: '17px' }}
          >
            {isLoading ? '天机天元大模型合盘推演中...' : '✦ 启测三生姻缘 · 合盘推演 ✦'}
          </button>
        </form>
      </div>

      {/* 推演结果展示 */}
      <div id="marriage-result-anchor">
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="animate-spin-slow" style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              border: '2px dashed #f472b6',
              margin: '0 auto 16px auto'
            }} />
            <div style={{ fontSize: '16px', color: '#f472b6', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
              正在排演夫妻宫位、生肖刑冲与五行生克互补...
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              参酌《三命通会》与亲密关系心理原型 · 生成详尽合婚全案
            </p>
          </div>
        )}

        {result && (
          <div className="glass-panel animate-fade-up" style={{ padding: '36px 30px', position: 'relative' }}>
            {/* 顶部评分大章 */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '20px',
              marginBottom: '24px',
              gap: '16px'
            }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  color: '#f472b6',
                  background: 'rgba(244, 114, 182, 0.1)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginRight: '8px'
                }}>
                  天机和合合盘
                </span>
                <h3 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-serif)', marginTop: '6px' }}>
                  【{result.level}】
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-gold)', marginTop: '4px' }}>
                  推演对象：{nameA} ＆ {mode === 'couple' ? nameB : '命中正缘'}
                </div>
              </div>

              {/* 分数徽标 */}
              <div 
                className="animate-seal"
                style={{
                  textAlign: 'center',
                  background: 'radial-gradient(circle, rgba(244, 114, 182, 0.2) 0%, transparent 70%)',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(244, 114, 182, 0.3)'
                }}
              >
                <div style={{ fontSize: '36px', color: '#f472b6', fontWeight: 900, fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                  {result.score}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  和合天数指数
                </div>
              </div>
            </div>

            {/* 姻缘总评 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                📜 姻缘大局总论
              </div>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)'
              }}>
                {result.summary}
              </p>
            </div>

            {/* 三维度匹配卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'rgba(12, 17, 28, 0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}>
                <div style={{ fontSize: '13px', color: 'var(--text-gold)', fontWeight: 600, marginBottom: '6px' }}>
                  🐲 生肖年支气场互动
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {result.zodiacFit}
                </p>
              </div>

              <div style={{
                background: 'rgba(12, 17, 28, 0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}>
                <div style={{ fontSize: '13px', color: '#f472b6', fontWeight: 600, marginBottom: '6px' }}>
                  🏛 夫妻宫位阴阳生合
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {result.palaceFit}
                </p>
              </div>

              <div style={{
                background: 'rgba(12, 17, 28, 0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}>
                <div style={{ fontSize: '13px', color: 'var(--cyan-mist)', fontWeight: 600, marginBottom: '6px' }}>
                  ☯ 五行旺衰调候互补
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {result.wuxingBalance}
                </p>
              </div>
            </div>

            {/* 岁运走向 */}
            <div style={{
              background: 'rgba(212, 175, 55, 0.05)',
              borderLeft: '3px solid var(--gold-amber)',
              padding: '14px 18px',
              borderRadius: '0 4px 4px 0',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '4px' }}>
                ⏳ 岁运相处窗口与机运
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {result.futureOutlook}
              </p>
            </div>

            {/* 相处锦囊建议 */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>
                💡 和合长久相处修心理法
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.advices.map((adv, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '10px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    <span style={{ color: '#f472b6', fontWeight: 700 }}>•</span>
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCopy}
                className="btn-gold"
                style={{ flex: 1, padding: '12px 0' }}
              >
                {copied ? '✓ 已复制姻缘合婚谱' : '📋 复制姻缘谱全解'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
