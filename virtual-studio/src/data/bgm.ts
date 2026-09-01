export interface Track {
  id: string;
  title: string;
  artist: string;
  tag: string;
  src: string;
  year?: string;
  description?: string;
  duration: number; // Exact duration in seconds
}

export const BGM_PLAYLIST: Track[] = [
  {
    id: "breaking-the-loop",
    title: "Breaking the Loop",
    artist: "tl; // lab",
    tag: "Synthwave / Chill",
    src: "/music/breaking-the-loop.mp3",
    year: "2026",
    description: "打破循环的节奏与清澈律动",
    duration: 195,
  },
  {
    id: "breaking-loop-remix",
    title: "Breaking Loop (Remix)",
    artist: "tl; // lab",
    tag: "Electronic / Beat",
    src: "/music/breaking-loop-remix.mp3",
    year: "2026",
    description: "更强劲的低音鼓点与空间混音",
    duration: 219,
  },
  {
    id: "cold-cup-tea",
    title: "Cold Cup Tea",
    artist: "tl; // lab",
    tag: "Ambient / Lofi",
    src: "/music/cold-cup-tea.mp3",
    year: "2026",
    description: "放凉的茶与午后的安静思考",
    duration: 182,
  },
  {
    id: "fax-machine-singing",
    title: "Fax Machine Singing",
    artist: "tl; // lab",
    tag: "Glitch / Beats",
    src: "/music/fax-machine-singing.mp3",
    year: "2026",
    description: "复古传真机与数字故障音的奇妙合唱",
    duration: 259,
  },
  {
    id: "plastic-spoon",
    title: "Plastic Spoon",
    artist: "tl; // lab",
    tag: "Indie / Instrumental",
    src: "/music/plastic-spoon.mp3",
    year: "2026",
    description: "日常微小器物里的旋律共振",
    duration: 230,
  },
  {
    id: "plastic-spoon-remix",
    title: "Plastic Spoon (Remix)",
    artist: "tl; // lab",
    tag: "Future / Remix",
    src: "/music/plastic-spoon-remix.mp3",
    year: "2026",
    description: "跳跃电子质感的节奏重构",
    duration: 232,
  },
];
