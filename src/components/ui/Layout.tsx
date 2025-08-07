/**
 * Sistema de Layout Unificado - ZapChatBR
 * Baseado em design system moderno com glassmorphism
 */

import { ReactNode } from 'react';

// ============ LAYOUT CONTAINERS ============
interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${className}`}>
      {children}
    </div>
  );
}

export function ContentContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}>
      {children}
    </div>
  );
}

// ============ CARDS ============
interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  variant?: 'default' | 'glass' | 'dark';
}

export function Card({ children, className = "", noPadding = false, variant = 'glass' }: CardProps) {
  const baseClasses = "rounded-xl border transition-all duration-300 hover:border-white/20";
  
  const variants = {
    default: "bg-white/10 backdrop-blur-sm border-white/10",
    glass: "bg-black/40 backdrop-blur-sm border-white/10",
    dark: "bg-black/60 backdrop-blur-sm border-white/20"
  };

  const paddingClasses = noPadding ? "" : "p-4 sm:p-6";

  return (
    <div className={`${baseClasses} ${variants[variant]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
}

// ============ GRID SYSTEM ============
export function GridContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`grid gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function GridCols1({ children }: PageContainerProps) {
  return <div className="grid grid-cols-1 gap-4 sm:gap-6">{children}</div>;
}

export function GridCols2({ children }: PageContainerProps) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">{children}</div>;
}

export function GridCols3({ children }: PageContainerProps) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">{children}</div>;
}

export function GridCols4({ children }: PageContainerProps) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">{children}</div>;
}

// ============ HEADERS ============
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 ${className}`}>
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {actions}
        </div>
      )}
    </div>
  );
}

export function SectionHeader({ title, subtitle, actions, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6 ${className}`}>
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

// ============ NAVIGATION HEADER ============
interface NavHeaderProps {
  brand: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function NavHeader({ brand, subtitle, actions, className = "" }: NavHeaderProps) {
  return (
    <div className={`bg-black/20 backdrop-blur-sm border-b border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {brand}
            </h1>
            {subtitle && (
              <span className="hidden sm:block text-gray-400 text-sm">
                {subtitle}
              </span>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 sm:gap-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ FORM LAYOUTS ============
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGrid({ children, className = "" }: FormGroupProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function FormActions({ children, className = "" }: FormGroupProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 ${className}`}>
      {children}
    </div>
  );
}

// ============ EMPTY STATES ============
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-8 sm:py-12 ${className}`}>
      {icon && (
        <div className="mx-auto mb-4 flex justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-medium text-gray-400 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
}

// ============ LOADING STATES ============
export function PageLoading() {
  return (
    <div className="flex justify-center items-center py-8 sm:py-12">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-400"></div>
      <span className="ml-3 text-gray-400 text-sm sm:text-base">Carregando...</span>
    </div>
  );
}

// ============ RESPONSIVE UTILITIES ============
export function Stack({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {children}
    </div>
  );
}

export function Flex({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${className}`}>
      {children}
    </div>
  );
}

export function FlexBetween({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 ${className}`}>
      {children}
    </div>
  );
}