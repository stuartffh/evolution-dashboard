/**
 * Sistema de Botões Unificado - ZapChatBR
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from '../Loading';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "text-gray-300 hover:text-white hover:bg-white/5",
  outline: "border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3 text-base sm:text-lg"
};

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  loadingText,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const widthClass = fullWidth ? "w-full" : "";
  
  const finalClasses = `
    ${baseClasses} 
    ${buttonVariants[variant]} 
    ${buttonSizes[size]} 
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={finalClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      <span>{loading ? (loadingText || 'Carregando...') : children}</span>
    </button>
  );
}

// Componentes específicos para casos comuns
export function PrimaryButton(props: ButtonProps) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: ButtonProps) {
  return <Button {...props} variant="secondary" />;
}

export function DangerButton(props: ButtonProps) {
  return <Button {...props} variant="danger" />;
}

export function GhostButton(props: ButtonProps) {
  return <Button {...props} variant="ghost" />;
}

export function OutlineButton(props: ButtonProps) {
  return <Button {...props} variant="outline" />;
}

// Button Group para ações múltiplas
interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = "" }: ButtonGroupProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${className}`}>
      {children}
    </div>
  );
}