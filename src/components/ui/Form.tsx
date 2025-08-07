/**
 * Sistema de Formulários Unificado - ZapChatBR
 */

import { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// ============ FORM FIELD WRAPPER ============
interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({ label, error, required, className = "", children }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

// ============ INPUT COMPONENTS ============
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className = "", error, ...props }: InputProps) {
  const baseClasses = "w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
  
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-500" 
    : "border-white/20 hover:border-white/30 focus:border-purple-500";
  
  return (
    <input 
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
}

// ============ SELECT COMPONENT ============
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: ReactNode;
}

export function Select({ className = "", error, children, ...props }: SelectProps) {
  const baseClasses = "w-full bg-white/5 border rounded-lg px-4 py-3 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
  
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-500" 
    : "border-white/20 hover:border-white/30 focus:border-purple-500";
  
  return (
    <select 
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

// ============ TEXTAREA COMPONENT ============
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ className = "", error, ...props }: TextareaProps) {
  const baseClasses = "w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none";
  
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-500" 
    : "border-white/20 hover:border-white/30 focus:border-purple-500";
  
  return (
    <textarea 
      className={`${baseClasses} ${errorClasses} ${className}`}
      rows={4}
      {...props}
    />
  );
}

// ============ OPTION COMPONENT ============
interface OptionProps {
  value: string;
  children: ReactNode;
}

export function Option({ value, children }: OptionProps) {
  return (
    <option value={value} className="bg-slate-800 text-white">
      {children}
    </option>
  );
}

// ============ FORM LAYOUTS ============
interface FormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function Form({ children, onSubmit, className = "" }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 sm:space-y-6 ${className}`}>
      {children}
    </form>
  );
}

export function FormSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
}

export function FormGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function FormActions({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
}

// ============ INPUT VARIANTS ============
export function EmailInput(props: InputProps) {
  return <Input type="email" placeholder="exemplo@email.com" {...props} />;
}

export function PasswordInput(props: InputProps) {
  return <Input type="password" placeholder="Digite sua senha" {...props} />;
}

export function TextInput(props: InputProps) {
  return <Input type="text" {...props} />;
}

export function SearchInput(props: InputProps) {
  return <Input type="search" placeholder="Buscar..." {...props} />;
}