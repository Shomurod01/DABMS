import { getInitials, getAvatarColor, statusConfig } from '../../utils/helpers';


export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg className="animate-spin w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
};


export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-muted text-sm">Loading…</p>
    </div>
  </div>
);

export const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  const sizes = { xs: 'w-7 h-7 text-xs', sm: 'w-9 h-9 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl' };
  const radius = { xs: 'rounded-lg', sm: 'rounded-xl', md: 'rounded-xl', lg: 'rounded-2xl', xl: 'rounded-3xl' };

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} ${radius[size]} object-cover flex-shrink-0 ${className}`} />;
  }
  return (
    <div className={`${sizes[size]} ${radius[size]} ${getAvatarColor(name)} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  );
};


export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: 'badge bg-slate-100 text-slate-500' };
  return <span className={config.className}>{config.label}</span>;
};

export const EmptyState = ({ title = 'Nothing here', description = '', action }) => (
  <div className="text-center py-16 px-4">
    <h3 className="text-dark font-semibold text-lg mb-2">{title}</h3>
    {description && <p className="text-muted text-sm mb-6 max-w-sm mx-auto">{description}</p>}
    {action}
  </div>
);

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-sm text-muted hover:text-dark hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        ← Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
            p === currentPage ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark hover:bg-slate-100'
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-sm text-muted hover:text-dark hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        Next →
      </button>
    </div>
  );
};


export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-slide-up">
        <h3 className="text-lg font-semibold text-dark mb-2">{title}</h3>
        <p className="text-muted text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
          <button onClick={onConfirm} className={`${danger ? 'btn-danger' : 'btn-primary'} py-2 px-4 text-sm`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export const StatsCard = ({ label, value, color = 'bg-teal-50 text-teal-600', trend }) => (
  <div className="stat-card animate-slide-up">
    <div className={`stat-icon ${color}`} />
    <div className="flex-1 min-w-0">
      <p className="text-muted text-xs font-medium uppercase tracking-wider truncate">{label}</p>
      <p className="text-2xl font-bold text-dark mt-0.5">{value}</p>
      {trend && <p className="text-xs text-primary mt-0.5">{trend}</p>}
    </div>
  </div>
);
