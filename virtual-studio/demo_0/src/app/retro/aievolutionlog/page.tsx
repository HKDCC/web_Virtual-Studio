import { getTimelineEntries } from "@/lib/changelog";
import { TimelineView } from "@/components/news/TimelineView";

export default async function RetroAILogPage() {
  const entries = await getTimelineEntries();

  return (
    <section className="retro-chapter">
      <div className="retro-chapter-header">
        <div className="retro-chapter-num">CH.04</div>
        <div>
          <h2 className="retro-chapter-title">AI模型进化史 <em>AI Log</em></h2>
          <div className="retro-chapter-sub">TRACKING LLM EVOLUTION. MAJOR MILESTONES.</div>
        </div>
      </div>

      <div style={{ marginTop: 40, position: 'relative', zIndex: 10 }}>
        <TimelineView entries={entries} />
      </div>
    </section>
  );
}
