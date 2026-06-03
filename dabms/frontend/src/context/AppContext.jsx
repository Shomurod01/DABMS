import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [doctors,       setDoctors]       = useState([]);
  const [specialities,  setSpecialities]  = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const fetchDoctors = useCallback(async (params = {}) => {
    setLoadingDoctors(true);
    try {
      const { data } = await api.get('/doctor/list', { params });
      setDoctors(data.doctors);
      return data;
    } catch (err) {
      toast.error('Failed to load doctors');
      throw err;
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  const fetchSpecialities = useCallback(async () => {
    try {
      const { data } = await api.get('/doctor/specialities');
      setSpecialities(data.specialities);
    } catch {
   
    }
  }, []);

  return (
    <AppContext.Provider value={{
      doctors, specialities, loadingDoctors,
      fetchDoctors, fetchSpecialities,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
