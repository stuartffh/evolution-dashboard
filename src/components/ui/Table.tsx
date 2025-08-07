/**
 * Sistema de Tabelas Unificado - ZapChatBR
 */

import { ReactNode } from 'react';

// ============ TABLE COMPONENTS ============
interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "" }: TableProps) {
  return (
    <thead className={`bg-white/5 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }: TableProps) {
  return (
    <tbody className={`divide-y divide-white/5 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", onClick }: TableProps & { onClick?: () => void }) {
  const baseClasses = "transition-colors duration-150";
  const hoverClasses = onClick ? "hover:bg-white/5 cursor-pointer" : "hover:bg-white/5";
  
  return (
    <tr 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps extends TableProps {
  colSpan?: number;
}

export function TableCell({ children, className = "", colSpan }: TableCellProps) {
  return (
    <td className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-300 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

export function TableHeaderCell({ children, className = "" }: TableProps) {
  return (
    <th className={`text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

// ============ TABLE CELL VARIANTS ============
interface TableCellContentProps {
  children: ReactNode;
  className?: string;
}

export function TableCellAvatar({ 
  name, 
  image, 
  subtitle,
  className = "" 
}: { 
  name: string; 
  image?: string; 
  subtitle?: string;
  className?: string;
}) {
  return (
    <TableCell className={className}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0">
          {image ? (
            <img src={image} alt={name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <span className="text-white font-medium text-xs sm:text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-medium text-sm sm:text-base truncate">{name}</p>
          {subtitle && (
            <p className="text-gray-400 text-xs sm:text-sm truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </TableCell>
  );
}

export function TableCellBadge({ 
  text, 
  variant = 'default',
  icon,
  className = "" 
}: { 
  text: string; 
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  icon?: ReactNode;
  className?: string;
}) {
  const variants = {
    success: "bg-green-900 text-green-300 border-green-700",
    warning: "bg-yellow-900 text-yellow-300 border-yellow-700", 
    danger: "bg-red-900 text-red-300 border-red-700",
    info: "bg-blue-900 text-blue-300 border-blue-700",
    default: "bg-gray-900 text-gray-300 border-gray-700"
  };

  return (
    <TableCell className={className}>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
        {icon && <span className="mr-1">{icon}</span>}
        {text}
      </span>
    </TableCell>
  );
}

export function TableCellActions({ children, className = "" }: TableCellContentProps) {
  return (
    <TableCell className={`text-right ${className}`}>
      <div className="flex justify-end gap-2">
        {children}
      </div>
    </TableCell>
  );
}

// ============ TABLE STATES ============
interface TableEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  colSpan: number;
}

export function TableEmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  colSpan 
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 sm:py-12">
        {icon && (
          <div className="mx-auto mb-4 flex justify-center text-gray-400">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-400 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 mb-6">
            {description}
          </p>
        )}
        {action && action}
      </TableCell>
    </TableRow>
  );
}

export function TableLoadingState({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 sm:py-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-400"></div>
          <span className="ml-3 text-gray-400 text-sm sm:text-base">Carregando...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ============ ACTION BUTTONS ============
interface ActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  title?: string;
  className?: string;
}

export function ActionButton({ 
  onClick, 
  icon, 
  variant = 'primary', 
  title,
  className = "" 
}: ActionButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-600 hover:bg-gray-700",
    danger: "bg-red-600 hover:bg-red-700"
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 sm:p-2 rounded-lg text-white transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      <div className="h-3 w-3 sm:h-4 sm:w-4">
        {icon}
      </div>
    </button>
  );
}