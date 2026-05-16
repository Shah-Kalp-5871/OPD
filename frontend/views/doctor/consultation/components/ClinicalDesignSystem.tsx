import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; subtitle?: string; headerAction?: React.ReactNode }> = ({ children, className = '', title, subtitle, headerAction }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {(title || subtitle || headerAction) && (
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          {title && <h3 className="text-slate-900 font-bold text-sm tracking-tight">{title}</h3>}
          {subtitle && <p className="text-slate-500 text-[11px] font-medium mt-0.5">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', size = 'md', className = '', icon, loading, disabled }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-3 text-sm"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate'; className?: string }> = ({ children, variant = 'slate', className = '' }) => {
  const variants = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200"
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }> = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">{label}</label>}
    <input 
      {...props} 
      className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none ${className}`} 
    />
    {error && <p className="text-[10px] font-medium text-rose-500 ml-1">{error}</p>}
  </div>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }> = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">{label}</label>}
    <textarea 
      {...props} 
      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none min-h-[120px] resize-none ${className}`} 
    />
    {error && <p className="text-[10px] font-medium text-rose-500 ml-1">{error}</p>}
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-slate-900 font-extrabold text-lg tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 text-xs font-medium">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
