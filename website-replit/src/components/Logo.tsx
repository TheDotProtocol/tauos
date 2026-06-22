import { site } from "@/content/site";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
};

const heights = { sm: "h-7", md: "h-8", lg: "h-10" };

export default function Logo({ className = "", showWordmark = true, size = "md" }: LogoProps) {
  return (
    <a href="/" className={`flex items-center gap-3 ${className}`} aria-label={site.name}>
      <img
        src="/brand/tauos-logo.svg"
        alt={`${site.name} logo`}
        className={`${heights[size]} w-auto`}
      />
      {showWordmark && (
        <span className="font-bold text-xl tracking-wider text-white">{site.brand.replace("™", "")}</span>
      )}
    </a>
  );
}
