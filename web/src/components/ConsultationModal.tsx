'use client';

import React, { useState } from 'react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [intent, setIntent] = useState('bazi');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText('TianjiGe2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
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
      zIndex: 1200,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          background: 'linear-gradient(180deg, #151d2f 0%, #0d121f 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
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

        <div style={{ padding: '28px', overflowY: 'auto' }} className="no-scrollbar">
          {/* 标头 */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-block',
              fontSize: '11px',
              color: 'var(--gold-primary)',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid var(--border-gold)',
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '8px'
            }}>
              ✦ 线下研学 · 易学名家亲授
            </div>
            <h3 style={{ fontSize: '22px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
              结缘天机阁 · 线下名家面对面详批
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.6 }}>
              线上 AI 算法析其常理，线下名家师承辨其机变。<br />
              诚邀莅临天机阁线下道场，煮茶论道，一对一深度指引。
            </p>
          </div>

          {/* 核心渠道一：添加私域微信 */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.06)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {/* 二维码示意卡片 */}
            <div style={{
              width: '110px',
              height: '110px',
              background: '#fff',
              borderRadius: 'var(--radius-sm)',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              margin: '0 auto'
            }}>
              {/* 二维码占位图：采用古典印章太极符文 */}
              <div style={{
                width: '100%',
                height: '100%',
                border: '2px dashed #997519',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#faf7ed',
                color: '#1a1303',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '26px' }}>☯️</span>
                <span style={{ fontSize: '10px', fontWeight: 800, marginTop: '2px' }}>微信扫码结缘</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '15px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                天机阁首席道长 · 私人微信
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.6 }}>
                微信专属客服在线接待，为您安排线下会面档期、道场地址指引与命盘纸本留档。
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: 'var(--text-gold)',
                  fontFamily: 'monospace'
                }}>
                  TianjiGe2026
                </span>
                <button
                  type="button"
                  onClick={handleCopyWeChat}
                  className="btn-gold"
                  style={{ padding: '4px 12px', fontSize: '12px' }}
                >
                  {copied ? '✓ 已复制微信号' : '一键复制微信号'}
                </button>
              </div>
            </div>
          </div>

          {/* 渠道二：线下会面预约表单 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '15px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)', marginBottom: '14px' }}>
              📝 登记预约线下详批会面
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <span style={{ fontSize: '32px' }}>🍵</span>
                <div style={{ fontSize: '16px', color: 'var(--gold-primary)', fontWeight: 700, marginTop: '8px', fontFamily: 'var(--font-serif)' }}>
                  已收到道友会面预约
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  堂主道长将在 24 小时内通过电话与微信联系您，确认品茗会面时辰与道场雅室。
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      您的称谓 / 姓名
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="如：张居士"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(9, 13, 22, 0.7)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '9px 12px',
                        color: '#fff',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      联系手机 / 微信
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="便于堂主确认档期"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(9, 13, 22, 0.7)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '9px 12px',
                        color: '#fff',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    线下探讨诉求意向
                  </label>
                  <select
                    value={intent}
                    onChange={e => setIntent(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(9, 13, 22, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '9px 12px',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  >
                    <option value="bazi">【命理详批】个人四柱深度推演与流年运筹</option>
                    <option value="career">【事业决策】企业合伙、重大转型与选址调理</option>
                    <option value="fengshui">【宅邸堪舆】居家办公环境五行气局调候</option>
                    <option value="marriage">【三生合盘】婚恋缔结、家庭调和与子女关照</option>
                    <option value="tea">【清谈品茗】国学易道交流与修心研学</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', padding: '11px 0', fontSize: '14px' }}
                >
                  提交预约 · 等候堂主联系
                </button>
              </form>
            )}
          </div>

          {/* 线下道场服务标准 */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>🍵 一客一室 · 煮茶静谈</span>
            <span>📜 纯手工手书朱砂命盘</span>
            <span>🛡️ 严格保护隐私保密</span>
          </div>
        </div>
      </div>
    </div>
  );
}
