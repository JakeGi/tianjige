import { Solar, Lunar } from 'lunar-javascript';

export interface BaziResult {
  solarDate: string;
  lunarDate: string;
  gender: 'male' | 'female';
  solarSign: string;
  zodiac: string;
  pillars: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo;
  };
  wuxingCounts: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dayMaster: string;
  dayMasterWuxing: string;
  energyBalance: string;
  naYinList: string[];
  daYunList: {
    startAge: number;
    startYear: number;
    ganZhi: string;
  }[];
}

export interface PillarInfo {
  name: string;
  gan: string;
  zhi: string;
  ganZhi: string;
  tenGod: string;
  hiddenGans: {
    gan: string;
    tenGod: string;
  }[];
  naYin: string;
  wuxing: string;
}

const GAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

const ZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0,
  gender: 'male' | 'female' = 'male'
): BaziResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  
  const yearGan = eightChar.getYearGan();
  const yearZhi = eightChar.getYearZhi();
  const monthGan = eightChar.getMonthGan();
  const monthZhi = eightChar.getMonthZhi();
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const timeGan = eightChar.getTimeGan();
  const timeZhi = eightChar.getTimeZhi();

  const getPillar = (
    name: string,
    gan: string,
    zhi: string,
    tenGod: string,
    hiddenGans: string[],
    hiddenTenGods: string[],
    naYin: string
  ): PillarInfo => ({
    name,
    gan,
    zhi,
    ganZhi: `${gan}${zhi}`,
    tenGod,
    hiddenGans: hiddenGans.map((g, idx) => ({
      gan: g,
      tenGod: hiddenTenGods[idx] || '比肩'
    })),
    naYin,
    wuxing: `${GAN_WUXING[gan] || ''}${ZHI_WUXING[zhi] || ''}`
  });

  const pillars = {
    year: getPillar(
      '年柱 (祖荫/根基)',
      yearGan,
      yearZhi,
      eightChar.getYearShiShenGan(),
      eightChar.getYearHideGan(),
      eightChar.getYearShiShenZhi(),
      eightChar.getYearNaYin()
    ),
    month: getPillar(
      '月柱 (事业/提纲)',
      monthGan,
      monthZhi,
      eightChar.getMonthShiShenGan(),
      eightChar.getMonthHideGan(),
      eightChar.getMonthShiShenZhi(),
      eightChar.getMonthNaYin()
    ),
    day: getPillar(
      '日柱 (元神/配偶)',
      dayGan,
      dayZhi,
      '日元 (元神)',
      eightChar.getDayHideGan(),
      eightChar.getDayShiShenZhi(),
      eightChar.getDayNaYin()
    ),
    hour: getPillar(
      '时柱 (归宿/晚景)',
      timeGan,
      timeZhi,
      eightChar.getTimeShiShenGan(),
      eightChar.getTimeHideGan(),
      eightChar.getTimeShiShenZhi(),
      eightChar.getTimeNaYin()
    )
  };

  const wuxingCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const allGans = [yearGan, monthGan, dayGan, timeGan];
  const allZhis = [yearZhi, monthZhi, dayZhi, timeZhi];

  const countWuxing = (wx: string, weight: number = 1) => {
    if (wx === '木') wuxingCounts.wood += weight;
    else if (wx === '火') wuxingCounts.fire += weight;
    else if (wx === '土') wuxingCounts.earth += weight;
    else if (wx === '金') wuxingCounts.metal += weight;
    else if (wx === '水') wuxingCounts.water += weight;
  };

  allGans.forEach(g => countWuxing(GAN_WUXING[g], 1.2));
  allZhis.forEach(z => countWuxing(ZHI_WUXING[z], 1.0));

  const yun = eightChar.getYun(gender === 'male' ? 1 : 0);
  const daYunArr = yun.getDaYun(10);
  const daYunList = daYunArr.slice(1, 9).map((dy: any) => ({
    startAge: dy.getStartAge(),
    startYear: dy.getStartYear(),
    ganZhi: dy.getGanZhi()
  }));

  const dayMaster = dayGan;
  const dayMasterWuxing = GAN_WUXING[dayMaster] || '木';

  const sameEnergy = (dayMasterWuxing === '木' ? wuxingCounts.wood + wuxingCounts.water :
                      dayMasterWuxing === '火' ? wuxingCounts.fire + wuxingCounts.wood :
                      dayMasterWuxing === '土' ? wuxingCounts.earth + wuxingCounts.fire :
                      dayMasterWuxing === '金' ? wuxingCounts.metal + wuxingCounts.earth :
                      wuxingCounts.water + wuxingCounts.metal);
  const energyBalance = sameEnergy >= 4.2 ? '日元得生得助，身旺中和' : '日元克泄耗多，身弱喜印比';

  return {
    solarDate: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${solar.getHour()}时${solar.getMinute()}分`,
    lunarDate: `${lunar.getYearInGanZhi()}年 农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${lunar.getTimeZhi()}时`,
    gender,
    solarSign: solar.getXingZuo() + '座',
    zodiac: lunar.getYearShengXiao(),
    pillars,
    wuxingCounts,
    dayMaster,
    dayMasterWuxing,
    energyBalance,
    naYinList: [
      eightChar.getYearNaYin(),
      eightChar.getMonthNaYin(),
      eightChar.getDayNaYin(),
      eightChar.getTimeNaYin()
    ],
    daYunList
  };
}
