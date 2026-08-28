import { getTimelineEntries } from "@/lib/changelog";
import { TimelineView } from "@/components/news/TimelineView";

export default async function Demo0NewsPage() {
  const entries = await getTimelineEntries();

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Timeline · 输出层</p>
          <h1 className="section-title">模型更迭</h1>
        </div>
        <p className="section-desc">
          主流大语言模型迭代时间轴，高光时刻精确记录。
        </p>
      </div>

      <TimelineView entries={entries} />
    </>
  );
}
