import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const StatCard = ({ title, value, icon: Icon, variant = 'primary' }: StatCardProps) => {
  const variants = {
    primary: 'from-primary to-secondary',
    secondary: 'from-secondary to-accent',
    success: 'from-success to-accent',
    warning: 'from-warning to-destructive',
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300">
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', variants[variant])} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-4xl font-bold text-foreground">{value}</p>
          </div>
          <div className={cn('p-4 rounded-xl bg-gradient-to-br', variants[variant])}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
