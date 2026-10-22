'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import DailySignModal from '../components/DailySignModal';
import ConsultationModal from '../components/ConsultationModal';
import AuthModal from '../components/AuthModal';
import UserProfileModal from '../components/UserProfileModal';
import BaziForm from '../components/BaziForm';
import BaziDisplay from '../components/BaziDisplay';
import AiReportSection from '../components/AiReportSection';
import IChingSection from '../components/IChingSection';
import CalendarSection from '../components/CalendarSection';
import NamingSection from '../components/NamingSection';
import MarriageSection from '../components/MarriageSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import { BaziResult } from '../lib/bazi';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'bazi' | 'iching' | 'naming' | 'marriage' | 'calendar' | 'about'>('bazi');
  const [isDailySignOpen, setIsDailySignOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  
  // 用户系统状态
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [lingShiCount, setLingShiCount] = useState(88);

  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [isLoadingBazi, setIsLoadingBazi] = useState(false);
  const [baziSuccessTip, setBaziSuccessTip] = useState(false);

  // 初始化：从 localStorage 恢复用户并向服务端同步最新状态
  React.useEffect(() => {
    try {
      const savedToken = localStorage.getItem('tianjige_token');
      const savedUser = localStorage.getItem('tianjige_user');
      if (savedToken && savedUser) {
        const u = JSON.parse(savedUser);
        setUser(u);
        setToken(savedToken);
        setLingShiCount(u.lingShi || 88);

        // 向服务端获取最新数据
        fetch('http://localhost:3002/api/user/profile', {
          headers: { Authorization: `Bearer ${savedToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              setUser(data.data);
              setLingShiCount(data.data.lingShi);
              localStorage.setItem('tianjige_user', JSON.stringify(data.data));
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, []);

  const handleLoginSuccess = (newUser: any, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    setLingShiCount(newUser.lingShi);
    localStorage.setItem('tianjige_token', newToken);
    localStorage.setItem('tianjige_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setLingShiCount(88);
    localStorage.removeItem('tianjige_token');
    localStorage.removeItem('tianjige_user');
    setIsProfileOpen(false);
  };

  // 监听排盘结果更新，确保 DOM 挂载后平滑滚动
  React.useEffect(() => {
    if (baziResult) {
      const timer = setTimeout(() => {
        const el = document.getElementById('bazi-result-anchor');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [baziResult]);

  // 处理排盘推演
  const handleCalculateBazi = (result: BaziResult) => {
    setIsLoadingBazi(true);
    setTimeout(() => {
      setBaziResult(result);
      setIsLoadingBazi(false);
      setBaziSuccessTip(true);
      setTimeout(() => setBaziSuccessTip(false), 2500);
    }, 400);
  };

  const handleOpenReportFromDisplay = () => {
    const el = document.getElementById('ai-report-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddLingShi = async (amount: number) => {
    setLingShiCount(prev => prev + amount);
    if (user && token) {
      try {
        const res = await fetch('http://localhost:3002/api/user/recharge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ amount, price: Math.round(amount / 10) })
        });
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          localStorage.setItem('tianjige_user', JSON.stringify(data.data));
        }
      } catch (e) {}
    }
  };

  const handleDeductLingShi = (amount: number): boolean => {
    if (lingShiCount < amount) return false;
    setLingShiCount(prev => prev - amount);
    if (user && token) {
      fetch('http://localhost:3002/api/user/consume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setUser(data.data);
            localStorage.setItem('tianjige_user', JSON.stringify(data.data));
          }
        })
        .catch(() => {});
    }
    return true;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDailySign={() => setIsDailySignOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Hero 意境首屏 */}
      <section style={{
        position: 'relative',
        padding: '24px 20px 14px 20px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* 背景动态八卦罗盘微光 */}
        <div className="animate-spin-slow" style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.08)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid var(--border-gold)',
            padding: '5px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            color: 'var(--text-gold)',
            marginBottom: '12px',
            fontFamily: 'var(--font-serif)'
          }}>
            <span>✦</span> 易学数术典籍与天元大模型深度融合
          </div>

          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: '8px',
            color: '#fff',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.06em'
          }}>
            万物皆数 · <span className="text-gold-gradient">明心见性</span>
          </h1>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            「天机阁」承继《渊海子平》《滴天髓》《易经》千年智慧，以纯算法驱动专业推演与 AI 深度解惑，知命以立命。
          </p>
        </div>
      </section>

      {/* 主体交互区域 */}
      <main style={{ flex: 1, padding: '20px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* 八字模块 */}
        {activeTab === 'bazi' && (
          <div>
            <div id="bazi-form-anchor">
              <BaziForm onCalculate={handleCalculateBazi} isLoading={isLoadingBazi} />
            </div>

            {/* 八字结果呈现 */}
            {baziResult && (
              <div id="bazi-result-anchor">
                <BaziDisplay data={baziResult} onOpenReport={handleOpenReportFromDisplay} />
              </div>
            )}

            {/* AI 深度研报中心 */}
            <div id="ai-report-anchor">
              <AiReportSection
                baziData={baziResult}
                onOpenConsultation={() => setIsConsultationOpen(true)}
              />
            </div>
          </div>
        )}

        {/* 国学八字起名 */}
        {activeTab === 'naming' && <NamingSection />}

        {/* 三生姻缘合婚 */}
        {activeTab === 'marriage' && <MarriageSection />}

        {/* 周易六爻推演 */}
        {activeTab === 'iching' && <IChingSection />}

        {/* 干支万年历 */}
        {activeTab === 'calendar' && <CalendarSection />}

        {/* 宗旨与合规文化说明 */}
        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* 排盘成功轻量级提示 */}
      {baziSuccessTip && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--gold-gradient)',
          color: '#151003',
          padding: '10px 24px',
          borderRadius: 'var(--radius-full)',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 8px 30px rgba(212, 175, 55, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>☯</span> 命元既定，已为您推演呈现四柱命盘与五行气局！
        </div>
      )}

      {/* 弹窗组件 */}
      <DailySignModal isOpen={isDailySignOpen} onClose={() => setIsDailySignOpen(false)} />
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        token={token}
        onLogout={handleLogout}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* 底栏 */}
      <Footer />
    </div>
  );
}
