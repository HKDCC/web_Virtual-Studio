import { getTimelineEntries } from "@/lib/changelog";
import { TimelineView } from "@/components/news/TimelineView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewsPage() {
  const entries = await getTimelineEntries();

  return (
    <div className="magazine-layout wrap" style={{ paddingTop: "32px", paddingBottom: "80px" }}>
      <div className="section-header" style={{ marginBottom: "36px" }}>
        <div>
          <p className="section-eyebrow">TIMELINE · 04 时间线</p>
          <h1 className="section-title">模型更迭</h1>
        </div>
        <p className="section-desc">
          汇聚全球主流大语言模型关键迭代脉络与 Artificial Analysis 官方权威智力评级。
        </p>
      </div>

      <TimelineView entries={entries} />
    </div>
  );
}
