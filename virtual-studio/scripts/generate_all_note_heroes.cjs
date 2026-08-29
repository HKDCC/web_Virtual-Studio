const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const notesMap = [
  {
    id: "3cb4b57f-e15a-81a3-9c33-e0f64c9837f3",
    title: "【读书笔记】Four Thousand Weeks_四千周",
    html: "four-thousand-weeks-四千周-glm-5.3-flash.html"
  },
  {
    id: "3cb4b57f-e15a-8125-bd03-fb48082bee96",
    title: "【读书笔记】Show Your Work!_展现你的作品！",
    html: "show-your-work-展现你的作品-glm-5.3-flash.html"
  },
  {
    id: "3cb4b57f-e15a-810d-b368-e2f729f90697",
    title: "【读书笔记】Getting to Yes_谈判力",
    html: "getting-to-yes-谈判力-glm-5.3.html"
  },
  {
    id: "3cb4b57f-e15a-81f0-8d1e-f97ec7578661",
    title: "【读书笔记】Building a Second Brain_打造第二大脑",
    html: "【读书笔记】Building a Second Brain_打造第二大脑_GLM 5.3 Flash.html"
  },
  {
    id: "3cb4b57f-e15a-81a9-89fc-e4bf30fdbf1a",
    title: "【读书笔记】Atomic Habits_原子习惯",
    html: "【读书笔记】Atomic Habits_原子习惯_GLM 5.3 Flash.html"
  },
  {
    id: "3cb4b57f-e15a-81be-b521-cad89e87130e",
    title: "【读书笔记】Your Money or Your Life_要钱还是要生活",
    html: "your-money-or-your-life-要钱还是要生活-ox-alpha.html"
  },
  {
    id: "3cb4b57f-e15a-81ec-a536-e96744667d41",
    title: "【读书笔记】Thinking, Fast and Slow_思考，快与慢",
    html: "thinking-fast-and-slow-思考快与慢-glm-5.2.html"
  },
  {
    id: "3cb4b57f-e15a-8145-9eb6-deb3acf86562",
    title: "【读书笔记】Thinking in Systems_系统之美",
    html: "thinking-in-systems-系统之美-glm-5.2.html"
  },
  {
    id: "3cb4b57f-e15a-8120-8d29-d5e7e708e76a",
    title: "【读书笔记】The Psychology of Money_金钱心理学",
    html: "the-psychology-of-money-金钱心理学-ox-alpha.html"
  },
  {
    id: "3cb4b57f-e15a-8177-89eb-c5f438c1b090",
    title: "【读书笔记】The Millionaire Fastlane_百万富翁快车道",
    html: "the-millionaire-fastlane-百万富翁快车道-mimo-v2-pro.html"
  },
  {
    id: "3cb4b57f-e15a-8107-b41c-e2a8fd5822bc",
    title: "【读书笔记】The Lean Startup_精益创业",
    html: "the-lean-startup-精益创业-glm-5.2.html"
  },
  {
    id: "3cb4b57f-e15a-8144-acbf-c78b0650afbb",
    title: "【读书笔记】The Intelligent Investor_聪明的投资者",
    html: "the-intelligent-investor-聪明的投资者-mimo-v2-pro.html"
  },
  {
    id: "3cb4b57f-e15a-8186-b718-db4104dde8da",
    title: "【读书笔记】The Art and Business of Online Writing_在线写作的艺术与商业",
    html: "the-art-and-business-of-online-writing-在线写作的艺术与商业-minimax-m2.7.html"
  },
  {
    id: "3cb4b57f-e15a-8157-a824-f9a2c3a49c1d",
    title: "【读书笔记】The Almanack of Naval Ravikant_纳瓦尔宝典",
    html: "the-almanack-of-naval-ravikant-纳瓦尔宝典-claude-sonnet-4.6-thinking.html"
  },
  {
    id: "3cb4b57f-e15a-8146-9fa2-c42f91a20af0",
    title: "【读书笔记】Principles of Microeconomics_微观经济学原理",
    html: "principles-of-microeconomics-微观经济学原理-claude-sonnet-4.6-thinking.html"
  },
  {
    id: "3cb4b57f-e15a-811b-baf4-c89092ffc8ca",
    title: "【读书笔记】Principles of Marketing_科特勒营销原理",
    html: "principles-of-marketing-市场营销原理-glm-5.2.html"
  },
  {
    id: "3cb4b57f-e15a-8139-bf85-eb4c64cb2756",
    title: "【读书笔记】Positioning The Battle for Your Mind_定位：争夺用户心智的战争",
    html: "【读书笔记】Positioning The Battle for Your Mind_定位：争夺用户心智的战争_GLM 5.2.html"
  },
  {
    id: "3cb4b57f-e15a-81b0-9d19-c1ba4f743615",
    title: "【读书笔记】Ogilvy on Advertising_奥格威谈广告",
    html: "【读书笔记】Ogilvy on Advertising_奥格威谈广告_GLM 5.2.html"
  },
  {
    id: "3cb4b57f-e15a-8147-8692-ef1c029d6147",
    title: "【读书笔记】Obviously Awesome_显然很棒",
    html: "【读书笔记】Obviously Awesome_显然很棒_GLM 5.2.html"
  },
  {
    id: "3cb4b57f-e15a-813d-ac14-f35d0da3902f",
    title: "【读书笔记】Never Split the Difference_强势谈判",
    html: "【读书笔记】Never Split the Difference_强势谈判_GLM 5.0.html"
  },
  {
    id: "3cb4b57f-e15a-81ca-8186-f5c90798261d",
    title: "【读书笔记】Million Dollar Weekend_一个周末打造千万事业",
    html: "【读书笔记】Million Dollar Weekend_一个周末打造千万事业_OX Alpha.html"
  },
  {
    id: "3cb4b57f-e15a-81a0-a451-c5ebff9f21f6",
    title: "【读书笔记】Measure What Matters_这才是OKR",
    html: "【读书笔记】Measure What Matters_这才是OKR_OX Alpha.html"
  },
  {
    id: "3cb4b57f-e15a-81dd-9936-dd1b92cead06",
    title: "【读书笔记】Influence Science and Practice_影响力",
    html: "【读书笔记】Influence Science and Practice_影响力_Gemini 3.5 Flash.html"
  },
  {
    id: "3cb4b57f-e15a-81fc-bb9f-f6d78f4e9789",
    title: "【读书笔记】How to Get Rich_如何不靠运气致富",
    html: "【读书笔记】How to Get Rich_如何不靠运气致富_Gemini 3.7 Flash.html"
  },
  {
    id: "3cb4b57f-e15a-810c-813a-f6be62396e11",
    title: "【读书笔记】High Output Management_高产出管理",
    html: "【读书笔记】High Output Management_高产出管理_GLM 5.2.html"
  },
  {
    id: "3cb4b57f-e15a-8186-a96b-ff35ddb5d447",
    title: "【读书笔记】Entrepreneurship_创业学",
    html: "【读书笔记】Entrepreneurship_创业学_Claude Sonnet 4.6 Thinking.html"
  },
  {
    id: "3cb4b57f-e15a-81a3-b4c7-f9cc79f78cc1",
    title: "【读书笔记】Entrepreneurship Choice and Strategy_创业策略选择",
    html: "【读书笔记】Entrepreneurship Choice and Strategy_创业策略选择_GLM 5 Turbo.html"
  },
  {
    id: "3cb4b57f-e15a-816c-8841-f8ddbacd47c8",
    title: "【读书笔记】Deep Learning_深度学习",
    html: "【读书笔记】Deep Learning_深度学习_OX Alpha.html"
  },
  {
    id: "3cb4b57f-e15a-8162-aebd-e2b1613ec752",
    title: "【读书笔记】Competitive Strategy_竞争战略",
    html: "【读书笔记】Competitive Strategy_竞争战略_Gemini Deep Research.html"
  },
  {
    id: "3cb4b57f-e15a-81aa-bd7e-eb3298911175",
    title: "【读书笔记】Competing Against Luck_与运气竞争",
    html: "【读书笔记】Competing Against Luck_与运气竞争_OX Alpha.html"
  },
  {
    id: "3cb4b57f-e15a-8172-82f9-fb2a1965ef1c",
    title: "【读书笔记】Artificial Intelligence A Modern Approach_人工智能：一种现代的方法",
    html: "【读书笔记】Artificial Intelligence A Modern Approach_人工智能：一种现代的方法_Claude Sonnet 4.6 Thinking.html"
  },
  {
    id: "3cb4b57f-e15a-8114-84d9-e4063a3668c2",
    title: "【读书笔记】$100M Offers_一亿美元报价",
    html: "【读书笔记】$100M Offers_一亿美元报价_GLM 5.2.html"
  }
];

