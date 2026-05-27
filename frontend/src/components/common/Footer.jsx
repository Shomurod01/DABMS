import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-700 flex items-center justify-center shadow-md shadow-teal-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h3l2-7 4 14 3-9 2 2h4" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-dark">
              Med<span className="text-primary font-light">Sync</span>
            </span>
          </Link>
          <p className="text-muted text-sm leading-relaxed">
            Your trusted platform for booking and managing doctor appointments with ease.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-dark font-semibold text-sm mb-4">Platform</h4>
          <ul className="space-y-2.5">
            {[['Doctors', '/doctors'], ['About', '/about'], ['Contact', '/contact']].map(([label, to]) => (
              <li key={to}><Link to={to} className="text-muted hover:text-primary text-sm transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-dark font-semibold text-sm mb-4">Account</h4>
          <ul className="space-y-2.5">
            {[['Login', '/login'], ['Register', '/register'], ['Dashboard', '/patient/dashboard']].map(([label, to]) => (
              <li key={to}><Link to={to} className="text-muted hover:text-primary text-sm transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-dark font-semibold text-sm mb-4">Specialities</h4>
          <ul className="space-y-2.5">
            {['General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist'].map((s) => (
              <li key={s}><Link to={`/doctors?speciality=${s}`} className="text-muted hover:text-primary text-sm transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-muted text-sm">© {new Date().getFullYear()} MedSync. All rights reserved.</p>
        <p className="text-slate-400 text-xs">Built with MERN Stack · Secured with JWT</p>
      </div>
    </div>
  </footer>
);

export default Footer;
