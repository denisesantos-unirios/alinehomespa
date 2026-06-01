import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, variant = "light", size = "md" }: LogoProps) {
  const sizes = {
    sm: { box: "h-10 w-10", main: "text-base", sub: "text-[10px]" },
    md: { box: "h-14 w-14", main: "text-xl", sub: "text-[11px]" },
    lg: { box: "h-20 w-20", main: "text-3xl", sub: "text-xs" },
  };
  const s = sizes[size];
  const text = variant === "light" ? "text-primary-foreground" : "text-primary";
  const gold = variant === "light" ? "text-gold" : "text-gold";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-2",
          s.box,
          variant === "light"
            ? "border-gold/60 bg-primary/40"
            : "border-primary/20 bg-primary/5",
        )}
      >
        <svg viewBox="0 0 24 24" className={cn("h-1/2 w-1/2", gold)} fill="currentColor">
          <path d="M12 2c-1 4-4 6-7 7 3 1 6 3 7 7 1-4 4-6 7-7-3-1-6-3-7-7z" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={cn("font-display italic font-semibold", s.main, gold)}>Aline</div>
        <div className={cn("font-sans tracking-[0.25em] uppercase", s.sub, text)}>
          Home Spa Prime
        </div>
      </div>
    </div>
  );
}
