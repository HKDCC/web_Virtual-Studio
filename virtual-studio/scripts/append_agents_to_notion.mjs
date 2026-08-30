import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = "e774b57f-e15a-83e7-b633-818781fe9a41";

async function run() {
  const blocks = [
    {
      object: "block",
      type: "divider",
      divider: {}
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: { content: "附录：AGENTS.md 翻译项目自愈法则与核心术语库" }
          }
        ],
        color: "default"
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content:
                "在《Obviously Awesome》全书本地化过程中，我们通过 Agent 自愈错题本机制沉淀了这套《高级商业与科技文档本地化润色指南》（AGENTS.md）。所有智能体在每次分章初译与审校时均以此作为核心约束规范："
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [
          {
            type: "text",
            text: { content: "一、 极致精简 (Conciseness & Force)" }
          }
        ],
        color: "red"
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "标准：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "在准确地道的前提下极致压缩字数，能省一字是一字，确保短促、干脆的文风冲击力。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "剪除多余动作介词/助词：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "去除拖沓的“你想……”、“你是否……”、“去……”、“地”、“的”、“得”、“了”。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "句尾重心与无主语祈使句：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "能用祈使句或无主语句直接表达的，绝不使用冗长的条件句或陈述句。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "code",
      code: {
        caption: [],
        rich_text: [
          {
            type: "text",
            text: {
              content:
                "• Want to grow revenue faster?\n  [初译] 你想让收入增长得更快吗？ ➔ [定稿] 想加快营收增长吗？\n\n• Deliberate, try, fail, test and try again.\n  [初译] 去深思、尝试、失败、测试，然后再试一次。 ➔ [定稿] 深思、尝试、失败、测试，然后再试一次。"
            }
          }
        ],
        language: "markdown"
      }
    },
    {
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [
          {
            type: "text",
            text: { content: "二、 用标点焊接逻辑 (Punctuation as Logic Markers)" }
          }
        ],
        color: "blue"
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "标准：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "打破英文原本平铺直叙的句号和逗号，用中文字符的逻辑性符号理顺阅读节奏。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "冒号（：）—— 结论与解释的逻辑焊接：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "当原文先抛出定义或结论，随后展开大段解释时，使用冒号把“观点”和“阐述”牢牢铆合，增强长句的逻辑连贯。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "破折号（——）—— 弱转折与句尾补叙：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "用破折号替代“尽管……但……”等连词；或者将定语/修饰语放在句尾进行补叙，以此精简主句。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "分号（；）—— 长并列层次区分：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "在包含多个并列且已含逗号的复杂长句中，用分号划清界限。宁可多断句，也绝不一逗到底。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "引号（“”）—— 认知标签：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "对于特定行业术语、自造标签或品类词，保留引号使其成为读者的“认知路标”。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "code",
      code: {
        caption: [],
        rich_text: [
          {
            type: "text",
            text: {
              content:
                "• The root cause is that we didn't understand the real alternative in the customer's mind.\n  [初译] 根源在于我们没有搞懂客户脑子里的真实替代方案。\n  ➔ [定稿] 根源就在于没摸清真正的“竞争替代方案”——客户心智里的那个。"
            }
          }
        ],
        language: "markdown"
      }
    },
    {
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [
          {
            type: "text",
            text: { content: "三、 商业博弈与实战质感 (Professional & Punchy)" }
          }
        ],
        color: "green"
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "标准：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "消除书面书卷气的“翻译腔”，采用一线商业博弈、营销对抗以及国人熟知的成语/熟语进行意译，打造临场感。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "组织实体角色化：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "当遇到特定行业职能名称时（如 Customer Success），绝不直译为抽象概念（如“客户成功”），必须译为具体的组织角色（如“客户成功部门/团队”）。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "动词心智化升级：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "描写客户心理状态时，选用更具认知张力的词汇（如把 perceive 从“变得”升级为“显得”；把 understand/know 升级为“洞穿”、“摸清”）。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "本土商业词境映射：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "将抽象生存状态或优势强弱，投射为具有行业厚度的中文词汇（如将 obvious benefits 译为“压倒性优势”；将 completely obvious 译为“理所当然”；将 fell by the wayside 译为“被无情淘汰”；将 beat the leader 译为“以其人之道还治其人之身”）。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "并列短语结构对齐：", link: null },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "并列成分的文风、字数、语调必须高度对称（如把“用纸和笔”与“雇个实习生来干”，统一精炼对齐为“靠纸笔”或“雇个实习生”）。" }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [
          {
            type: "text",
            text: { content: "四、 核心术语与短语对照范例库 (Golden Examples)" }
          }
        ],
        color: "orange"
      }
    },
    {
      object: "block",
      type: "code",
      code: {
        caption: [],
        rich_text: [
          {
            type: "text",
            text: {
              content:
                "| 英文原文 | 推荐中文定稿 | 翻译决策与原理说明 |\n" +
                "| :--- | :--- | :--- |\n" +
                "| obviously awesome / get it | 一目了然 / 秒懂 | 核心灵魂。最具画面感和决策速度，替代死板的“显然很棒” |\n" +
                "| best-fit customers / ideal prospects | 最买账的客群 / 最佳匹配客户 | 体现强烈购买意愿，比“合适客户”更有商业黏性 |\n" +
                "| competitive alternatives | 竞争替代方案 | 锁死“竞争”二字，避免语义重复的“竞品替代方案” |\n" +
                "| languish in a market... | 在无人懂其妙处的世界里苟延残喘 | 情感色彩强烈的意译，替代大白话“停留” |\n" +
                "| from “What?” to “WOW!” | 从“这啥玩意？”跨越到“非买不可！” | 口语化情绪表达，完美贴合买家真实心路历程 |\n" +
                "| sizzle and pizzazz | 噱头和浮华 | 极具中文美感的成语化意译，精准讽刺市场跟风现象 |\n" +
                "| unexpected expense can kill... | 意外开支足以致命 | 八字成句，极简紧凑 |\n" +
                "| alignment / all in alignment | 达成绝对共识 | 代替字面“对齐”，体现团队在战略方向上的高度一致 |\n" +
                "| finding solutions | 找出破局点 | 商业语境升级，将寻找方案意译为“找出破局点”，更为老练 |\n" +
                "| head-to-head positioning | 正面硬刚定位 | 极具博弈对抗色彩，替代生硬的“头对头/正面竞争” |\n" +
                "| big fish, small pond | 小池大鱼 | 对称性四字词，读起来具有强烈的节奏感 |\n" +
                "| create a new game | 开创新游戏 | 突出颠覆式竞争的主动权与战略高度 |"
            }
          }
        ],
        language: "markdown"
      }
    }
  ];

  try {
    const res = await notion.blocks.children.append({
      block_id: PAGE_ID,
      children: blocks
    });
    console.log("Successfully appended", res.results.length, "blocks to Notion page:", PAGE_ID);
  } catch (err) {
    console.error("Failed to append blocks:", err.message);
  }
}

run();
