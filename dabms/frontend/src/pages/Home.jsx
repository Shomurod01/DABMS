import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DoctorCard from '../components/patient/DoctorCard';
import { Spinner } from '../components/common/UI';


const SPECIALITIES = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist',
];

const Home = () => {
  const { doctors, loadingDoctors, fetchDoctors } = useApp();
  const navigate = useNavigate();

  useEffect(() => { fetchDoctors({ limit: 8 }); }, [fetchDoctors]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-sm text-teal-700 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Trusted by 10,000+ patients
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-dark leading-tight mb-6 animate-slide-up">
            Premium Treatment <br />
            for a <span className="text-primary">Healthy Lifestyle</span>
          </h1>

          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect with verified specialist doctors, view availability in real-time, and secure your appointment in under 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/doctors" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2 justify-center rounded-xl shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-transform">
              Browse Doctors →
            </Link>
            <Link to="/register" className="btn-secondary text-base px-8 py-4">
              Create Free Account
            </Link>
          </div>


        </div>
      </section>

      {/* ── Specialities ─────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-dark mb-3">Browse by Speciality</h2>
            <p className="text-muted">Find the right specialist for your needs</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-stagger">
            {SPECIALITIES.map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/doctors?speciality=${s}`)}
                className="card flex flex-col items-center gap-3 py-6 cursor-pointer group"
              >
                <span className="text-muted text-xs font-medium text-center leading-tight group-hover:text-primary transition-colors">{s}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Doctors ──────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl text-dark mb-2">Top Rated Doctors</h2>
              <p className="text-muted">Verified specialists ready to help you</p>
            </div>
            <Link to="/doctors" className="btn-secondary py-2 px-5 text-sm hidden sm:flex">
              View All →
            </Link>
          </div>

          {loadingDoctors ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-stagger">
              {doctors.slice(0, 8).map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/doctors" className="btn-secondary px-6 py-2.5 text-sm">View All Doctors</Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-dark mb-3">How It Works</h2>
            <p className="text-muted">Get an appointment in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-stagger">
            {[
              { step: '01', title: 'Search Doctor', desc: 'Browse our list of verified specialist doctors by speciality or name.' },
              { step: '02', title: 'Book a Slot',   desc: 'Choose a convenient date and time from available appointment slots.' },
              { step: '03', title: 'Pay & Confirm', desc: 'Complete payment via PayPal and receive instant confirmation.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card text-center relative overflow-hidden group">

                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold font-mono text-lg">{step}</span>
                </div>
                <h3 className="font-semibold text-dark mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl py-14 px-8 shadow-xl shadow-teal-500/20">
            <h2 className="font-display text-4xl text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/80 mb-8">Create your free account and book your first appointment today.</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-10 py-4 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:scale-95">
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
