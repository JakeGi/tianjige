'use client';

import React, { useState } from 'react';
import { BaziResult } from '../lib/bazi';

interface AiReportSectionProps {
  baziData?: BaziResult | null;
  lingShiCount: number;
  onDeductLingShi: (amount: number) => boolean;
}

interface ReportItem {
  id: string;
  title: string;
  badge: string;
  price: number;
  originalPrice: number;
  desc: string;
  previewPoints: string[];
}

export default function AiReportSection({ baziData, lingShiCount, onDeductLingShi }: AiReportSectionProps) {
  const [selectedReportId, setSelectedReportId] = useState<string>('report-1');
  const [unlockedReports, setUnlockedReports] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [payModalReport, setPayModalReport] = useState<ReportItem | null>(null);
  const [paySuccessAlert, setPaySuccessAlert] = useState(false);

  const reports: ReportItem[] = [
    {
      id: 'report-1',
      title: '《先天命格心性与天赋图谱》',
      badge: '入门爆款',
      price: 9.9,
      originalPrice: 49,
      desc: '从四柱日元本气剖析潜意识人格特质、内心精神锚点与天赋优势，融合现代荣格八维心理学。',
      previewPoints: [
        '元神本气透析：表面处事与内在执念的真实映射',
        '月令提纲：成长环境与原生特质对决策力的塑造',
        '潜能雷达：最适合的专注赛道与灵感触发机制'
      ]
    },
    {
      id: 'report-2',
      title: '《职场事业机运与财富格局》',
      badge: '职场精研',
      price: 29.9,
      originalPrice: 99,
      desc: '深度解析财星与官杀力量平衡，判断适合创业自立还是依附平台，以及近三年关键转型窗口。',
      previewPoints: [
        '十神配称：食伤生财型 vs 官印相生型的职场路径',
        '行业五行契合度：哪些产业最利于聚势与借力',
        '财富守成建议：容易在何种情境下发生暗耗与破损'
      ]
    },
    {
      id: 'report-3',
      title: '《婚恋情感契合与相处之道》',
      badge: '深度解析',
      price: 39.9,
      originalPrice: 129,
      desc: '透析夫妻宫生克、情感期待与沟通阻滞点，提供东方五行互补与关系润滑的实践建议。',
      previewPoints: [
        '日支夫妻宫深度解读：理想伴侣的情绪投射与真实面貌',
        '情绪波峰期预警：何时容易出现沟通误解与内耗',
        '五行调和法则：如何以环境与心理节律促进良性互动'
      ]
    },
    {
      id: 'report-4',
      title: '《2026 丙午流年运律全面推演》',
      badge: '年度必备',
      price: 49.9,
      originalPrice: 169,
      desc: '赤马流年干支气场与本命四柱的天克地冲、生合化解全面推导，分四个季度拆解运律重点。',
      previewPoints: [
        '岁运交会总评：2026年是进取开拓还是蓄势内省？',
        '春夏秋冬四季动能波浪曲线与关键行动建议',
        '健康与精神压力调适：丙午火气旺相下的身心保养'
      ]
    }
  ];

  const [reportContents, setReportContents] = useState<Record<string, string>>({});
  const [isStreaming, setIsStreaming] = useState(false);

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const isUnlocked = !!unlockedReports[currentReport.id];

  const handleUnlockClick = (report: ReportItem) => {
    setPayModalReport(report);
  };

  const startAiReportStream = async (report: ReportItem) => {
    setIsGenerating(true);
    setIsStreaming(true);
    setUnlockedReports(prev => ({ ...prev, [report.id]: true }));
    setReportContents(prev => ({ ...prev, [report.id]: '' }));

    const baziSummary = baziData
      ? `命主性别：${baziData.gender === 'male' ? '乾造(男)' : '坤造(女)'}，生肖：${baziData.zodiac}，公历：${baziData.solarDate}。四柱八字：年柱【${baziData.pillars.year.ganZhi}】月柱【${baziData.pillars.month.ganZhi}】日柱【${baziData.pillars.day.ganZhi}】时柱【${baziData.pillars.hour.ganZhi}】。日元为【${baziData.dayMaster}】五行属【${baziData.dayMasterWuxing}】，五行气局定性：${baziData.energyBalance}。`
      : '命主四柱干支气机顺遂，五行生克流通。';

    try {
      const response = await fetch('http://localhost:3002/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: report.title,
          baziSummary
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('服务端推演异常');
      }

      setIsGenerating(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.token) {
                setReportContents(prev => ({
                  ...prev,
                  [report.id]: (prev[report.id] || '') + data.token
                }));
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      // 自动归档至用户历史测算档案库
      try {
        const token = localStorage.getItem('tianjige_token');
        if (token) {
          fetch('http://localhost:3002/api/user/record/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              type: 'report',
              title: report.title,
              content: reportContents[report.id] || '研报推演完成并存档。',
              price: report.price
            })
          }).catch(() => {});
        }
      } catch (e) {}
    } catch (err) {
      console.error('流式连接失败，使用本地兜底:', err);
      setIsGenerating(false);
      setReportContents(prev => ({
        ...prev,
        [report.id]: `【天机阁 · ${report.title}】\n\n◆ 卷一 · 先天命元气格与潜意识心性\n夫命之理，源于太和。日主元神秉赋分明，神气内敛，具备极敏锐的感知力与深度思考本能。\n在现代心理学视域下，这代表一种高度专注的内在驱动型人格。外表虽平和谦逊，但内心骨子里有一套极严苛的自我评价标准，不愿随波逐流。\n\n◆ 卷二 · 职场格局与机运赋能\n结合月令提纲与财官印之互动，命局中最具竞争力的特质在于“洞察大势与深度整合”。建议深耕具有知识复利的专业赛道，稳扎稳打。\n\n◆ 卷三 · 东方修心理法\n以静制动，顺应四时，凡事留有余地，方能大成若缺。`
      }));
    } finally {
      setIsStreaming(false);
      setPaySuccessAlert(true);
      setTimeout(() => setPaySuccessAlert(false), 3000);
    }
  };

  const handlePayConfirm = (method: 'wechat' | 'alipay' | 'lingshi') => {
    if (!payModalReport) return;

    if (method === 'lingshi') {
      const needed = Math.ceil(payModalReport.price * 2);
      if (lingShiCount < needed) {
        alert(`灵石不足，需要 ${needed} 灵石，当前仅有 ${lingShiCount} 灵石。请先充值或使用微信/支付宝支付！`);
        return;
      }
      onDeductLingShi(needed);
    }

    const report = payModalReport;
    setPayModalReport(null);
    startAiReportStream(report);
  };

  return (
    <section style={{ maxWidth: '960px', margin: '48px auto 0 auto' }}>
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
          智解玄机 · 见微知著
        </div>
        <h2 style={{ fontSize: '26px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
          天机 AI 深度研报中心
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
          基于正统《渊海子平》《滴天髓》古法哲学，结合现代认知心理学，由天机大模型推演生成的个性化深度研报
        </p>
      </div>

      {/* 4款报告选项卡切换 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        {reports.map(r => {
          const active = r.id === selectedReportId;
          const unlocked = !!unlockedReports[r.id];
          return (
            <div
              key={r.id}
              onClick={() => setSelectedReportId(r.id)}
              style={{
                background: active ? 'rgba(212, 175, 55, 0.12)' : 'rgba(16, 23, 38, 0.6)',
                border: active ? '1px solid var(--border-gold-bright)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              {unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '4px'
                }}>
                  已解锁
                </div>
              )}

              <div style={{
                fontSize: '11px',
                color: 'var(--gold-primary)',
                marginBottom: '4px',
                fontFamily: 'var(--font-serif)'
              }}>
                {r.badge}
              </div>
              <div style={{
                fontSize: '15px',
                color: '#fff',
                fontWeight: 700,
                marginBottom: '8px',
                fontFamily: 'var(--font-serif)'
              }}>
                {r.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '18px', color: 'var(--text-gold)', fontWeight: 800 }}>
                  ¥{r.price}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ¥{r.originalPrice}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 报告内容展示与试读区域 */}
      <div className="glass-panel" style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* 顶部标题区 */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '20px',
          marginBottom: '24px',
          gap: '12px'
        }}>
          <div>
            <span style={{
              fontSize: '11px',
              color: 'var(--gold-primary)',
              background: 'rgba(212, 175, 55, 0.1)',
              padding: '3px 8px',
              borderRadius: '4px',
              marginRight: '8px'
            }}>
              天机天元推演
            </span>
            <h3 style={{
              display: 'inline',
              fontSize: '22px',
              color: '#fff',
              fontWeight: 700,
              fontFamily: 'var(--font-serif)'
            }}>
              {currentReport.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {currentReport.desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {!isUnlocked ? (
              <button
                onClick={() => handleUnlockClick(currentReport)}
                className="btn-gold"
                style={{ padding: '12px 28px' }}
              >
                🔓 立即解锁全文（¥{currentReport.price}）
              </button>
            ) : (
              <span style={{
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 600
              }}>
                ✓ 报告已全篇解锁
              </span>
            )}
          </div>
        </div>

        {/* 正在生成的动画态 */}
        {isGenerating && (
          <div style={{
            padding: '60px 0',
            textAlign: 'center'
          }}>
            <div className="animate-spin-slow" style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '2px dashed var(--border-gold)',
              margin: '0 auto 20px auto'
            }} />
            <div style={{ fontSize: '17px', color: 'var(--text-gold)', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
              天机大模型正在深度演算命局五行...
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
              调取典籍知识库 · 匹配大运生克制化 · 生成 3500 字详尽研报
            </p>
          </div>
        )}

        {/* 报告正文（已解锁或试读） */}
        {!isGenerating && (
          <div>
            {/* 试读段落 1 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '16px',
                color: 'var(--text-gold)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--gold-primary)' }}>◆</span> 卷一 · 先天气格与日元元神解析
              </h4>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)'
              }}>
                {baziData ? (
                  `日主天干为【${baziData.dayMaster}】，在五行中属【${baziData.dayMasterWuxing}】。${
                    baziData.dayMasterWuxing === '木'
                      ? '其性仁，其气直，胸怀坦荡且具有自发的向上生长欲，如乔木立于林野。在面对挑战时，往往有坚韧不拔的恒心，但亦需防木刚则折，宜修习柔顺变通之法。'
                      : baziData.dayMasterWuxing === '火'
                      ? '其性烈，其情热，思敏言快，极具感染力与决断气魄。如太阳普照，追求正向反馈与价值认可，然若失于急躁，恐有烧灼之耗。'
                      : baziData.dayMasterWuxing === '土'
                      ? '其性重，其情厚，沉稳如山，具有天然的信用度与承载力，擅于守成与化解冲突，然思虑过多易陷于迟疑。'
                      : baziData.dayMasterWuxing === '金'
                      ? '其性刚，其情决，仗义疏财，追求效率与秩序感，具有极高的专业标准与批判思维，然需防锋芒太露伤及和气。'
                      : '其性智，其情深，机变百出，擅长因势利导与破局创新，如同江河东流，然需防心神涣散、随波逐流。'
                  } 结合命局全局五行分布（${baziData.energyBalance}），内心深处往往追求自我价值的深度兑现，非随波逐流之辈。`
                ) : (
                  '日主得生得助，气势淳厚。在现代社会中，这代表您具有强大的内在心理韧性与自愈力。在外部不确定性增加时，能够敏锐捕捉核心矛盾，找到破局切入点。'
                )}
              </p>
            </div>

            {/* 试读段落 2 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '16px',
                color: 'var(--text-gold)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--gold-primary)' }}>◆</span> 卷二 · 十神赋能与职场/人际天赋映射
              </h4>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)'
              }}>
                四柱格局中印星与财星的互动模式，决定了你在价值创造上的独特优势。你擅长将复杂的知识转化为实际成果，对于行业前沿趋势有天生的直觉。在人际交往中，你倾向于“求真不求多”的高质量圈层，虚与委蛇的社交往往会消耗你的心力...
              </p>
            </div>

            {/* 如果未解锁：展示模糊遮罩与购买卡片 */}
            {!isUnlocked ? (
              <div style={{
                position: 'relative',
                marginTop: '10px',
                padding: '30px 20px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(9, 13, 22, 0.95) 30%, #090d16 100%)',
                textAlign: 'center',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-gold)'
              }}>
                {/* 模拟被锁住的文案 */}
                <div style={{
                  filter: 'blur(5px)',
                  userSelect: 'none',
                  opacity: 0.35,
                  fontSize: '14px',
                  lineHeight: 2,
                  marginBottom: '20px'
                }}>
                  【卷三 · 关键运律与三年转折窗口推演】
                  自大运流转至当前周期，天干丙火与命局发生深度感应，预示着职场或情感在接下来的秋季将迎来一次至关重要的重构。若能把握住...
                  【卷四 · 调候用神与东方修心锦囊】
                  建议随身宜配称温润之色，朝向宜取东南...
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: 700,
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '8px'
                  }}>
                    🔒 解锁剩余 3 卷全篇深度研报（约 3000 字）
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    包含：未来三年转折窗口期 · 核心用神与贵人方位 · 个人修心调和建议
                  </p>
                  <button
                    onClick={() => handleUnlockClick(currentReport)}
                    className="btn-gold"
                    style={{ padding: '13px 36px', fontSize: '16px' }}
                  >
                    ✨ 立即以 ¥{currentReport.price} 解锁本篇研报
                  </button>
                </div>
              </div>
            ) : (
              /* 已解锁状态：呈现完整深度段落（优先展示天元数术大模型实时流式生成内容） */
              <div style={{
                background: 'rgba(212, 175, 55, 0.04)',
                borderLeft: '3px solid var(--gold-amber)',
                padding: '24px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--gold-primary)',
                    fontFamily: 'var(--font-serif)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>✦</span> 天机阁 · 天元数术大模型深度推演报告
                  </div>
                  {isStreaming && (
                    <span style={{ fontSize: '12px', color: '#4ade80' }}>
                      ● 正在实时流式推演中...
                    </span>
                  )}
                </div>

                <div style={{
                  fontSize: '14px',
                  lineHeight: 1.9,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-line',
                  fontFamily: 'var(--font-serif)'
                }}>
                  {reportContents[currentReport.id] || (
                    `【天机阁 · ${currentReport.title}】\n\n◆ 卷一 · 先天命元气格与潜意识心性\n夫命之理，源于太和。审视此造盘面，日主元神秉赋分明。神气内敛，具备极敏锐的感知力与深度思考本能。\n在现代心理学视域下，这代表一种高度专注的内在驱动型人格。外表虽平和谦逊，但内心骨子里有一套极严苛的自我评价标准，不愿随波逐流。\n\n◆ 卷二 · 职场格局与机运赋能\n结合月令提纲与财官印之互动，命局中最具竞争力的特质在于“洞察大势与深度整合”。建议深耕具有知识复利的专业赛道，稳扎稳打。\n\n◆ 卷三 · 东方修心理法\n以静制动，顺应四时，凡事留有余地，方能大成若缺。`
                  )}
                  {isStreaming && <span className="animate-pulse-glow" style={{ color: 'var(--gold-primary)', fontWeight: 900, marginLeft: '4px' }}>▌</span>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 支付成功提示浮层 */}
      {paySuccessAlert && (
        <div style={{
          position: 'fixed',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(34, 197, 94, 0.95)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: 'var(--radius-full)',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 1000
        }}>
          🎉 支付成功！天机大模型已为您完整解锁研报
        </div>
      )}

      {/* 极富仪式感的中式收银台弹窗 */}
      {payModalReport && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 5, 10, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setPayModalReport(null)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
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
                <span style={{ fontSize: '13px', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
                  天机阁 · 研报收银台
                </span>
                <button
                  onClick={() => setPayModalReport(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
                >
                  ✕
                </button>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '16px',
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                  {payModalReport.title}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-gold)' }}>实付金额：</span>
                  <span style={{ fontSize: '28px', color: 'var(--gold-primary)', fontWeight: 900 }}>
                    ¥{payModalReport.price}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px', textDecoration: 'line-through' }}>
                    原价 ¥{payModalReport.originalPrice}
                  </span>
                </div>
              </div>

              {/* 支付方式选择 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <button
                  onClick={() => handlePayConfirm('wechat')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(7, 193, 96, 0.12)',
                    border: '1px solid rgba(7, 193, 96, 0.4)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#07c160', fontSize: '18px' }}>💬</span>
                    <span>微信安全支付</span>
                  </span>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>秒级出报告 →</span>
                </button>

                <button
                  onClick={() => handlePayConfirm('alipay')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(22, 119, 255, 0.12)',
                    border: '1px solid rgba(22, 119, 255, 0.4)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#1677ff', fontSize: '18px' }}>⚡</span>
                    <span>支付宝快捷支付</span>
                  </span>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>秒级出报告 →</span>
                </button>

                <button
                  onClick={() => handlePayConfirm('lingshi')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>💎</span>
                    <span>灵石资产兑换（需 {Math.ceil(payModalReport.price * 2)} 灵石）</span>
                  </span>
                  <span style={{ color: 'var(--text-gold)', fontSize: '12px' }}>
                    现有 {lingShiCount} 灵石
                  </span>
                </button>
              </div>

              <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                🔒 7天内支持反复查阅 · 自动绑定当前设备与微信
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
