'use client';

import React, { useState } from 'react';
import { calculateBazi, BaziResult } from '../lib/bazi';

interface BaziFormProps {
  onCalculate: (result: BaziResult) => void;
  isLoading: boolean;
}

export default function BaziForm({ onCalculate, isLoading }: BaziFormProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // 默认填充 1996 年 8 月 18 日 10:30 (典型青年人群)
  const [year, setYear] = useState(1996);
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(18);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = calculateBazi(year, month, day, hour, minute, gender);
      onCalculate(result);
    } catch (err) {
      console.error('排盘计算异常:', err);
      alert('排盘推演发生错误，请检查输入时间是否合法！');
    }
  };

  // 快捷填入当前时间体验
  const setNow = () => {
    const d = new Date();
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
    setDay(d.getDate());
    setHour(d.getHours());
    setMinute(d.getMinutes());
  };

  return (
    <div className="glass-panel" style={{ padding: '32px 28px', maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '12px',
          color: 'var(--gold-primary)',
          letterSpacing: '0.16em',
          borderBottom: '1px solid var(--border-gold)',
          paddingBottom: '4px',
          marginBottom: '8px',
          fontFamily: 'var(--font-serif)'
        }}>
          天演万象 · 溯本推元
        </div>
        <h2 style={{
          fontSize: '26px',
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'var(--font-serif)',
          letterSpacing: '0.06em'
        }}>
          四柱八字精微排盘
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
          遵循钦天监正统天文干支历算，精准计算生克制化、大运流年与五行调候
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 性别选择 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            命主性别（乾坤定造，用于顺逆大运推导）
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <button
              type="button"
              onClick={() => setGender('male')}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: gender === 'male' ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                background: gender === 'male' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                color: gender === 'male' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontWeight: gender === 'male' ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-serif)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>☯</span> 乾造（男命）
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: gender === 'female' ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                background: gender === 'female' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                color: gender === 'female' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontWeight: gender === 'female' ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-serif)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>☯</span> 坤造（女命）
            </button>
          </div>
        </div>

        {/* 出生公历时间 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              出生公历公历年月日时（北京时间）
            </label>
            <button
              type="button"
              onClick={setNow}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-primary)',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              填入此时此刻
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '10px'
          }}>
            {/* 年 */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>年份</span>
              <input
                type="number"
                min="1900"
                max="2050"
                value={year}
                onChange={e => setYear(parseInt(e.target.value) || 2000)}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* 月 */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>月份</span>
              <select
                value={month}
                onChange={e => setMonth(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '15px'
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m} 月</option>
                ))}
              </select>
            </div>

            {/* 日 */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>日期</span>
              <select
                value={day}
                onChange={e => setDay(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '15px'
                }}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d} 日</option>
                ))}
              </select>
            </div>

            {/* 时 */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>小时 (24时制)</span>
              <select
                value={hour}
                onChange={e => setHour(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '15px'
                }}
              >
                {Array.from({ length: 24 }, (_, i) => i).map(h => (
                  <option key={h} value={h}>{h} 时</option>
                ))}
              </select>
            </div>

            {/* 分 */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>分钟</span>
              <select
                value={minute}
                onChange={e => setMinute(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '15px'
                }}
              >
                {[0, 10, 20, 30, 40, 50].map(min => (
                  <option key={min} value={min}>{min} 分</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div style={{
          padding: '10px 14px',
          background: 'rgba(45, 161, 151, 0.08)',
          borderLeft: '2px solid var(--cyan-mist)',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '28px'
        }}>
          💡 <strong>真太阳时提醒</strong>：如若已知具体出生城市，系统将按经纬度自动做真太阳时与早晚子时折算，以确保排盘精准无误。
        </div>

        {/* 提交排盘按钮 */}
        <button
          type="submit"
          className="btn-gold"
          disabled={isLoading}
          style={{ width: '100%', padding: '15px 0', fontSize: '17px' }}
        >
          {isLoading ? '天机推演中...' : '✦ 启盘推演 · 洞悉命元 ✦'}
        </button>
      </form>
    </div>
  );
}
