'use client';

import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('8888');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendCode = () => {
    if (!phone || !/^1\d{10}$/.test(phone)) {
      setErrorMsg('请输入正确的11位手机号码');
      return;
    }
    setErrorMsg('');
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = async (targetPhone: string) => {
    if (!targetPhone || !/^1\d{10}$/.test(targetPhone)) {
      setErrorMsg('请输入正确的11位手机号码');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3002/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: targetPhone, code })
      });
      const data = await res.json();
      if (data.success && data.data) {
        onLoginSuccess(data.data.user, data.data.token);
        onClose();
      } else {
        throw new Error(data.error || '登录失败');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '网络连接异常，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 极速免密一键体验登入
  const handleQuickDemo = () => {
    const randomPhone = '138' + Math.floor(10000000 + Math.random() * 90000000);
    setPhone(randomPhone);
    handleLogin(randomPhone);
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
      zIndex: 1100,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(180deg, #151d2f 0%, #0d121f 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{ height: '4px', background: 'var(--gold-gradient)' }} />

        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ padding: '36px 30px' }}>
          {/* 头部 */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: '22px'
            }}>
              ☯
            </div>
            <h3 style={{ fontSize: '22px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
              天机道友 · 登录归阁
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              未注册手机号验证后自动创建账号 · 赠 88 初始开运灵石
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={e => { e.preventDefault(); handleLogin(phone); }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                手机号码
              </label>
              <input
                type="tel"
                maxLength={11}
                placeholder="请输入常用大陆手机号"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                短信验证码
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="请输入4位验证码"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(9, 13, 22, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '15px'
                  }}
                />
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0 16px',
                    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold"
              style={{ width: '100%', padding: '13px 0', fontSize: '16px', marginBottom: '14px' }}
            >
              {isLoading ? '道友正在归阁...' : '立即登录 / 注册'}
            </button>
          </form>

          {/* 快捷体验登录 */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={handleQuickDemo}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cyan-mist)',
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ⚡ 免输验证码 · 一键体验道友账号进入
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '24px' }}>
            登录即代表同意《天机阁服务条款》与《隐私政策》
          </div>
        </div>
      </div>
    </div>
  );
}