async function run() {
  fs.mkdirSync('public/notes_heroes', { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 675, deviceScaleFactor: 2 });

  console.log(`Starting generation for ${notesMap.length} notes...`);

  for (let i = 0; i < notesMap.length; i++) {
    const item = notesMap[i];
    const htmlFile = path.resolve('public/articles', item.html);

    if (!fs.existsSync(htmlFile)) {
      console.warn(`[${i+1}/${notesMap.length}] File not found: ${htmlFile}`);
      continue;
    }

    const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');
    const outLight = path.join('public/notes_heroes', `${item.id}_light.png`);
    const outDark = path.join('public/notes_heroes', `${item.id}_dark.png`);

    try {
      await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 15000 });

      // 1. Light mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      });
      await new Promise(r => setTimeout(r, 150));
      await page.screenshot({ path: outLight, clip: { x: 0, y: 0, width: 1200, height: 675 } });

      // 2. Dark mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      });
      await new Promise(r => setTimeout(r, 150));
      await page.screenshot({ path: outDark, clip: { x: 0, y: 0, width: 1200, height: 675 } });

      console.log(`[${i+1}/${notesMap.length}] ✅ Generated: ${item.title}`);
    } catch (err) {
      console.error(`[${i+1}/${notesMap.length}] ❌ Error for ${item.title}:`, err.message);
    }
  }

  await browser.close();
  console.log('🎉 All note hero snapshots generated successfully!');
}

run().catch(console.error);
