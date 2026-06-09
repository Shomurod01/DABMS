import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from './UI';

const Sidebar = ({ links, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-slate-200">
      {}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-700 flex items-center justify-center shadow-md shadow-teal-500/20 transition-transform hover:scale-105">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h3l2-7 4 14 3-9 2 2h4" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-dark">
            DAB<span className="text-primary font-light">MS</span>
          </span>
        </div>
      </div>

      {}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Avatar src={user?.profileImage} name={user?.name} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-dark truncate">{user?.name}</p>
            <p className="text-xs text-muted capitalize">{role} Panel</p>
          </div>
        </div>
      </div>

      {}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {}
      <div className="p-3 border-t border-slate-200">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50">
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
