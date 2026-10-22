'use client';

import React, { useState } from 'react';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  lingShiCount: number;
  onAddLingShi: (amount: number) => void;
}

export default function VipModal({ isOpen, onClose, lingShiCount, onAddLingShi }: VipModalProps) {
  const [activeTab, setActiveTab] = useState<'lingshi' | 'vip'>('lingshi');
  const [successTip, setSuccessTip] = useState(false);

  if (!isOpen) return null;

  const packages = [
    { amount: 60, price: 6, bonus: '首充送10' },
    { amount: 300, price: 28, bonus: '赠送50灵石 (热门)' },
    { amount: 1000, price: 88, bonus: '赠送200灵石 (大成)' },
  ];

  const handleBuyLingShi = (pack: typeof packages[0]) => {
    onAddLingShi(pack.amount);
    setSuccessTip(true);
    setTimeout(() => {
      setSuccessTip(false);
      onClose();
    }, 1500);
  };

  const handleBuyVip = () => {
    onAddLingShi(2000);
    setSuccessTip(true);
    setTimeout(() => {
      setSuccessTip(false);
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 5, 10, 0.85)',
      backdropFilter: 'blur(12px)',
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
          maxWidth: '520px',
          background: 'linear-gradient(180deg, #151d2f 0%, #0d121f 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)',
          overflow: 'hidden'
        }}
      >
        <div style={{ height: '4px', background: 'var(--gold-gradient)' }} />

        <div style={{ padding: '28px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>💎</span>
              <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                天机阁 · 灵石与修习会员
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
            >
              ✕
            </button>
          </div>

          {/* 资产卡 */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>当前灵石结余</div>
              <div style={{ fontSize: '24px', color: 'var(--gold-primary)', fontWeight: 800 }}>
                {lingShiCount} <span style={{ fontSize: '14px', fontWeight: 400 }}>灵石</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              1元 = 10灵石 · 永不过期
            </div>
          </div>

          {/* 选项卡 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('lingshi')}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'var(--radius-sm)',
                border: activeTab === 'lingshi' ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                background: activeTab === 'lingshi' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                color: activeTab === 'lingshi' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              灵石加油包
            </button>
            <button
              onClick={() => setActiveTab('vip')}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'var(--radius-sm)',
                border: activeTab === 'vip' ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                background: activeTab === 'vip' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                color: activeTab === 'vip' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              👑 天机研习年卡
            </button>
          </div>

          {successTip && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid #4ade80',
              color: '#4ade80',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              ✓ 支付充值成功！灵石已入账
            </div>
          )}

          {activeTab === 'lingshi' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {packages.map((pack, idx) => (
                <div
                  key={idx}
                  onClick={() => handleBuyLingShi(pack)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '16px', color: '#fff', fontWeight: 700 }}>
                      {pack.amount} 灵石
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--gold-primary)', marginTop: '2px' }}>
                      {pack.bonus}
                    </div>
                  </div>

                  <button className="btn-gold" style={{ padding: '8px 20px', fontSize: '14px' }}>
                    ¥{pack.price} 充值
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'radial-gradient(circle at top, rgba(212, 175, 55, 0.15) 0%, rgba(12, 17, 28, 0.9) 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--gold-primary)', letterSpacing: '0.1em' }}>
                ✦ 尊享特权 · 研习无阻
              </div>
              <h4 style={{ fontSize: '20px', color: '#fff', fontWeight: 800, margin: '8px 0', fontFamily: 'var(--font-serif)' }}>
                天机阁 · 年度研习至尊卡
              </h4>
              <div style={{ fontSize: '28px', color: 'var(--gold-primary)', fontWeight: 900, marginBottom: '16px' }}>
                ¥198 <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}>/ 年</span>
              </div>

              <div style={{ textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '24px' }}>
                <div>✓ 全年无限次高精度四柱八字与紫微斗数排盘</div>
                <div>✓ 每月免费赠送 2 份天机 AI 深度全篇研报（价值超 700 元）</div>
                <div>✓ 解锁《渊海子平》《三命通会》《滴天髓》古籍原版白话研读</div>
                <div>✓ 赠送 2000 灵石，可用于 AI 交互问答推演</div>
              </div>

              <button
                onClick={handleBuyVip}
                className="btn-gold"
                style={{ width: '100%', padding: '13px 0', fontSize: '16px' }}
              >
                立即开通年度至尊卡
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
