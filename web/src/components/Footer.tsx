'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 15, 0.95)',
      padding: '48px 24px 32px 24px',
      marginTop: '80px',
      fontSize: '13px',
      color: 'var(--text-muted)'
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '36px'
        }}>
          {/* 品牌与使命 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--gold-primary)' }}>
                天机阁
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tianji Pavilion</span>
            </div>
            <p style={{ lineHeight: 1.8, fontSize: '12px', color: 'var(--text-secondary)' }}>
              专注于传承与弘扬中华优秀传统数术哲学，以现代前沿算法与东方易学典籍为基石，为当代人提供通透、理性的认知工具与情绪疗愈指引。
            </p>
          </div>

          {/* 快速导航 */}
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
              核心功能矩阵
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <span>• 四柱八字钦天监精微排盘</span>
              <span>• 诗经楚辞国学八字智能起名</span>
              <span>• 三生姻缘八字合婚与桃花推演</span>
              <span>• 周易六十四卦铜钱摇卦筮易</span>
              <span>• 传统天文干支日历与吉日日课</span>
            </div>
          </div>

          {/* 合规与免责声明 */}
          <div>
            <div style={{ color: '#f87171', fontWeight: 600, marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
              合规与免责声明
            </div>
            <p style={{ lineHeight: 1.8, fontSize: '11px', color: 'var(--text-muted)' }}>
              本站所有内容均基于中国古典哲学书籍、天文历法与现代统计学模型生成，仅供传统文化交流研习与个人心理启发参考。请倡导科学精神，反对任何封建迷信，切勿沉迷。
            </p>
          </div>
        </div>

        {/* 底部版权 */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '11px'
        }}>
          <div>
            © 2026 天机阁 (Tianji Pavilion) · 保留所有权利
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>京ICP备2026001888号-1</span>
            <span>网安备11010802033888号</span>
            <span>增值电信业务经营许可</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
