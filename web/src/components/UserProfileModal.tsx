'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
  lingShi: number;
  isVip: boolean;
  vipExpireAt: string | null;
}

interface UserRecord {
  id: string;
  type: string;
  title: string;
  content: string;
  price: number;
  createdAt: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  token: string | null;
  onLogout: () => void;
  onOpenRecharge: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  token,
  onLogout,
  onOpenRecharge
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'records' | 'vip'>('records');
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<UserRecord | null>(null);

  useEffect(() => {
    if (isOpen && user && token) {
      fetchRecords();
    }
  }, [isOpen, user, token]);

  const fetchRecords = async () => {
    if (!token) return;
    setIsLoadingRecords(true);
    try {
      const res = await fetch('http://localhost:3002/api/user/records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRecords(data.data);
      }
    } catch (e) {
      console.error('获取历史记录失败:', e);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  if (!isOpen || !user) return null;

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
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'linear-gradient(180deg, #151d2f 0%, #0d121f 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ height: '4px', background: 'var(--gold-gradient)' }} />

        {/* 顶部个人名片 */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              border: '2px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              {user.avatar || '☯️'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                  {user.nickname}
                </span>
                {user.isVip ? (
                  <span style={{
                    fontSize: '11px',
                    background: 'var(--gold-gradient)',
                    color: '#1a1303',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 800
                  }}>
                    👑 至尊VIP会员
                  </span>
                ) : (
                  <span style={{
                    fontSize: '11px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-muted)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    普通道友
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                手机号：{user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                {user.isVip && ` · VIP到期日：${user.vipExpireAt}`}
              </div>
            </div>
          </div>

          {/* 灵石资产 */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid var(--border-gold)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>灵石结余</div>
            <div style={{ fontSize: '20px', color: 'var(--gold-primary)', fontWeight: 800 }}>
              {user.lingShi} <span style={{ fontSize: '12px', fontWeight: 400 }}>灵石</span>
            </div>
          </div>
        </div>

        {/* 导航标签 */}
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '0 28px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(9, 13, 22, 0.4)'
        }}>
          <button
            onClick={() => setActiveTab('records')}
            style={{
              padding: '14px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'records' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'records' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📜 我的测算研报档案 ({records.filter(r => r.type === 'report').length})
          </button>
          <button
            onClick={() => setActiveTab('vip')}
            style={{
              padding: '14px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'vip' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'vip' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            💎 灵石与 VIP 权益
          </button>
        </div>

        {/* 内容展示区 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }} className="no-scrollbar">
          {activeTab === 'records' ? (
            <div>
              {isLoadingRecords ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  正在调取云端档案库...
                </div>
              ) : records.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>📜</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>暂无测算研报记录</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    在排盘或起名后解锁研报，将自动永久保存在您的道友档案库中
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {records.map(rec => (
                    <div
                      key={rec.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedRecord(rec)}
                    >
                      <div>
                        <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>
                          {rec.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          归档时间：{new Date(rec.createdAt).toLocaleString()} · 终身永久可查
                        </div>
                      </div>

                      <button className="btn-outline-gold" style={{ padding: '6px 14px', fontSize: '12px' }}>
                        查阅长文 →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(12, 17, 28, 0.8) 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '16px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
                  👑 天机阁至尊研习会员特权
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <div>• 全年无限次推演四柱八字精微命盘</div>
                  <div>• 每月免费赠阅 2 份天元大模型 3500 字深度研报（价值 700 元）</div>
                  <div>• 获赠 2000 灵石，终生保修解盘档案</div>
                </div>
                <button
                  onClick={() => { onClose(); onOpenRecharge(); }}
                  className="btn-gold"
                  style={{ marginTop: '16px', padding: '10px 24px', fontSize: '14px' }}
                >
                  {user.isVip ? '续费至尊卡' : '立即开通至尊卡 (¥198/年)'}
                </button>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>灵石快捷充值</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      当前结余 {user.lingShi} 灵石
                    </div>
                  </div>
                  <button
                    onClick={() => { onClose(); onOpenRecharge(); }}
                    className="btn-outline-gold"
                    style={{ padding: '8px 18px', fontSize: '13px' }}
                  >
                    充值灵石 →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#f87171',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            退出当前账号
          </button>

          <button
            onClick={onClose}
            className="btn-outline-gold"
            style={{ padding: '8px 24px', fontSize: '13px' }}
          >
            关闭
          </button>
        </div>
      </div>

      {/* 历史研报阅读浮层 */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setSelectedRecord(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '80vh',
              background: '#0d121f',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '28px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '18px', color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                {selectedRecord.title}
              </h4>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{
              fontSize: '14px',
              lineHeight: 1.9,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-line',
              fontFamily: 'var(--font-serif)'
            }}>
              {selectedRecord.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
