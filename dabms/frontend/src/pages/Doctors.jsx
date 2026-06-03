import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DoctorCard from '../components/patient/DoctorCard';
import { Spinner, EmptyState, Pagination } from '../components/common/UI';


const SPECIALITIES = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist',
  'Cardiologist', 'Orthopedic', 'Ophthalmologist', 'Psychiatrist',
];

const Doctors = () => {
  const [searchParams, setSearchParams]  = useSearchParams();
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const speciality = searchParams.get('speciality') || '';
  const { doctors, loadingDoctors, fetchDoctors } = useApp();

  useEffect(() => {
    const load = async () => {
      const data = await fetchDoctors({ speciality, search, page, limit: 12 });
      setTotal(data.total);
      setTotalPages(data.totalPages);
    };
    load();
  }, [speciality, page, fetchDoctors]);

  const handleSpecialityClick = (s) => {
    setPage(1);
    if (speciality === s) setSearchParams({});
    else setSearchParams({ speciality: s });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors({ speciality, search, page: 1, limit: 12 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-dark mb-2">Find a Doctor</h1>
        <p className="text-muted">Browse {total} verified specialists</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Specialities</h3>
          <div className="space-y-1">
            <button
              onClick={() => handleSpecialityClick('')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                !speciality ? 'bg-teal-50 text-primary border border-teal-200' : 'text-muted hover:text-dark hover:bg-slate-100'
              }`}
            >
              All Doctors
            </button>
            {SPECIALITIES.map((s) => (
              <button
                key={s}
                onClick={() => handleSpecialityClick(s)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  speciality === s ? 'bg-teal-50 text-primary border border-teal-200' : 'text-muted hover:text-dark hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{s}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name…"
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary px-6 py-3">Search</button>
            </div>
          </form>

          {/* Results */}
          {loadingDoctors ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : doctors.length === 0 ? (
            <EmptyState title="No doctors found" description="Try adjusting your search or filter." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 animate-stagger">
                {doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
