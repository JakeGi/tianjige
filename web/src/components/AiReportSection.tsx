'use client';

import React, { useState } from 'react';
import { BaziResult } from '../lib/bazi';

interface AiReportSectionProps {
  baziData?: BaziResult | null;
  onOpenConsultation: () => void;
}

interface ReportItem {
  id: string;
  title: string;
  badge: string;
  desc: string;
  previewPoints: string[];
}

export default function AiReportSection({ baziData, onOpenConsultation }: AiReportSectionProps) {
  const [selectedReportId, setSelectedReportId] = useState<string>('report-1');
  const [unlockedReports, setUnlockedReports] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContents, setReportContents] = useState<Record<string, string>>({});
  const [isStreaming, setIsStreaming] = useState(false);

  const reports: ReportItem[] = [
    {
      id: 'report-1',
      title: '《先天命格心性与天赋图谱》',
      badge: '全免费 · 心性本元',
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
      badge: '全免费 · 事业财帛',
      desc: '深度解析财星与官杀力量平衡，判断适合创业自立还是依附平台，以及关键转型窗口。',
      previewPoints: [
        '十神配称：食伤生财型 vs 官印相生型的职场路径',
        '行业五行契合度：哪些产业最利于聚势与借力',
        '财富守成建议：容易在何种情境下发生暗耗与破损'
      ]
    },
    {
      id: 'report-3',
      title: '《婚恋情感契合与相处之道》',
      badge: '全免费 · 三生正缘',
      desc: '考察夫妻宫位生克与异性星力量，透视亲密关系相处盲区与命中正缘磁场。',
      previewPoints: [
        '夫妻宫神煞：对亲密关系的潜意识期待与依恋类型',
        '正缘五行指引：什么样的伴侣气场最能互补与赋能',
        '情感修心锦囊：如何消弭冲突，成就和合之美'
      ]
    },
    {
      id: 'report-4',
      title: '《未来三年大运流年转折运筹》',
      badge: '全免费 · 流年运律',
      desc: '推演天干地支岁运与命局的刑冲破害，明晰顺势而为的时机节点与趋吉避凶要诀。',
      previewPoints: [
        '岁运天干互动：天时机运在何方，顺境与挑战',
        '地支动静：家庭、住址或职场变动之引动信号',
        '修心立命锦囊：顺势而为的东方处世智慧'
      ]
    }
  ];

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const isUnlocked = !!unlockedReports[currentReport.id];

  const handleGenerateClick = (report: ReportItem) => {
    startAiReportStream(report);
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
              price: 0
            })
          }).catch(() => {});
        }
      } catch (e) {}
    } catch (err) {
      console.error('流式连接失败，使用本地兜底:', err);
      setIsGenerating(false);
      setReportContents(prev => ({
        ...prev,
        [report.id]: `【天机阁 · ${report.title}】\n\n◆ 卷一 · 先天命元气格与潜意识心性\n夫命之理，源于太和。审视此造盘面，日主元神秉赋分明。神气内敛，具备极敏锐的感知力与深度思考本能。\n在现代心理学视域下，这代表一种高度专注的内在驱动型人格。外表虽平和谦逊，但内心骨子里有一套极严苛的自我评价标准，不愿随波逐流。\n\n◆ 卷二 · 职场格局与机运赋能\n结合月令提纲与财官印之互动，命局中最具竞争力的特质在于“洞察大势与深度整合”。建议深耕具有知识复利的专业赛道，稳扎稳打。\n\n◆ 卷三 · 东方修心理法\n以静制动，顺应四时，凡事留有余地，方能大成若缺。`
      }));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <section id="ai-report-anchor" style={{ maxWidth: '960px', margin: '48px auto 0 auto' }}>
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
          全平台免费开放 · 正统易学古籍与前沿大模型融合，一键生成 3000 字个性化全篇研报
        </p>
      </div>

      {/* 4款报告选项卡切换 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {reports.map(r => {
          const active = r.id === selectedReportId;
          const unlocked = unlockedReports[r.id];
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
                  已生成
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 700 }}>
                  ✦ 免费体验
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  约 3000 字
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
                onClick={() => handleGenerateClick(currentReport)}
                className="btn-gold"
                style={{ padding: '10px 24px', fontSize: '14px' }}
              >
                ✦ 免费生成本篇研报
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
                ✓ 报告已生成就绪
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
              调取典籍知识库 · 匹配大运生克制化 · 免费生成 3000 字详尽研报
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
                      ? '其性重，其情厚，沉稳宽容，具备极佳的包容力与承载力。为人信重笃实，喜安静守成，若能适时开拓变通，则格局更宏。'
                      : baziData.dayMasterWuxing === '金'
                      ? '其性刚，其情烈，果决明辨，富有审美品味与清肃之气。处事严谨有条理，是非分明，若过于苛求完满，易生孤高之虞。'
                      : '其性智，其情善，机变圆融，富有极高的悟性与流转适应力。思虑深邃，善于借力破局，唯需防心绪易起波澜，宜沉淀心志。'
                  }`
                ) : (
                  '请先在上方输入生辰八字启盘推演，天机大模型将为您匹配精准的日元元神解析。'
                )}
              </p>
            </div>

            {/* 未生成时展现的一键生成引导卡 */}
            {!isUnlocked ? (
              <div style={{
                position: 'relative',
                marginTop: '10px',
                padding: '36px 20px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(9, 13, 22, 0.95) 30%, #090d16 100%)',
                textAlign: 'center',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-gold)'
              }}>
                <div style={{
                  fontSize: '18px',
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)',
                  marginBottom: '8px'
                }}>
                  ✦ 免费生成剩余 3 卷全篇深度研报（约 3000 字）✦
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  包含：十神财官格局 · 关键转折窗口期 · 核心用神与相处修心建议
                </p>
                <button
                  onClick={() => handleGenerateClick(currentReport)}
                  className="btn-gold"
                  style={{ padding: '13px 40px', fontSize: '15px' }}
                >
                  ✨ 启奏天机 · 免费生成全篇深度研报
                </button>
              </div>
            ) : (
              /* 已生成状态：呈现完整深度段落 */
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
                    <span>✦</span> 天机阁 · 天元数术大模型深度推演报告（全免费）
                  </div>
                  {isStreaming && (
                    <span style={{ fontSize: '12px', color: 'var(--gold-primary)' }} className="animate-pulse-glow">
                      ● 大模型正在流式撰写...
                    </span>
                  )}
                </div>

                <div style={{
                  fontSize: '14px',
                  lineHeight: 2,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-line',
                  fontFamily: 'var(--font-serif)'
                }}>
                  {reportContents[currentReport.id] || (
                    `【天机阁 · ${currentReport.title}】\n\n◆ 卷一 · 先天命元气格与潜意识心性\n夫命之理，源于太和。审视此造盘面，日主元神秉赋分明。神气内敛，具备极敏锐的感知力与深度思考本能。\n在现代心理学视域下，这代表一种高度专注的内在驱动型人格。外表虽平和谦逊，但内心骨子里有一套极严苛的自我评价标准，不愿随波逐流。\n\n◆ 卷二 · 职场格局与机运赋能\n结合月令提纲与财官印之互动，命局中最具竞争力的特质在于“洞察大势与深度整合”。建议深耕具有知识复利的专业赛道，稳扎稳打。\n\n◆ 卷三 · 东方修心理法\n以静制动，顺应四时，凡事留有余地，方能大成若缺。`
                  )}
                  {isStreaming && <span className="animate-pulse-glow" style={{ color: 'var(--gold-primary)', fontWeight: 900, marginLeft: '4px' }}>▌</span>}
                </div>

                {/* 核心线下私域引流转化卡片 */}
                <div style={{
                  marginTop: '36px',
                  padding: '24px 28px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(18, 25, 42, 0.95) 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}>
                  <div>
                    <div style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      color: 'var(--gold-primary)',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginBottom: '6px'
                    }}>
                      ✦ 线下名家面对面 · 易道闭门详批
                    </div>
                    <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                      感念天机，更须名师指路
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '520px', lineHeight: 1.6 }}>
                      AI 算法长于常理推演，而原局生克机变仍需易学名家亲勘。诚邀莅临天机阁线下道场，煮茶论道，一对一深度指引。
                    </p>
                  </div>
                  <button
                    onClick={onOpenConsultation}
                    className="btn-gold"
                    style={{ padding: '12px 28px', fontSize: '14px', whiteSpace: 'nowrap' }}
                  >
                    🍵 预约名家线下详批 / 加微信
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
