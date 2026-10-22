'use client';

import React from 'react';
import { BaziResult, PillarInfo } from '../lib/bazi';

interface BaziDisplayProps {
  data: BaziResult;
  onOpenReport: () => void;
}

// 五行对应的美学色彩
const WUXING_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  '木': { bg: 'rgba(34, 197, 94, 0.12)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' },
  '火': { bg: 'rgba(239, 68, 68, 0.12)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
  '土': { bg: 'rgba(234, 179, 8, 0.12)', text: '#facc15', border: 'rgba(234, 179, 8, 0.3)' },
  '金': { bg: 'rgba(248, 250, 252, 0.15)', text: '#f1f5f9', border: 'rgba(248, 250, 252, 0.3)' },
  '水': { bg: 'rgba(56, 189, 248, 0.12)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
};

export default function BaziDisplay({ data, onOpenReport }: BaziDisplayProps) {
  const { pillars, wuxingCounts, dayMaster, dayMasterWuxing, energyBalance, daYunList } = data;

  const pillarList: PillarInfo[] = [pillars.year, pillars.month, pillars.day, pillars.hour];

  // 计算五行总分与百分比
  const totalWuxing = Object.values(wuxingCounts).reduce((a, b) => a + b, 0) || 1;
  const wuxingPercent = {
    木: Math.round((wuxingCounts.wood / totalWuxing) * 100),
    火: Math.round((wuxingCounts.fire / totalWuxing) * 100),
    土: Math.round((wuxingCounts.earth / totalWuxing) * 100),
    金: Math.round((wuxingCounts.metal / totalWuxing) * 100),
    水: Math.round((wuxingCounts.water / totalWuxing) * 100),
  };

  return (
    <div style={{ maxWidth: '960px', margin: '36px auto 0 auto' }}>
      {/* 命盘基本信息卡 */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '18px',
          marginBottom: '20px',
          gap: '12px'
        }}>
          <div>
            <span style={{
              background: data.gender === 'male' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(244, 114, 182, 0.15)',
              color: data.gender === 'male' ? '#38bdf8' : '#f472b6',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 700,
              marginRight: '10px'
            }}>
              {data.gender === 'male' ? '乾造 (男命)' : '坤造 (女命)'}
            </span>
            <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
              生肖属【{data.zodiac}】 · {data.solarSign}
            </span>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            阳历：{data.solarDate}
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-gold)', marginBottom: '24px' }}>
          农历八字源流：{data.lunarDate}
        </div>

        {/* 四柱排盘网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          textAlign: 'center',
          marginBottom: '28px'
        }}>
          {pillarList.map((p, idx) => (
            <div
              key={idx}
              className={`animate-fade-up ${idx === 2 ? 'animate-mystic-halo' : ''}`}
              style={{
                background: idx === 2 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(12, 17, 28, 0.7)',
                border: idx === 2 ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 8px',
                position: 'relative',
                animationDelay: `${idx * 0.12}s`
              }}
            >
              {idx === 2 && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--gold-gradient)',
                  color: '#1a1303',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 8px',
                  borderRadius: '10px'
                }}>
                  元神日主
                </div>
              )}

              {/* 柱名 */}
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {p.name.split(' ')[0]}
              </div>

              {/* 天干十神 */}
              <div style={{
                fontSize: '12px',
                color: idx === 2 ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                {p.tenGod}
              </div>

              {/* 天干 */}
              <div style={{
                fontSize: '32px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '6px'
              }}>
                {p.gan}
              </div>

              {/* 地支 */}
              <div style={{
                fontSize: '32px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 900,
                color: 'var(--text-gold)',
                lineHeight: 1.1,
                marginBottom: '12px'
              }}>
                {p.zhi}
              </div>

              {/* 纳音 */}
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '3px 0',
                borderRadius: '4px',
                marginBottom: '10px'
              }}>
                {p.naYin}
              </div>

              {/* 藏干与十神 */}
              <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '8px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>地支藏干</div>
                {p.hiddenGans.map((hg, hgIdx) => (
                  <div key={hgIdx} style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{hg.gan}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>{hg.tenGod}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 五行强弱分布能量条 */}
        <div style={{
          background: 'rgba(8, 12, 20, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
              五行气局分布（元神：{dayMaster}【{dayMasterWuxing}】）
            </span>
            <span style={{ fontSize: '13px', color: 'var(--gold-primary)', fontWeight: 600 }}>
              格局定性：{energyBalance}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            textAlign: 'center'
          }}>
            {(['木', '火', '土', '金', '水'] as const).map(wx => {
              const style = WUXING_COLOR[wx];
              const pct = wuxingPercent[wx];
              return (
                <div key={wx} style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 4px'
                }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: style.text, marginBottom: '2px' }}>
                    {wx}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {pct}%
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    marginTop: '6px',
                    overflow: 'hidden'
                  }}>
                    <div
                      className="animate-bar-grow"
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: style.text,
                        borderRadius: '2px',
                        transition: 'width 1s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 大运起步时间线 */}
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            大运流转（十年一运）
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px'
          }} className="no-scrollbar">
            {daYunList.map((dy, idx) => (
              <div key={idx} style={{
                flex: '0 0 auto',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 14px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-gold)', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                  {dy.ganZhi}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {dy.startAge}岁 ({dy.startYear}年)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 平滑过渡至研报中心提示 */}
      <div style={{
        marginTop: '28px',
        padding: '16px 20px',
        background: 'rgba(212, 175, 55, 0.05)',
        border: '1px dashed var(--border-gold)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--gold-primary)', fontSize: '16px' }}>✦</span>
          <span style={{ fontSize: '14px', color: 'var(--text-gold)', fontWeight: 600 }}>
            命盘已定 · 天元大模型已就绪
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            下方已为您推演就绪 4 卷个性化深度研报
          </span>
        </div>
        <button
          onClick={onOpenReport}
          className="btn-gold"
          style={{ padding: '8px 20px', fontSize: '13px' }}
        >
          查看 AI 深度研报 ↓
        </button>
      </div>
    </div>
  );
}
