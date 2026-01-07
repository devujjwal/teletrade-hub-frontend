'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-secondary-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-secondary-600 mb-4 text-center max-w-md">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

