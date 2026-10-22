'use client';

import React, { useState } from 'react';
import { Solar } from 'lunar-javascript';

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const solar = Solar.fromDate(currentDate);
  const lunar = solar.getLunar();

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const yiList = lunar.getDayYi();
  const jiList = lunar.getDayJi();
  const chong = lunar.getDayChongDesc();
  const sha = lunar.getDaySha();
  const jieQi = lunar.getPrevJieQi().getName();

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '10px 0' }}>
      {/* 标题 */}
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
          顺天应时 · 敬授人时
        </div>
        <h2 style={{ fontSize: '26px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
          天机干支吉历 · 民俗日课
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
          遵循传统钦天监天文历算，洞悉每日干支气运、民俗宜忌与时空节律
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '36px 28px' }}>
        {/* 日期翻阅控制器 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '20px',
          marginBottom: '28px'
        }}>
          <button
            onClick={handlePrevDay}
            className="btn-outline-gold"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            ← 前一日
          </button>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-serif)' }}>
              {solar.getYear()} 年 {solar.getMonth()} 月 {solar.getDay()} 日
            </h3>
            <div style={{ fontSize: '14px', color: 'var(--text-gold)', marginTop: '4px' }}>
              农历【{lunar.getYearInGanZhi()}年】{lunar.getMonthInChinese()}月{lunar.getDayInChinese()} · 生肖【{lunar.getYearShengXiao()}】
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleToday}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              今日
            </button>
            <button
              onClick={handleNextDay}
              className="btn-outline-gold"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              后一日 →
            </button>
          </div>
        </div>

        {/* 核心干支与星宿三栏卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}>
          <div style={{
            background: 'rgba(12, 17, 28, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>日元干支</div>
            <div style={{ fontSize: '24px', color: 'var(--text-gold)', fontWeight: 800, margin: '6px 0', fontFamily: 'var(--font-serif)' }}>
              {lunar.getDayInGanZhi()} 日
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              纳音：{lunar.getDayNaYin()}
            </div>
          </div>

          <div style={{
            background: 'rgba(12, 17, 28, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>节气气场</div>
            <div style={{ fontSize: '24px', color: '#fff', fontWeight: 800, margin: '6px 0', fontFamily: 'var(--font-serif)' }}>
              {jieQi}节气
            </div>
            <div style={{ fontSize: '12px', color: 'var(--cyan-mist)' }}>
              顺四时以适寒暑
            </div>
          </div>

          <div style={{
            background: 'rgba(12, 17, 28, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>冲煞方位</div>
            <div style={{ fontSize: '20px', color: 'var(--cinnabar)', fontWeight: 700, margin: '8px 0', fontFamily: 'var(--font-serif)' }}>
              {chong}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              煞方：【{sha}】
            </div>
          </div>
        </div>

        {/* 传统宜忌对照板 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* 宜 */}
          <div style={{
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#4ade80',
              fontWeight: 700,
              marginBottom: '12px',
              fontFamily: 'var(--font-serif)'
            }}>
              <span style={{
                background: '#22c55e',
                color: '#07090f',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 900
              }}>
                宜
              </span>
              吉时嘉事
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {yiList.slice(0, 10).map((item: string, idx: number) => (
                <span key={idx} style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#86efac',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 忌 */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#f87171',
              fontWeight: 700,
              marginBottom: '12px',
              fontFamily: 'var(--font-serif)'
            }}>
              <span style={{
                background: '#ef4444',
                color: '#07090f',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 900
              }}>
                忌
              </span>
              诸事慎行
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {jiList.slice(0, 10).map((item: string, idx: number) => (
                <span key={idx} style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 传统四时修养寄语 */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.04)',
          borderLeft: '3px solid var(--gold-amber)',
          padding: '16px 20px',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '4px' }}>
            🌿 《黄帝内经》四时调神养心
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            日作夜息，顺承阴阳消长。宜保持意念恬淡虚无，避过刚急躁之气，以内守神明。
          </p>
        </div>
      </div>
    </div>
  );
}
