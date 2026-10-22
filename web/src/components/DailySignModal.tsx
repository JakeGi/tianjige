'use client';

import React, { useState } from 'react';
import { Solar } from 'lunar-javascript';

interface DailySignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailySignModal({ isOpen, onClose }: DailySignModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const now = new Date();
  const solar = Solar.fromDate(now);
  const lunar = solar.getLunar();

  // 经典国学修身警句库
  const quotes = [
    { title: '天行刚健', origin: '《易经·乾卦》', text: '天行健，君子以自强不息。潜龙勿用，阳在下也；见龙在田，天下文明。' },
    { title: '地势厚载', origin: '《易经·坤卦》', text: '地势坤，君子以厚德载物。君子黄中通理，正位居体，美在其中，而畅于四支。' },
    { title: '水德润下', origin: '《道德经》第八章', text: '上善若水。水善利万物而不争，处众人之所恶，故几于道。居善地，心善渊，与善仁。' },
    { title: '知止不殆', origin: '《道德经》第四十四章', text: '甚爱必大费，多藏必厚亡。故知足不辱，知止不殆，可以长久。' },
    { title: '大成若缺', origin: '《道德经》第四十五章', text: '大成若缺，其用不弊。大盈若冲，其用不穷。大直若屈，大巧若拙，大辩若讷。' },
    { title: '慎终如始', origin: '《道德经》第六十四章', text: '合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下。慎终如始，则无败事。' },
  ];

  // 依据日期固定索引
  const dayIndex = (now.getDate() + now.getMonth() * 31) % quotes.length;
  const currentQuote = quotes[dayIndex];

  const handleCopy = () => {
    const shareText = `【天机阁 · 今日灵签】\n公历：${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日\n农历：${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}\n干支：${lunar.getDayInGanZhi()}日\n吉语：${currentQuote.title} · ${currentQuote.origin}\n「${currentQuote.text}」\n—— 洞烛幽微，观星鉴己。`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 5, 10, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(180deg, #151d2f 0%, #0d121f 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* 顶部中式纹理装饰条 */}
        <div style={{
          height: '6px',
          background: 'var(--gold-gradient)'
        }} />

        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        <div style={{ padding: '32px 28px' }}>
          {/* 抬头印章与日期 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--gold-primary)',
                letterSpacing: '0.15em',
                marginBottom: '4px',
                fontFamily: 'var(--font-serif)'
              }}>
                天机阁 · 每日灵签
              </div>
              <h3 style={{
                fontSize: '22px',
                color: '#fff',
                fontWeight: 700
              }}>
                {solar.getMonth()}月{solar.getDay()}日
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '10px' }}>
                  农历{lunar.getMonthInChinese()}月{lunar.getDayInChinese()}
                </span>
              </h3>
            </div>

            {/* 朱红小印章 */}
            <div style={{
              width: '46px',
              height: '46px',
              border: '2px solid #e04b40',
              borderRadius: '8px',
              color: '#e04b40',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontWeight: 900,
              fontSize: '13px',
              lineHeight: 1.1,
              padding: '2px',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(224, 75, 64, 0.3)'
            }}>
              天机<br/>印存
            </div>
          </div>

          {/* 干支五行气场 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            padding: '12px 16px',
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '28px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>岁次</div>
              <div style={{ fontSize: '14px', color: 'var(--text-gold)', fontWeight: 600 }}>{lunar.getYearInGanZhi()}年</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>月令</div>
              <div style={{ fontSize: '14px', color: 'var(--text-gold)', fontWeight: 600 }}>{lunar.getMonthInGanZhi()}月</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>日元</div>
              <div style={{ fontSize: '14px', color: 'var(--text-gold)', fontWeight: 600 }}>{lunar.getDayInGanZhi()}日</div>
            </div>
          </div>

          {/* 签语正文（宣纸水墨卡片） */}
          <div style={{
            background: 'rgba(240, 244, 248, 0.04)',
            borderLeft: '3px solid var(--gold-amber)',
            padding: '20px',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            marginBottom: '28px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--gold-primary)'
              }}>
                【{currentQuote.title}】
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {currentQuote.origin}
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em'
            }}>
              “{currentQuote.text}”
            </p>
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCopy}
              className="btn-gold"
              style={{ flex: 1, padding: '12px 0' }}
            >
              {copied ? '✓ 已复制签语至剪贴板' : '📋 复制签文分享'}
            </button>
            <button
              onClick={onClose}
              className="btn-outline-gold"
              style={{ padding: '12px 20px' }}
            >
              静悟存心
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
