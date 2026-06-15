import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
};

export default function GlassCard({ children, className = '', onClick, hover = false }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl ${hover ? 'cursor-pointer hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] transition-all duration-300' : ''} ${onClick && !hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
