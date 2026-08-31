export type GameStatus = "completed" | "playing" | "dropped" | "wishlist";

export interface StatusMeta {
  label: string;
  color: string;
  lightColor: string;
}

export const STATUS_META: Record<GameStatus, StatusMeta> = {
  completed: {
    label: "已通关",
    color: "#8fe05a",
    lightColor: "#2e7d32",
  },
  playing: {
    label: "游玩中",
    color: "#ffd900",
    lightColor: "#d48806",
  },
  dropped: {
    label: "已弃坑",
    color: "#ff5c5c",
    lightColor: "#cf1322",
  },
  wishlist: {
    label: "愿望单",
    color: "#9d8cff",
    lightColor: "#531dab",
  },
};

export interface GameItem {
  id: string;
  title: string;
  en: string;
  status: GameStatus;
  hours: number | null;
  rating: number | null;
  tags: string[];
  cover: string | null;
  pal: [string, string];
  coreReview: string;
  fullReview: string;
}

export const GAMES_DATA: GameItem[] = [
  {
    "id": "dead-rising-3",
    "title": "丧尸围城3",
    "en": "DEAD RISING 3",
    "status": "completed",
    "hours": 10.0,
    "rating": 8.0,
    "tags": [
      "动作",
      "冒险"
    ],
    "cover": "/covers/dead-rising-3.webp",
    "pal": [
      "#c05a1d",
      "#260d05"
    ],
    "coreReview": "人生最早通关的单机游戏之一，寒冬里用第一台笔记本艰难打完的青春回忆。",
    "fullReview": "大二还是大三的冬天，用人生第一台笔记本艰难地打通关了，算是人生最早通关单机游戏之一。"
  },
  {
    "id": "outlast",
    "title": "逃生",
    "en": "OUTLAST",
    "status": "completed",
    "hours": 5.0,
    "rating": 9.0,
    "tags": [
      "恐怖",
      "生存"
    ],
    "cover": "/covers/outlast.webp",
    "pal": [
      "#8a1f1f",
      "#12060b"
    ],
    "coreReview": "生存恐怖启蒙神作，从高中云通关到大学亲自补票的情怀之作。",
    "fullReview": "鼎鼎大名的生存恐怖游戏，还在读高中的时候就云过多次，上了大学有电脑了才亲自通关，补票的性质偏高，更多的是情怀和回忆，和恶灵附身一起成为我的恐怖游戏启蒙。"
  },
  {
    "id": "outlast-whistleblower",
    "title": "逃生：告密者",
    "en": "WHISTLEBLOWER",
    "status": "completed",
    "hours": 3.0,
    "rating": 9.0,
    "tags": [
      "恐怖",
      "生存"
    ],
    "cover": "/covers/outlast-whistleblower.webp",
    "pal": [
      "#8c2b2b",
      "#160a10"
    ],
    "coreReview": "比逃生本体更为血腥压抑的窒息级惊悚扩充。",
    "fullReview": "印象中比逃生本体更血腥。"
  },
  {
    "id": "nier-automata",
    "title": "尼尔：机械纪元",
    "en": "AUTOMATA",
    "status": "completed",
    "hours": 35.7,
    "rating": 10.0,
    "tags": [
      "动作",
      "冒险",
      "角色扮演"
    ],
    "cover": "/covers/nier-automata.webp",
    "pal": [
      "#6b7684",
      "#10141b"
    ],
    "coreReview": "在生与死的螺旋挣扎中寻找存在的意义，世界观与神级原声配乐直击灵魂。",
    "fullReview": "“在生与死的螺旋之中，他们一直被囚禁着。但是... ...在那些轮回中的挣扎，那便是活着的意义。”\n如果有生之年我要自己写一次剧本的话，那一定会有尼尔的影子。\n世界观和音乐满分，剧情和演出也做得非常好，可惜画质一般，开放世界的趣味性一般，小地图做得稀烂，容易迷路；而且没有中文。"
  },
  {
    "id": "sekiro",
    "title": "只狼：影逝二度",
    "en": "SEKIRO",
    "status": "completed",
    "hours": 59.9,
    "rating": 9.0,
    "tags": [
      "动作",
      "冒险"
    ],
    "cover": "/covers/sekiro.webp",
    "pal": [
      "#a03322",
      "#1c0f08"
    ],
    "coreReview": "论文答辩与受苦打铁的双重磨炼，苇名屑一郎的悲壮宿命令人动容。",
    "fullReview": "以后如果有谁说自己喜欢打游戏，那我首先就问有没有打过只狼。\n打只狼的日子算是研二暑假和研三寒假印象深刻的回忆，论文答辩+只狼的双重折磨，现在看来全是美好的回忆。\n由于文本和对话比较零散，一周目没有花太多注意力去在意剧情和世界观，打到99%之后才去b站看的剧情解说。印象最深刻的也让我最感动的角色反而并不是狼，而是抛弃武士的荣耀不择手段保家卫国的苇名屑一郎。只狼的故事从头到尾都是命中注定的悲剧。\n这游戏挺耐玩的，我预计要练习时长两年半了（2023年暑假开坑，预计二周目打完得到2025年年底，写评价的时候还没通二周目，时间2025/8/24/03点27分）"
  },
  {
    "id": "re4-remake",
    "title": "生化危机4重制版",
    "en": "RESIDENT EVIL 4",
    "status": "completed",
    "hours": 49.2,
    "rating": 10.0,
    "tags": [
      "恐怖",
      "射击"
    ],
    "cover": "/covers/re4-remake.webp",
    "pal": [
      "#8a1f1f",
      "#150808"
    ],
    "coreReview": "枪械与体术配合最丝滑的顶峰之作，首发一口气畅快通关。",
    "fullReview": "应该是装新电脑以来第一个首发购买和通关的游戏，全程没有拖延症发作。从来没见过其他游戏里的枪械和体术能这么丝滑地配合。"
  },
  {
    "id": "evil-within",
    "title": "恶灵附身",
    "en": "THE EVIL WITHIN",
    "status": "completed",
    "hours": 18.2,
    "rating": 9.0,
    "tags": [
      "恐怖",
      "生存"
    ],
    "cover": "/covers/evil-within.webp",
    "pal": [
      "#5f1d2b",
      "#0c0608"
    ],
    "coreReview": "压迫感与恐怖氛围犹在逃生之上的正统生存神作。",
    "fullReview": "同样是补票，真自己玩上了才感觉到比逃生还吓人，确实是神作级别。"
  },
  {
    "id": "titanfall-2",
    "title": "泰坦陨落2",
    "en": "TITANFALL 2",
    "status": "completed",
    "hours": 6.6,
    "rating": 10.0,
    "tags": [
      "第一人称",
      "射击"
    ],
    "cover": "/covers/titanfall-2.webp",
    "pal": [
      "#d97b29",
      "#241206"
    ],
    "coreReview": "单人战役关卡设计的教科书，短小精悍且酣畅淋漓。",
    "fullReview": "感觉机甲没有比人打得更爽（也可能是我不擅长开机甲），流程太短，其他满分"
  },
  {
    "id": "black-myth-wukong",
    "title": "黑神话：悟空",
    "en": "BLACK MYTH: WUKONG",
    "status": "completed",
    "hours": 54.2,
    "rating": 8.0,
    "tags": [
      "动作",
      "角色扮演"
    ],
    "cover": "/covers/black-myth-wukong.webp",
    "pal": [
      "#c9a13b",
      "#1d1306"
    ],
    "coreReview": "过场动画与中式意境塑造惊艳，直面天命的情怀之作。",
    "fullReview": "首发没有地图，一直在迷路，打boss卡建模吞伤害，剧情魔改不尊重原著，除了过场动画和情绪+氛围塑造比较惊喜之外，即使情怀加持的情况下，其他的体验并不算好"
  },
  {
    "id": "re3-remake",
    "title": "生化危机3重制版",
    "en": "RESIDENT EVIL 3",
    "status": "completed",
    "hours": 8.0,
    "rating": 8.0,
    "tags": [
      "动作",
      "冒险"
    ],
    "cover": "/covers/re3-remake.webp",
    "pal": [
      "#a33b2a",
      "#180a08"
    ],
    "coreReview": "紧凑无迷路的爽快追逐战，短小精悍的箱庭体验。",
    "fullReview": "虽然说差评挺多，但是在我这的游玩体验比2重制版要好得多，毕竟没有怎么迷路，也没有动不动的暴君破墙（指格子危机和火力不足），流程短在我这也没算缺点"
  },
  {
    "id": "miside",
    "title": "米塔",
    "en": "MISIDE",
    "status": "completed",
    "hours": 5.0,
    "rating": 10.0,
    "tags": [
      "恐怖",
      "冒险",
      "恋爱"
    ],
    "cover": "/covers/miside.webp",
    "pal": [
      "#d4526e",
      "#260d16"
    ],
    "coreReview": "像素二次元外衣下的神级心理恐怖氛围，角色设计与关卡细节极具巧思。",
    "fullReview": "是我2025年1月迷茫压抑的生活中最大的乐趣之一。二刺螈画风里最顶尖的恐怖氛围营造；每一个米塔的角色设计和关卡的各种细节做得也很有意思，50块钱玩到这个游戏属实赚到了，期待之后的DLC"
  },
  {
    "id": "dead-island-2",
    "title": "死亡岛2",
    "en": "DEAD ISLAND 2",
    "status": "completed",
    "hours": 34.5,
    "rating": 8.0,
    "tags": [
      "动作",
      "角色扮演"
    ],
    "cover": "/covers/dead-island-2.webp",
    "pal": [
      "#c9a12a",
      "#1e1708"
    ],
    "coreReview": "解压畅快的近战丧尸碎骨体验，色彩浓烈的洛杉矶末日漫游。",
    "fullReview": "不管开没开动态模糊都有点晕，虽然后面好多了。\n如果能加一个小地图就更好了，每次追踪任务的时候都不知道往哪跑；武器的迭代速度太快了，只要是30分钟前掉落的武器基本可以拆解了"
  },
  {
    "id": "popucom",
    "title": "泡姆泡姆",
    "en": "POPUCOM",
    "status": "completed",
    "hours": 21.3,
    "rating": 9.0,
    "tags": [
      "多人合作",
      "三消"
    ],
    "cover": "/covers/popucom.webp",
    "pal": [
      "#3fa7a0",
      "#0a1d20"
    ],
    "coreReview": "完成度极高的高品质双人合作三消冒险。",
    "fullReview": "应该是第一个用上最高配置通关的单机游戏，第一个二游厂商做出来的单机游戏。\n虽然说是鹰角手磨三年出来的三消，但是完成度肉眼可见的高，最大的缺点可能就是想要全成就的情况下，即使是对着攻略也没办法精准定位漏掉的问号牌和奶龙，甚至得靠回忆猜测这个地方我们有没有拿。\n属于是很难想象和《来自星尘》是同一家公司做的；后续如果能免费更新地图的话，我这六十多块钱也算超值了（可惜大概率没有）。"
  },
  {
    "id": "re2-remake",
    "title": "生化危机2重制版",
    "en": "RESIDENT EVIL 2",
    "status": "completed",
    "hours": 10.3,
    "rating": 7.0,
    "tags": [
      "动作",
      "冒险"
    ],
    "cover": "/covers/re2-remake.webp",
    "pal": [
      "#8f2222",
      "#130808"
    ],
    "coreReview": "浣熊市警局重度压迫感的经典生化重塑。",
    "fullReview": "克莱尔线就不打了，太容易迷路了。"
  },
  {
    "id": "hollow-knight",
    "title": "空洞骑士",
    "en": "HOLLOW KNIGHT",
    "status": "playing",
    "hours": null,
    "rating": null,
    "tags": [
      "动作",
      "冒险",
      "2D"
    ],
    "cover": "/covers/hollow-knight.webp",
    "pal": [
      "#5a6fb5",
      "#0c1024"
    ],
    "coreReview": "圣巢地底深邃宏大的类银河恶魔城史诗探索。",
    "fullReview": "圣巢地底深邃宏大的类银河恶魔城史诗探索。"
  },
  {
    "id": "cyberpunk-2077",
    "title": "赛博朋克2077",
    "en": "CYBERPUNK 2077",
    "status": "playing",
    "hours": null,
    "rating": null,
    "tags": [
      "角色扮演",
      "开放世界",
      "第一人称"
    ],
    "cover": "/covers/cyberpunk-2077.webp",
    "pal": [
      "#e3cf3f",
      "#161206"
    ],
    "coreReview": "夜之城霓虹夜幕下的沉浸式赛博朋克传奇。",
    "fullReview": "夜之城霓虹夜幕下的沉浸式赛博朋克传奇。"
  },
  {
    "id": "persona-5",
    "title": "女神异闻录5",
    "en": "PERSONA 5",
    "status": "playing",
    "hours": null,
    "rating": null,
    "tags": [
      "角色扮演"
    ],
    "cover": "/covers/persona-5.webp",
    "pal": [
      "#d81e3f",
      "#150409"
    ],
    "coreReview": "潮到出水的殿堂级 JRPG，心之怪盗团的青春物语。",
    "fullReview": "潮到出水的殿堂级 JRPG，心之怪盗团的青春物语。"
  },
  {
    "id": "atri",
    "title": "亚托莉 -我挚爱的时光-",
    "en": "ATRI -MY DEAR MOMENTS-",
    "status": "playing",
    "hours": null,
    "rating": null,
    "tags": [
      "视觉小说"
    ],
    "cover": "/covers/atri.webp",
    "pal": [
      "#7fd0e8",
      "#0c1a24"
    ],
    "coreReview": "沉入海平面的末世中，与仿生少女相伴的温暖治愈物语。",
    "fullReview": "沉入海平面的末世中，与仿生少女相伴的温暖治愈物语。"
  },
  {
    "id": "re9-requiem",
    "title": "生化危机9：安魂曲",
    "en": "RESIDENT EVIL 9: REQUIEM",
    "status": "completed",
    "hours": 21.2,
    "rating": 10.0,
    "tags": [
      "恐怖"
    ],
    "cover": "/covers/re9-requiem.webp",
    "pal": [
      "#8f2436",
      "#110609"
    ],
    "coreReview": "双线交织的恐怖与战斗，重返警局的情怀共鸣。",
    "fullReview": "卖生化2情怀，到警察局比回老家了还熟悉、格蕾丝线恐怖+里昂线战斗、致敬电影，对我来说都是优点。可惜最后不是经典的rpg结尾。"
  },
  {
    "id": "inner-demon",
    "title": "心魔",
    "en": "THE IN CLOSURE / INNER DEMON",
    "status": "dropped",
    "hours": 5.4,
    "rating": null,
    "tags": [
      "恐怖"
    ],
    "cover": "/covers/inner-demon.webp",
    "pal": [
      "#4a4a55",
      "#0a0a0e"
    ],
    "coreReview": "氛围压抑至极、让人望而生畏的中途止步之作。",
    "fullReview": "弃坑，太太太太恐怖不敢玩了"
  },
  {
    "id": "witch-trial",
    "title": "魔法少女的魔女审判",
    "en": "WITCH TRIAL",
    "status": "completed",
    "hours": 36.2,
    "rating": 10.0,
    "tags": [
      "视觉小说"
    ],
    "cover": "/covers/witch-trial.webp",
    "pal": [
      "#b0459a",
      "#1c0a1c"
    ],
    "coreReview": "剧情、立绘与反转拉满的超高水准视觉小说，全程无尿点。",
    "fullReview": "在油管看到樱花妹玩这个游戏，感觉画风非常不错就下了盗版玩，总共36个小时的剧情量，即使是正版原价80块钱也可以说挺有性价比了。除了一开始就出场13个角色不太好记住以外，剧情、角色设计、立绘、cg、音乐、配音都是超高水准，几乎全程无尿点的游戏体验。印象里几个比较震撼的反转点是：蕾雅、安安的真实杀人动机揭示、希罗开二周目的死亡回溯、雪莉和汉娜一起处刑。最后月代雪放弃灭绝人类有点情绪铺垫不足，不过总体也算个皆大欢喜的HAPPY END。最喜欢的角色是艾玛，第二是雪莉，第三是希罗，第四是诺亚。最喜欢的一张cg是老玛死在电梯里，其次是鱼缸诺亚和希罗，第三是安安回忆里抱着一堆娃娃。"
  },
  {
    "id": "expedition-33",
    "title": "光与影：33号远征队",
    "en": "CLAIR OBSCUR: EXPEDITION 33",
    "status": "completed",
    "hours": 26.5,
    "rating": 9.0,
    "tags": [
      "角色扮演",
      "回合制"
    ],
    "cover": "/covers/expedition-33.webp",
    "pal": [
      "#2f5f9e",
      "#0a1220"
    ],
    "coreReview": "绝美法式艺术风格与惊艳战斗处决，对抗虚无的画中世界。",
    "fullReview": "第一印象：美术和音乐非常契合，角色建模有奇怪的颗粒感，总感觉怪怪的。开头的第一次抹煞过场动画做得非常不错，算是给游戏定下了浪漫+悲伤的基调，但是此时对角色无感，以至于没有任何情绪波动；中期：玩法不算无聊但是难度平衡和养成引导做得一般，我甚至在偏中后期才知道灵光点用来加额外的符文效果，剧情上中规中矩，古斯塔夫死亡意料之中，所以期待更大的反转；后期：四手剑客的处决做得非常惊艳，让剧情演出变成了很大的优点，即使在那个时候还是没有大反转，直到讨伐完绘母回家后所有人团灭才让剧情有了爆点，虽然也还是容易猜到，但是对于反转点来说已经足够承载后面的剧情了，剧情在这个时候不再是掉分项；结尾：调成了简单模式重新养了铝镍和老玛之后变成了秒天秒地，但是又不敢换回中等难度，怕打不过消磨耐心，所以如果有一个基于当前养成效果的难度建议就好了。相比老玛结局，更喜欢维尔索的结局，一家人重新在现实生活团圆，画中世界被毁，毕竟对抗虚无面对现实对于一个游戏剧情来说比沉浸虚假世界抛弃现实家人要更有意义。\n＂留在这里的我们只是一段过往，一道留在过去的影子。＂\n我们只能呆在这里触碰不了你所在的现实也无法陪伴你走向未来。＂\n＂当你离开这里之后回到正常的现实的生活中去，你也很清楚这里发生的一切都只是一个故事一个虚拟的故事。＂\n＂可能用不了多久你会忘记这些事忘记这些话忘记我们的存在，你会遇到比我更好的人也可能已经遇见了。＂\n＂你终究还有自己的生活要去拥抱属于你的明天，那样的话我们的情感我们的思考我们的意志我们的行为真的还有意义吗？＂\n＂对你来说对任何人来说，我们...意味着什么呢？＂\n我以为剧情最后会讨论上面的课题。\n所以缺点：前期以为会是一个类似于翁法罗斯的凡人挑战神明拯救世界的悲壮史诗，中期以为主角团在无限轮回，后期告诉我这只是一个家庭中的矛盾纠葛才导致天灾降临的画中世界，我知道编剧想创造剧情反转和立意上见微知著的效果，但是前面渲染的视死如归的远征、冲锋和牺牲是不是完全失去了意义呢。但凡最后再多一点老玛和卢明的家人朋友的回忆，让玩家知道即使是虚拟的世界也留有最真实的情感和记忆，为了守护这一切再多的牺牲都是值得的，最后也不至于让之前几十年的远征变成小丑。"
  },
  {
    "id": "pragmata-existence",
    "title": "识质存在",
    "en": "PRAGMATA / EXISTENCE",
    "status": "completed",
    "hours": 13.0,
    "rating": 8.0,
    "tags": [
      "动作",
      "角色扮演"
    ],
    "cover": "/covers/pragmata-existence.webp",
    "pal": [
      "#4fae6a",
      "#0a1a10"
    ],
    "coreReview": "一笔画与越肩射击的卡普空新颖动作探索。",
    "fullReview": "基于200多块的价格，总体流程偏短，和生化危机9差不多，甚至要更短一些，剧情上无功无过，卡普空的这套新玩法体感上还算爽，可惜从头到尾都是这个一笔画+越肩射击，稍微有些无聊了。场景做得挺不错，小孩还算可爱，也不熊，就是英文配音偶尔有些出戏，想换成日配听东山奈央的话，男主一口日语又很难绷，中文更是出戏，所以还是用了英配。"
  },
  {
    "id": "phantom-blade-zero",
    "title": "影之刃：零",
    "en": "PHANTOM BLADE ZERO",
    "status": "wishlist",
    "hours": null,
    "rating": null,
    "tags": [
      "动作",
      "角色扮演"
    ],
    "cover": null,
    "pal": [
      "#c23b2e",
      "#150807"
    ],
    "coreReview": "高速武侠动作与黑暗诡谲美学的年度期待之作。",
    "fullReview": "愿望单：等待发售中。高速武侠动作与黑暗诡谲美学的国产单机新作。"
  }
];
