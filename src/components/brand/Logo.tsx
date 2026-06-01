import { cn } from "@/lib/utils";
import logoAsset from "@/assets/aline-logo.asset.json";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function Logo({ className, variant = "light", size = "md", showWordmark = false }: LogoProps) {
  const sizes = {
    sm: { box: "h-10 w-10", main: "text-base", sub: "text-[10px]" },
    md: { box: "h-14 w-14", main: "text-xl", sub: "text-[11px]" },
    lg: { box: "h-20 w-20", main: "text-3xl", sub: "text-xs" },
  };
  const s = sizes[size];
  const text = variant === "light" ? "text-primary-foreground" : "text-primary";
  const gold = "text-gold";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logoAsset.url}
        alt="Aline Home Spa Prime"
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-gold/40",
          s.box,
        )}
      />
      {showWordmark && (
        <div className="leading-tight">
          <div className={cn("font-display italic font-semibold", s.main, gold)}>Aline</div>
          <div className={cn("font-sans tracking-[0.25em] uppercase", s.sub, text)}>
            Home Spa Prime
          </div>
        </div>
      )}
    </div>
  );
}
