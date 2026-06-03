import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isDoctor } = useAuth();
     const [menuOpen,    setMenuOpen]    = useState(false);
         const [profileOpen, setProfileOpen] = useState(false);
    const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { label: 'Home',       to: '/' },
      { label: 'About us',   to: '/about' },
       { label: 'Contact us', to: '/contact' },
    { label: 'Services',   to: '/doctors' },
  ];

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (isAdmin)  return '/admin/dashboard';
    if (isDoctor) return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-300 hover:scale-[1.02]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-700 flex items-center justify-center shadow-md shadow-teal-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h3l2-7 4 14 3-9 2 2h4" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-dark">
              DAB<span className="text-primary font-light">MS</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 text-sm font-medium transition-colors group ${
                  isActive(link.to) ? 'text-primary' : 'text-muted hover:text-dark'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-[20px] left-0 w-full h-[2px] bg-primary rounded-t-md" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                >
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${getAvatarColor(user?.name)} flex items-center justify-center text-white text-xs font-bold`}>
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-dark leading-none">
                      {user?.name?.replace(/^Dr\.?\s*/i, '').split(' ')[0]}
                    </p>
                  </div>
                  <svg className={`w-4 h-4 text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 animate-fade-in">
                    <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-dark hover:bg-slate-50 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-dark hover:bg-slate-50 transition-colors">
                      My Profile
                    </Link>
                    <div className="border-t border-slate-200 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-muted hover:text-dark text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-100">Login</Link>
                <Link to="/doctors" className="btn-primary px-5 py-2.5 text-sm rounded-xl">
                  Book Appointment
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-muted transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1 animate-fade-in shadow-lg">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.to) ? 'bg-teal-50 text-primary' : 'text-muted hover:text-dark hover:bg-slate-50'
              }`}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="btn-secondary text-center text-sm py-2">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-danger text-center text-sm py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"   onClick={() => setMenuOpen(false)} className="btn-secondary text-center text-sm py-2">Login</Link>
                <Link to="/doctors" onClick={() => setMenuOpen(false)} className="btn-primary text-center font-bold text-sm py-2 rounded-xl">Book Appointment</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
