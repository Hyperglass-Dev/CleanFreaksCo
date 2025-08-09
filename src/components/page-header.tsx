
import type React from 'react';

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <h1 className="text-2xl font-bold text-foreground font-headline tracking-tight sm:text-3xl">{title}</h1>
      {children && <div className="flex items-center gap-2 self-end sm:self-auto">{children}</div>}
    </div>
  );
}
