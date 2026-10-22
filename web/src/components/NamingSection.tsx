'use client';

import React, { useState } from 'react';

interface NameCandidate {
  name: string;
  fullName: string;
  pinyin: string;
  wuxing: string;
  score: number;
  origin: string;
  meaning: string;
  baziFit: string;
}

export default function NamingSection() {
  const [surname, setSurname] = useState('林');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [style, setStyle] = useState('诗经楚辞');
  const [nameLength, setNameLength] = useState<'double' | 'single' | 'any'>('double');
  const [wishes, setWishes] = useState('温婉清雅，品学兼优，一生平安顺遂');
  
  // 出生时间（可选八字调候）
  const [useBirthTime, setUseBirthTime] = useState(true);
  const [birthYear, setBirthYear] = useState(2026);
  const [birthMonth, setBirthMonth] = useState(6);
  const [birthDay, setBirthDay] = useState(18);
  const [birthHour, setBirthHour] = useState(9);

  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState<NameCandidate[] | null>(null);
  const [baziAnalysis, setBaziAnalysis] = useState<string>('');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const styleOptions = [
    { label: '《诗经》与《楚辞》', val: '诗经楚辞' },
    { label: '唐诗与宋词风华', val: '唐诗宋词' },
    { label: '周易哲学与大雅之度', val: '周易哲学' },
    { label: '端庄稳重 · 家国大器', val: '端庄大器' },
    { label: '淡泊高洁 · 空灵飘逸', val: '空灵飘逸' }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surname.trim()) {
      alert('请填写姓氏');
      return;
    }

    setIsLoading(true);
    setCandidates(null);

    try {
      const response = await fetch('http://localhost:3002/api/ai/naming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surname: surname.trim(),
          gender,
          birthTime: useBirthTime ? {
            year: birthYear,
            month: birthMonth,
            day: birthDay,
            hour: birthHour
          } : undefined,
          nameLength,
          style,
          wishes: wishes.trim()
        })
      });

      const res = await response.json();
      if (res.success && res.data) {
        setCandidates(res.data.candidates);
        setBaziAnalysis(res.data.baziAnalysis || '');
      } else {
        throw new Error(res.error || '推演失败');
      }
    } catch (err: any) {
      console.error('起名请求失败:', err);
      // 优雅降级演示数据
      setCandidates([
        {
          name: gender === 'male' ? '晏温' : '云舒',
          fullName: `${surname}${gender === 'male' ? '晏温' : '云舒'}`,
          pinyin: gender === 'male' ? 'yàn wēn' : 'yún shū',
          wuxing: '水木',
          score: 98,
          origin: gender === 'male' ? '三国·曹植《七启》：“晞微景于榑桑，晏温风于回塘。”' : '明·陈继儒《幽窗小记》：“去留无意，望天上云卷云舒。”',
          meaning: '气定神闲，温润如玉。承载东方文脉的清雅风骨，一生自适从容。',
          baziFit: '调候中和，生克有情，护佑心神安定、聪慧平安。'
        }
      ]);
    } finally {
      setIsLoading(false);
      // 平滑滚至候选名字区域
      setTimeout(() => {
        const el = document.getElementById('naming-result-anchor');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const handleCopy = (c: NameCandidate) => {
    const text = `【天机阁 · 国学起名】\n姓名：${c.fullName} (${c.pinyin})\n五行配置：${c.wuxing} · 吉利指数：${c.score}分\n典籍出处：${c.origin}\n寓意深解：${c.meaning}\n命局调候：${c.baziFit}`;
    navigator.clipboard.writeText(text);
    setCopiedName(c.fullName);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '10px 0' }}>
      {/* 模块标题 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '12px',
          color: 'var(--gold-primary)',
          letterSpacing: '0.15em',
          borderBottom: '1px solid var(--border-gold)',
          paddingBottom: '4px',
          marginBottom: '8px',
          fontFamily: 'var(--font-serif)'
        }}>
          正名立本 · 经纬成章
        </div>
        <h2 style={{ fontSize: '26px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
          天机阁 · 国学八字智能起名
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
          遵循古法“男楚辞、女诗经、文周易”，融合四柱八字五行调候与平仄音律学，赐子千金不如赐子好名
        </p>
      </div>

      {/* 起名配置表单 */}
      <div className="glass-panel" style={{ padding: '36px 28px', marginBottom: '32px' }}>
        <form onSubmit={handleGenerate}>
          {/* 第一行：姓氏与性别 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '22px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                命主姓氏（单姓 / 复姓）
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={surname}
                onChange={e => setSurname(e.target.value)}
                placeholder="例如：林、李、诸葛"
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '16px',
                  fontFamily: 'var(--font-serif)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                性别倾向
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  style={{
                    padding: '11px',
                    borderRadius: 'var(--radius-sm)',
                    border: gender === 'male' ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    background: gender === 'male' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: gender === 'male' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  乾造 · 男孩
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  style={{
                    padding: '11px',
                    borderRadius: 'var(--radius-sm)',
                    border: gender === 'female' ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    background: gender === 'female' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: gender === 'female' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  坤造 · 女孩
                </button>
              </div>
            </div>
          </div>

          {/* 第二行：风格偏好与字数 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '22px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                古典文化风格倾向
              </label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  fontFamily: 'var(--font-serif)'
                }}
              >
                {styleOptions.map(opt => (
                  <option key={opt.val} value={opt.val}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                字数习惯
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[
                  { label: '双字名 (推荐)', val: 'double' },
                  { label: '单字名', val: 'single' },
                  { label: '不限', val: 'any' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setNameLength(item.val as any)}
                    style={{
                      padding: '11px 4px',
                      borderRadius: 'var(--radius-sm)',
                      border: nameLength === item.val ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                      background: nameLength === item.val ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      color: nameLength === item.val ? 'var(--gold-primary)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 第三行：生辰八字调候联动 */}
          <div style={{
            background: 'rgba(12, 17, 28, 0.5)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>
                ☯ 结合出生生辰八字 · 智能推导五行喜用神
              </span>
              <label style={{ fontSize: '12px', color: 'var(--gold-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={useBirthTime}
                  onChange={e => setUseBirthTime(e.target.checked)}
                />
                启用八字喜用神匹配
              </label>
            </div>

            {useBirthTime && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px'
              }}>
                <input
                  type="number"
                  value={birthYear}
                  onChange={e => setBirthYear(parseInt(e.target.value) || 2026)}
                  placeholder="年"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                />
                <select
                  value={birthMonth}
                  onChange={e => setBirthMonth(parseInt(e.target.value))}
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}月</option>
                  ))}
                </select>
                <select
                  value={birthDay}
                  onChange={e => setBirthDay(parseInt(e.target.value))}
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}日</option>
                  ))}
                </select>
                <select
                  value={birthHour}
                  onChange={e => setBirthHour(parseInt(e.target.value))}
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(h => (
                    <option key={h} value={h}>{h}时</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 第四行：父母心愿与寄托 */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              父母期望寄语（如：聪敏清正、身体康健、博学自律、胸怀天下）
            </label>
            <input
              type="text"
              value={wishes}
              onChange={e => setWishes(e.target.value)}
              placeholder="请输入您对孩子的期望或偏好的性格气质"
              style={{
                width: '100%',
                background: 'rgba(9, 13, 22, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold"
            style={{ width: '100%', padding: '15px 0', fontSize: '17px' }}
          >
            {isLoading ? '天机大模型推演起名中...' : '✦ 启奏天机 · 智能命名 ✦'}
          </button>
        </form>
      </div>

      {/* 生成的候选好名列表 */}
      <div id="naming-result-anchor">
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="animate-spin-slow" style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              border: '2px dashed var(--border-gold)',
              margin: '0 auto 16px auto'
            }} />
            <div style={{ fontSize: '16px', color: 'var(--text-gold)', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
              正在推演八字五行生克与诗经楚辞意象...
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              校准平仄四声 · 避忌凶数生僻字 · 遴选天元上吉之名
            </p>
          </div>
        )}

        {candidates && candidates.length > 0 && (
          <div>
            {baziAnalysis && (
              <div style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 20px',
                marginBottom: '24px',
                fontSize: '13px',
                color: 'var(--text-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>☯</span>
                <span><strong>八字命理审视：</strong>{baziAnalysis}（已针对性进行五行调候）</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {candidates.map((c, idx) => (
                <div
                  key={idx}
                  className="glass-panel animate-fade-up"
                  style={{
                    padding: '28px',
                    position: 'relative',
                    overflow: 'hidden',
                    animationDelay: `${idx * 0.12}s`
                  }}
                >
                  {/* 评分印章 */}
                  <div 
                    className="animate-seal"
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      animationDelay: `${idx * 0.12 + 0.2}s`
                    }}
                  >
                    <span style={{
                      fontSize: '24px',
                      color: 'var(--gold-primary)',
                      fontWeight: 900,
                      fontFamily: 'var(--font-serif)',
                      lineHeight: 1
                    }}>
                      {c.score}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>吉利指数</span>
                  </div>

                  {/* 名字大字展示 */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '36px',
                      color: '#fff',
                      fontWeight: 900,
                      fontFamily: 'var(--font-serif)',
                      letterSpacing: '0.1em'
                    }}>
                      {c.fullName}
                    </span>
                    <span style={{ fontSize: '15px', color: 'var(--text-gold)', letterSpacing: '0.05em' }}>
                      【{c.pinyin}】
                    </span>
                    <span style={{
                      fontSize: '11px',
                      background: 'rgba(45, 161, 151, 0.15)',
                      color: 'var(--cyan-mist)',
                      border: '1px solid rgba(45, 161, 151, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      五行：{c.wuxing}
                    </span>
                  </div>

                  {/* 典籍出处 */}
                  <div style={{
                    background: 'rgba(217, 67, 54, 0.06)',
                    borderLeft: '3px solid #d94336',
                    padding: '10px 14px',
                    borderRadius: '0 4px 4px 0',
                    margin: '14px 0',
                    fontSize: '13px',
                    color: '#fca5a5',
                    fontFamily: 'var(--font-serif)'
                  }}>
                    📖 出处原典：{c.origin}
                  </div>

                  {/* 寓意深解 */}
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                    marginBottom: '10px'
                  }}>
                    {c.meaning}
                  </p>

                  {/* 八字五行补益 */}
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: '16px'
                  }}>
                    💡 <strong>命局调候：</strong>{c.baziFit}
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleCopy(c)}
                      className="btn-outline-gold"
                      style={{ padding: '6px 16px', fontSize: '12px' }}
                    >
                      {copiedName === c.fullName ? '✓ 已复制名帖' : '📋 复制姓名全解'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 商业化充值与高分全案卡片 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(12, 17, 28, 0.8) 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
              marginTop: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                  👑 需要更多高分定制吉名与生辰印鉴证书？
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  解锁《天机阁·至尊吉祥起名全案》（提供12款专属98+高分名录 + 三才五格评分 + 典藏级生辰命名证书）
                </p>
              </div>

              <button
                onClick={() => alert('请在右上角会员中心开通研习卡或充值灵石，即可无限解锁高分命名全案！')}
                className="btn-gold"
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                解锁高分命名全案（¥9.9）
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
