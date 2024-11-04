import { cn } from "@/lib/utils";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "px-1.5 py-0.5 h-6 flex items-center justify-center text-xs text-secondary-foreground bg-background border border-border rounded-md shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
} 