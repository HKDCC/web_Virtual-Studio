import pandas as pd
import json
import os

df = pd.read_excel(r'..\reference\game-library\game-list.xlsx').fillna('')

mapping = [
  ('dead-rising-3', 'DEAD RISING 3', '/covers/dead-rising-3.webp', ['#c05a1d', '#260d05'], '人生最早通关的单机游戏之一，寒冬里用第一台笔记本艰难打完的青春回忆。'),
  ('outlast', 'OUTLAST', '/covers/outlast.webp', ['#8a1f1f', '#12060b'], '生存恐怖启蒙神作，从高中云通关到大学亲自补票的情怀之作。'),
  ('outlast-whistleblower', 'WHISTLEBLOWER', '/covers/outlast-whistleblower.webp', ['#8c2b2b', '#160a10'], '比逃生本体更为血腥压抑的窒息级惊悚扩充。'),
  ('nier-automata', 'AUTOMATA', '/covers/nier-automata.webp', ['#6b7684', '#10141b'], '在生与死的螺旋挣扎中寻找存在的意义，世界观与神级原声配乐直击灵魂。'),
  ('sekiro', 'SEKIRO', '/covers/sekiro.webp', ['#a03322', '#1c0f08'], '论文答辩与受苦打铁的双重磨炼，苇名屑一郎的悲壮宿命令人动容。'),
  ('re4-remake', 'RESIDENT EVIL 4', '/covers/re4-remake.webp', ['#8a1f1f', '#150808'], '枪械与体术配合最丝滑的顶峰之作，首发一口气畅快通关。'),
  ('evil-within', 'THE EVIL WITHIN', '/covers/evil-within.webp', ['#5f1d2b', '#0c0608'], '压迫感与恐怖氛围犹在逃生之上的正统生存神作。'),
  ('titanfall-2', 'TITANFALL 2', '/covers/titanfall-2.webp', ['#d97b29', '#241206'], '单人战役关卡设计的教科书，短小精悍且酣畅淋漓。'),
  ('black-myth-wukong', 'BLACK MYTH: WUKONG', '/covers/black-myth-wukong.webp', ['#c9a13b', '#1d1306'], '过场动画与中式意境塑造惊艳，直面天命的情怀之作。'),
  ('re3-remake', 'RESIDENT EVIL 3', '/covers/re3-remake.webp', ['#a33b2a', '#180a08'], '紧凑无迷路的爽快追逐战，短小精悍的箱庭体验。'),
  ('miside', 'MISIDE', '/covers/miside.webp', ['#d4526e', '#260d16'], '像素二次元外衣下的神级心理恐怖氛围，角色设计与关卡细节极具巧思。'),
  ('dead-island-2', 'DEAD ISLAND 2', '/covers/dead-island-2.webp', ['#c9a12a', '#1e1708'], '解压畅快的近战丧尸碎骨体验，色彩浓烈的洛杉矶末日漫游。'),
  ('popucom', 'POPUCOM', '/covers/popucom.webp', ['#3fa7a0', '#0a1d20'], '完成度极高的高品质双人合作三消冒险。'),
  ('re2-remake', 'RESIDENT EVIL 2', '/covers/re2-remake.webp', ['#8f2222', '#130808'], '浣熊市警局重度压迫感的经典生化重塑。'),
  ('hollow-knight', 'HOLLOW KNIGHT', '/covers/hollow-knight.webp', ['#5a6fb5', '#0c1024'], '圣巢地底深邃宏大的类银河恶魔城史诗探索。'),
  ('cyberpunk-2077', 'CYBERPUNK 2077', '/covers/cyberpunk-2077.webp', ['#e3cf3f', '#161206'], '夜之城霓虹夜幕下的沉浸式赛博朋克传奇。'),
  ('persona-5', 'PERSONA 5', '/covers/persona-5.webp', ['#d81e3f', '#150409'], '潮到出水的殿堂级 JRPG，心之怪盗团的青春物语。'),
  ('atri', 'ATRI -MY DEAR MOMENTS-', '/covers/atri.webp', ['#7fd0e8', '#0c1a24'], '沉入海平面的末世中，与仿生少女相伴的温暖治愈物语。'),
  ('re9-requiem', 'RESIDENT EVIL 9: REQUIEM', '/covers/re9-requiem.webp', ['#8f2436', '#110609'], '双线交织的恐怖与战斗，重返警局的情怀共鸣。'),
  ('inner-demon', 'THE IN CLOSURE / INNER DEMON', '/covers/inner-demon.webp', ['#4a4a55', '#0a0a0e'], '氛围压抑至极、让人望而生畏的中途止步之作。'),
  ('witch-trial', 'WITCH TRIAL', '/covers/witch-trial.webp', ['#b0459a', '#1c0a1c'], '剧情、立绘与反转拉满的超高水准视觉小说，全程无尿点。'),
  ('phantom-blade-zero', 'PHANTOM BLADE ZERO', None, ['#c23b2e', '#150807'], '高速武侠动作与黑暗诡谲美学的年度期待之作。'),
  ('expedition-33', 'CLAIR OBSCUR: EXPEDITION 33', '/covers/expedition-33.webp', ['#2f5f9e', '#0a1220'], '绝美法式艺术风格与惊艳战斗处决，对抗虚无的画中世界。'),
  ('pragmata-existence', 'PRAGMATA / EXISTENCE', '/covers/pragmata-existence.webp', ['#4fae6a', '#0a1a10'], '一笔画与越肩射击的卡普空新颖动作探索。')
]

res = []
for idx, row in df.iterrows():
    if idx >= len(mapping):
        break
    m = mapping[idx]
    gid, gen, gcov, gpal, gcore = m
    raw_title = str(row['Game Title']).strip()
    status = str(row['Status']).strip().lower()
    if status == 'playing':
        st = 'playing'
    elif status == 'dropped':
        st = 'dropped'
    elif status == 'wishlist':
        st = 'wishlist'
    else:
        st = 'completed'
    
    hours = float(row['Playtime']) if row['Playtime'] != '' and row['Playtime'] is not None else None
    rating = float(row['Rating']) if row['Rating'] != '' and row['Rating'] is not None else None
    tags = [t.strip() for t in str(row['Type']).split(',') if t.strip()]
    raw_rev = str(row['评价']).strip()
    full_rev = raw_rev if raw_rev else gcore
    
    display_title = raw_title
    if '黑神话' in raw_title:
        display_title = '黑神话：悟空'
    elif 'ATRI' in raw_title:
        display_title = '亚托莉 -我挚爱的时光-'
        
    res.append({
        'id': gid,
        'title': display_title,
        'en': gen,
        'status': st,
        'hours': hours,
        'rating': rating,
        'tags': tags,
        'cover': gcov,
        'pal': gpal,
        'coreReview': gcore,
        'fullReview': full_rev
    })

ts_header = """export type GameStatus = "completed" | "playing" | "dropped" | "wishlist";

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

export const GAMES_DATA: GameItem[] = """

os.makedirs('src/data', exist_ok=True)
with open('src/data/gamesData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_header + json.dumps(res, ensure_ascii=False, indent=2) + ';\n')

print(f'Successfully exported {len(res)} games to src/data/gamesData.ts')
