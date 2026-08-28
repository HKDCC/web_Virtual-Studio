import "./retro.css";
import { RetroHeader } from "@/components/retro/RetroHeader";
import { RetroFooter } from "@/components/retro/RetroFooter";

export const metadata = {
  title: "VS_SYS // EDITORIAL",
  description: "Vintage Print Interface",
};

export default function RetroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="retro-theme">
      <div className="retro-layout">
        <RetroHeader />
        <main className="retro-main">
          {children}
          <RetroFooter />
        </main>
      </div>
    </div>
  );
}
