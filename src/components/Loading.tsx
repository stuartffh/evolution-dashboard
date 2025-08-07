'use client';

import { ReactNode } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-purple-400 border-t-transparent"></div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: ReactNode;
}

export function LoadingOverlay({ isLoading, message = 'Carregando...', children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <div className="flex flex-col items-center space-y-3 text-white">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({ 
  isLoading, 
  loadingText = 'Carregando...', 
  children, 
  className = '', 
  disabled = false,
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        flex items-center justify-center gap-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
}

interface LoadingCardProps {
  isLoading: boolean;
  loadingMessage?: string;
  children: ReactNode;
  className?: string;
}

export function LoadingCard({ 
  isLoading, 
  loadingMessage = 'Carregando dados...', 
  children, 
  className = '' 
}: LoadingCardProps) {
  if (isLoading) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 text-sm">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return <div className={`card ${className}`}>{children}</div>;
}