import { cn } from "@/lib/cn";

export function Header({
  left,
  center,
  right,
  className,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/90 border-b border-[var(--border)]",
        className
      )}
    >
      <div className="mx-auto" style={{ maxWidth: 560, paddingLeft: 16, paddingRight: 16 }}>
        <div className="h-12 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 flex items-center gap-2">{left}</div>
          <div className="min-w-0 flex-1 flex items-center justify-center font-[700] text-[15px]">{center}</div>
          <div className="min-w-0 flex-1 flex items-center justify-end gap-2">{right}</div>
        </div>
      </div>
    </div>
  );
}

