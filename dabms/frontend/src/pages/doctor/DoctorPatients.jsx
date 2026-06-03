import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Spinner, EmptyState, Avatar } from '../../components/common/UI';
import AppointmentCard from '../../components/common/AppointmentCard';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory]                 = useState([]);
  const [historyLoading, setHistoryLoading]   = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const { data } = await api.get('/doctor/me/patients');
        setPatients(data.patients);
      } catch {
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const loadHistory = async (patient) => {
    setSelectedPatient(patient);
    setHistoryLoading(true);
    try {
      const { data } = await api.get(`/doctor/me/patient/${patient._id}/history`);
      setHistory(data.history);
    } catch {
      toast.error('Failed to load patient history');
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Patients</h1>
        <p className="page-subtitle">View your patients and their medical history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="md:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold text-dark mb-4">Patient List</h2>
          {patients.length === 0 ? (
             <EmptyState title="No patients yet" description="Patients will appear here after booking an appointment." />
          ) : (
            patients.map((p) => (
              <div 
                key={p._id}
                onClick={() => loadHistory(p)}
                className={`card p-4 cursor-pointer transition-colors hover:border-teal-200 shadow-sm ${selectedPatient?._id === p._id ? 'border-primary bg-teal-50' : 'border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar src={p.profileImage} name={p.name} size="md" />
                  <div>
                    <p className="font-semibold text-dark">{p.name}</p>
                    <p className="text-muted text-xs">{p.gender} • {p.dob ? formatDate(p.dob) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Patient History */}
        <div className="md:col-span-2">
          {selectedPatient ? (
            <div className="card h-full min-h-[400px] border border-slate-200 shadow-xl">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <Avatar src={selectedPatient.profileImage} name={selectedPatient.name} size="lg" />
                <div>
                  <h2 className="text-xl font-bold text-dark">{selectedPatient.name}'s History</h2>
                  <p className="text-muted text-sm">{selectedPatient.email} • {selectedPatient.phone}</p>
                </div>
              </div>

              {historyLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : history.length === 0 ? (
                 <EmptyState title="No history found" description="There are no past appointments for this patient." />
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <h3 className="font-semibold text-dark mb-2">Past Appointments</h3>
                  {history.map(app => (
                    <div key={app._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-dark font-medium">{formatDate(app.slotDate)} at {app.slotTime}</p>
                          <p className="text-sm text-muted mt-1">Status: <span className={`capitalize font-medium ${app.status === 'completed' ? 'text-teal-600' : 'text-slate-600'}`}>{app.status}</span></p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-slate-600">Reason / Notes:</p>
                           <p className="text-xs text-muted max-w-[200px] truncate">{app.notes || 'No notes provided'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full min-h-[400px] flex flex-col items-center justify-center text-center border border-slate-200 border-dashed">
              <span className="text-4xl mb-4 text-slate-300"></span>
              <h3 className="text-lg font-semibold text-dark">Select a Patient</h3>
              <p className="text-muted max-w-sm mt-2">Click on a patient from the list to view their full medical history and past appointments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
