import "./demo_0.css";
import { Demo0Header } from "./components/Demo0Header";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Virtual Studio (demo_0 备份)",
  description: "Virtual Studio 前端旧版归档备份",
};

export default function Demo0Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="demo_0-wrapper">
      <Demo0Header />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
