import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type SubPageLayoutProps = {
  children: ReactNode;
  /** Override wrapper classes (default: dark sub-page) */
  className?: string;
};

export default function SubPageLayout({
  children,
  className = "pt-20 min-h-screen bg-black text-white",
}: SubPageLayoutProps) {
  return (
    <>
      <Navigation />
      <div className={className}>{children}</div>
      <Footer />
    </>
  );
}
