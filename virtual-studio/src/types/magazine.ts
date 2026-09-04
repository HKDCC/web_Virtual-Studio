export interface BookItem {
  id?: string;
  t: string;
  a: string;
  c: string;
  tags?: string[];
  coverUrl?: string | null;
  rating?: number | null;
  tagline?: string | null;
  downloadUrl?: string | null;
}

export interface AppIconInfo {
  type: "emoji" | "image";
  value: string;
}

export interface LabItem {
  id?: string;
  tag: string;
  t: string;
  d: string;
  links: [string, string][];
  iconUrl?: string | null;
  appIcon?: AppIconInfo | null;
}

export interface FlowStep {
  role: string;
  t: string;
  d: string;
}

export interface ToolItem {
  t: string;
  s: string;
  d: string;
  url: string;
}

export interface SiteItem {
  t: string;
  url: string;
  d: string;
  r: string;
}

export interface PromptItem {
  t: string;
  body: string;
}

export interface TimelineItem {
  d: string;
  t: string;
  note: string;
}

export interface PauseItem {
  id?: string;
  d: string;
  loc: string;
  t: string;
  img: string;
}

export interface NoteItem {
  id?: string;
  d: string;
  title: string;
  cat: string;
  src?: string;
  tags?: string[];
  readTime?: number | null;
  htmlContent?: string | null;
  heroLight?: string | null;
  heroDark?: string | null;
  text: string;
}

export interface LogItem {
  id?: string;
  d: string;
  t: string;
  desc?: string;
  type?: string;
}

export interface MagazineDataPayload {
  books: BookItem[];
  lab: LabItem[];
  flow: FlowStep[];
  tools: ToolItem[];
  sites: SiteItem[];
  prompts: PromptItem[];
  timeline: TimelineItem[];
  pause: PauseItem[];
  notes: NoteItem[];
  log: LogItem[];
}
