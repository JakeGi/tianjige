'use client';

import React from 'react';

interface HeaderProps {
  activeTab: 'bazi' | 'iching' | 'naming' | 'marriage' | 'calendar' | 'about';
  setActiveTab: (tab: 'bazi' | 'iching' | 'naming' | 'marriage' | 'calendar' | 'about') => void;
  onOpenDailySign: () => void;
  onOpenVipModal: () => void;
  lingShiCount: number;
  user: any;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  onOpenDailySign,
  onOpenVipModal,
  lingShiCount,
  user,
  onOpenAuth,
  onOpenProfile
}: HeaderProps) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(7, 9, 15, 0.85)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* 品牌标识 */}
      <div 
        onClick={() => setActiveTab('bazi')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* 外圈微旋转虚线 */}
          <div className="animate-spin-slow" style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '50%',
            border: '1px dashed var(--border-gold)',
            pointerEvents: 'none'
          }} />
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 900,
            fontSize: '19px',
            color: 'var(--gold-primary)',
            textShadow: '0 0 10px rgba(212,175,55,0.5)'
          }}>
            閣
          </span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.08em'
            }}>
              天机阁
            </span>
            <span style={{
              fontSize: '10px',
              color: 'var(--gold-primary)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(212, 175, 55, 0.08)'
            }}>
              国学智解
            </span>
          </div>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em'
          }}>
            洞烛幽微 · 观星鉴己
          </p>
        </div>
      </div>

      {/* 模块核心导航 */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(20, 27, 44, 0.6)',
        padding: '4px 6px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('bazi')}
          style={{
            background: activeTab === 'bazi' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'bazi' ? '#120f04' : 'var(--text-secondary)',
            fontWeight: activeTab === 'bazi' ? 700 : 500,
            border: 'none',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          八字排盘
        </button>

        <button
          onClick={() => setActiveTab('naming')}
          style={{
            background: activeTab === 'naming' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'naming' ? '#120f04' : 'var(--text-secondary)',
            fontWeight: activeTab === 'naming' ? 700 : 500,
            border: 'none',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          国学起名
        </button>

        <button
          onClick={() => setActiveTab('marriage')}
          style={{
            background: activeTab === 'marriage' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'marriage' ? '#120f04' : 'var(--text-secondary)',
            fontWeight: activeTab === 'marriage' ? 700 : 500,
            border: 'none',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          三生姻缘
        </button>

        <button
          onClick={() => setActiveTab('iching')}
          style={{
            background: activeTab === 'iching' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'iching' ? '#120f04' : 'var(--text-secondary)',
            fontWeight: activeTab === 'iching' ? 700 : 500,
            border: 'none',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          周易筮卦
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          style={{
            background: activeTab === 'calendar' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'calendar' ? '#120f04' : 'var(--text-secondary)',
            fontWeight: activeTab === 'calendar' ? 700 : 500,
            border: 'none',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          万年吉历
        </button>
      </nav>

      {/* 右侧互动操作区 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* 每日天机日签 */}
        <button
          onClick={onOpenDailySign}
          style={{
            background: 'rgba(217, 67, 54, 0.12)',
            border: '1px solid rgba(217, 67, 54, 0.4)',
            color: '#f87171',
            padding: '7px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '14px' }}>📜</span>
          每日天机签
        </button>

        {/* 用户登录态 / 个人中心 */}
        {!user ? (
          <button
            onClick={onOpenAuth}
            className="btn-gold"
            style={{ padding: '7px 18px', fontSize: '13px' }}
          >
            ☯ 登录 / 注册
          </button>
        ) : (
          <div
            onClick={onOpenProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid var(--border-gold)',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '16px' }}>{user.avatar || '☯️'}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>
                  {user.nickname}
                </span>
                {user.isVip && (
                  <span style={{ fontSize: '9px', background: 'var(--gold-gradient)', color: '#100c02', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>
                    VIP
                  </span>
                )}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--gold-primary)' }}>
                💎 {user.lingShi} 灵石
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
