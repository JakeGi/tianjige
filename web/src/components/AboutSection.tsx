'use client';

import React from 'react';

export default function AboutSection() {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '10px 0' }}>
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
          道法自然 · 守正创新
        </div>
        <h2 style={{ fontSize: '26px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
          天机阁研习宗旨与文化渊源
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
          以现代数据算法承载传统智慧，做当代人安顿身心的东方哲学罗盘
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '36px 30px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>
            一、 平台缘起：古今交汇的东方智慧
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            《周易》有云：“知变化之道者，其知神之所为乎。” 中华数术历经数千年演化，其本质是中国古人对天道运行、四时节律与人类心理行为规律的深刻观察与朴素系统论。
            「天机阁」旨在剔除传统数术中附会的迷信色彩，以数字科技和人工智能为媒介，重现《易经》《滴天髓》《穷通宝鉴》等古籍的哲学精粹，为现代快节奏生活中的人们提供一处省察自我、洞察局势的心灵驻足地。
          </p>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>
            二、 科学理性与合规倡导
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            天机阁坚决恪守国家互联网法律法规，倡导积极、理性、崇尚科学的人生观。
            本平台所提供的一切干支推演、五行强弱分析及 AI 研报，均属于传统文化数理模型与现代认知心理学的对照研究成果，旨在辅助用户开阔思维视角、进行自我性格剖析与情绪疏解。我们坚决反对宿命论，坚信“命由己作，福自己求”，每个人始终是自身命运的第一责任人与塑造者。
          </p>
        </div>

        <div style={{
          background: 'rgba(212, 175, 55, 0.05)',
          border: '1px dashed var(--border-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '15px', color: 'var(--text-gold)', fontWeight: 700, fontFamily: 'var(--font-serif)', marginBottom: '6px' }}>
            “为天地立心，为生民立命，为往圣继绝学，为万世开太平。”
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            —— 北宋·张载《横渠四句》
          </div>
        </div>
      </div>
    </div>
  );
}
