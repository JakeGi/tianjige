'use client';

import React, { useState } from 'react';
import { Yao, tossCoins, interpretHexagram, HexagramDetail } from '../lib/iching';

export default function IChingSection() {
  const [yaos, setYaos] = useState<Yao[]>([]);
  const [isTossing, setIsTossing] = useState(false);
  const [result, setResult] = useState<{
    originalHexagram: HexagramDetail;
    transformedHexagram?: HexagramDetail;
    changingYaosCount: number;
  } | null>(null);

  const handleTossOnce = () => {
    if (yaos.length >= 6 || isTossing) return;

    setIsTossing(true);
    setTimeout(() => {
      const newYao = tossCoins();
      const updatedYaos = [...yaos, newYao];
      setYaos(updatedYaos);
      setIsTossing(false);

      if (updatedYaos.length === 6) {
        const hexResult = interpretHexagram(updatedYaos);
        setResult(hexResult);
      }
    }, 600);
  };

  const handleReset = () => {
    setYaos([]);
    setResult(null);
  };

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
          大衍之数 · 灵龟筮易
        </div>
        <h2 style={{ fontSize: '26px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
          周易六爻沉浸推演
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
          心诚则灵，存一念于心（事业、心绪或决断），依古法摇掷铜钱六次，演推六爻卦意
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '36px 28px' }}>
        {/* 未完成 6 爻时的摇卦交互 */}
        {yaos.length < 6 && (
          <div style={{ textAlign: 'center' }}>
            {/* 3枚铜钱展示 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {[1, 2, 3].map(coin => (
                <div
                  key={coin}
                  className={isTossing ? 'animate-coin-flip' : 'animate-float'}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #fce588 0%, #d4af37 55%, #7a5a0d 100%)',
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.45)',
                    position: 'relative',
                    animationDelay: isTossing ? `${coin * 0.08}s` : `${coin * 0.5}s`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* 中间方孔 */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: '#07090f',
                    border: '1.5px solid #d4af37'
                  }} />
                </div>
              ))}
            </div>

            <div style={{ fontSize: '15px', color: 'var(--text-gold)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
              {yaos.length === 0 ? '心凝一境，点击下方按键掷出初爻' : `已得第 ${yaos.length} 爻，还需掷 ${6 - yaos.length} 次`}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '28px' }}>
              古训：无事不占，不动不占。心怀静气，诚以感通。
            </div>

            <button
              onClick={handleTossOnce}
              disabled={isTossing}
              className="btn-gold"
              style={{ padding: '14px 40px', fontSize: '16px' }}
            >
              {isTossing ? '铜钱飞旋，感应卦象中...' : `🪙 默念所思 · 掷第 ${yaos.length + 1} 爻`}
            </button>
          </div>
        )}

        {/* 正在生成的爻象梯队（自下而上显示） */}
        <div style={{
          marginTop: '28px',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '10px',
          maxWidth: '360px',
          margin: '28px auto 0 auto'
        }}>
          {yaos.map((y, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px'
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][idx]}
              </span>

              {/* 爻形渲染：阳爻是一整根线，阴爻是断开的线 */}
              <div style={{ width: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {y.isYang ? (
                  <div style={{ width: '100%', height: '8px', background: 'var(--gold-primary)', borderRadius: '2px' }} />
                ) : (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '45%', height: '8px', background: 'var(--gold-primary)', borderRadius: '2px' }} />
                    <div style={{ width: '45%', height: '8px', background: 'var(--gold-primary)', borderRadius: '2px' }} />
                  </div>
                )}
              </div>

              <span style={{
                fontSize: '11px',
                color: y.isChanging ? 'var(--cinnabar)' : 'var(--text-secondary)',
                fontWeight: y.isChanging ? 700 : 400
              }}>
                {y.name}
              </span>
            </div>
          ))}
        </div>

        {/* 完成 6 爻后的完整解卦展示 */}
        {result && (
          <div style={{ marginTop: '36px', borderTop: '1px solid var(--border-gold)', paddingTop: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{
                fontSize: '11px',
                color: 'var(--gold-primary)',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)'
              }}>
                六爻既定 · 乾坤成象
              </span>
              <h3 style={{
                fontSize: '26px',
                color: '#fff',
                fontWeight: 700,
                marginTop: '10px',
                fontFamily: 'var(--font-serif)'
              }}>
                【{result.originalHexagram.name}】
                {result.transformedHexagram && (
                  <span style={{ color: 'var(--text-gold)', fontSize: '20px', marginLeft: '12px' }}>
                    之 【{result.transformedHexagram.name}】
                  </span>
                )}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                上卦：{result.originalHexagram.upperTrigram} · 下卦：{result.originalHexagram.lowerTrigram} （动爻数：{result.changingYaosCount}）
              </p>
            </div>

            {/* 卦辞与大象辞 */}
            <div style={{
              background: 'rgba(212, 175, 55, 0.05)',
              borderLeft: '3px solid var(--gold-amber)',
              padding: '20px',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '6px' }}>
                📜 《周易》本卦卦辞
              </div>
              <p style={{ fontSize: '15px', color: '#fff', fontFamily: 'var(--font-serif)', lineHeight: 1.7, marginBottom: '14px' }}>
                “{result.originalHexagram.guaci}”
              </p>

              <div style={{ fontSize: '13px', color: 'var(--cyan-mist)', fontWeight: 600, marginBottom: '6px' }}>
                🌌 《易经·象传》大象辞
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', lineHeight: 1.7 }}>
                “{result.originalHexagram.xiangci}”
              </p>
            </div>

            {/* 现代启示 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              marginBottom: '28px'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-gold)', fontWeight: 600, marginBottom: '8px' }}>
                💡 天机智解 · 现代生活与决断启迪
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {result.originalHexagram.modernInsight}
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleReset}
                className="btn-outline-gold"
                style={{ padding: '10px 30px' }}
              >
                🔄 重新起卦推演
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
