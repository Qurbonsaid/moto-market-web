import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  variant?: 'default' | 'success' | 'danger';
}

export function StatsCard({ title, value, subtitle, variant = 'default' }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className={cn(
        "text-3xl font-bold mb-1",
        variant === 'success' && "text-success",
        variant === 'danger' && "text-destructive"
      )}>
        {value}
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
