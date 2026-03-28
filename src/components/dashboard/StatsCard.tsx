import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  variant = 'default' 
}) => {
  const iconVariants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium flex items-center gap-1",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% from last month</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
