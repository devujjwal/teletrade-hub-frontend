import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'warning';
  className?: string;
}

export function Alert({ children, variant = 'default', className }: AlertProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        variant === 'default' && 'bg-background text-foreground',
        variant === 'destructive' && 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        variant === 'warning' && 'border-warning/50 bg-warning/10 text-warning',
        className
      )}
    >
      {children}
    </div>
  );
}

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
      {children}
    </div>
  );
}
