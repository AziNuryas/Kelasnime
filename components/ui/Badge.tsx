import { cn } from "@/lib/utils";

type BadgeVariant = "genre" | "status" | "platform" | "quality" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  genre:
    "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer",
  status: "text-white font-semibold",
  platform: "text-white text-[10px] font-semibold",
  quality:
    "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)]",
  default:
    "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)]",
};

export default function Badge({
  children,
  variant = "default",
  color,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn("badge", variantStyles[variant], className)}
      style={color ? { backgroundColor: color } : undefined}
    >
      {children}
    </span>
  );
}
