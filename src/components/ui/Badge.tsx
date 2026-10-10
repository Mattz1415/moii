import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'red' | 'zinc';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'zinc',
  className = '',
}) => {
  const styles = {
    cyan: 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50',
    red: 'bg-red-950/60 text-red-400 border border-red-800/50',
    zinc: 'bg-zinc-900 text-zinc-300 border border-zinc-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
