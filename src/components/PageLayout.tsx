"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageLayout({ 
  children, 
  title, 
  subtitle, 
  className = "" 
}: PageLayoutProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-sm lg:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* Page Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}