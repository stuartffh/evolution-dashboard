"use client";

import { ReactNode } from "react";

interface ResponsiveCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  noPadding?: boolean;
}

export default function ResponsiveCard({ 
  children, 
  title, 
  className = "", 
  noPadding = false 
}: ResponsiveCardProps) {
  return (
    <div className={`
      bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg
      hover:border-white/20 transition-all duration-300
      ${!noPadding ? 'p-4 lg:p-6' : ''}
      ${className}
    `}>
      {title && (
        <div className={`${!noPadding ? '' : 'p-4 lg:p-6 pb-0'} mb-4`}>
          <h2 className="text-xl lg:text-2xl font-semibold text-white">
            {title}
          </h2>
        </div>
      )}
      
      <div className={noPadding && title ? 'px-4 lg:px-6 pb-4 lg:pb-6' : ''}>
        {children}
      </div>
    </div>
  );
}