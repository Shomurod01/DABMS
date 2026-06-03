import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Avatar } from '../../components/common/UI';
import { toast } from 'react-toastify';

const SPECIALITIES = [
  'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians',
  'Neurologist', 'Gastroenterologist', 'Cardiologist', 'Orthopedic',
  'Ophthalmologist', 'Psychiatrist', 'ENT Specialist', 'Dentist',
];

const DoctorProfile = () => {
  const [form, setForm] = useState({
    speciality: '', degree: '', experience: '', about: '',
    fees: '', available: true, address: { line1: '', line2: '' },
  });
  const [userForm,  setUserForm]  = useState({ name: '', phone: '', gender: '' });
  const [image,     setImage]     = useState(null);
  const [preview,   setPreview]   = useState('');
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/auth/me');
        const u = data.user;
        const d = data.doctorProfile;
        setUserForm({ name: u.name || '', phone: u.phone || '', gender: u.gender || '' });
        setPreview(u.profileImage || '');
        if (d) {
          setForm({
            speciality:  d.speciality  || '',
            degree:      d.degree      || '',
            experience:  d.experience  || '',
            about:       d.about       || '',
            fees:        d.fees        || '',
            available:   d.available   ?? true,
            address:     d.address     || { line1: '', line2: '' },
          });
        }
      } catch {
        toast.error('Failed to load profile');
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, address: { ...p.address, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      // Update user info first
      await api.put('/auth/update-profile', { name: userForm.name, phone: userForm.phone, gender: userForm.gender });

      // Update doctor profile
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'address') fd.append('address', JSON.stringify(v));
        else fd.append(k, v);
      });
      if (image) fd.append('profileImage', image);
      await api.put('/doctor/me/update-profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Update your professional information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <div className="card">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Profile Photo</h3>
          <div className="flex items-center gap-5">
            <Avatar src={preview} name={userForm.name} size="xl" />
            <div>
              <label className="btn-secondary py-2 px-4 text-sm cursor-pointer">
                Change Photo
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Personal */}
        <div className="card space-y-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" value={userForm.phone} onChange={(e) => setUserForm((p) => ({ ...p, phone: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select value={userForm.gender} onChange={(e) => setUserForm((p) => ({ ...p, gender: e.target.value }))} className="input-field">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional */}
        <div className="card space-y-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Professional Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Speciality</label>
              <select name="speciality" value={form.speciality} onChange={handleChange} className="input-field">
                <option value="">Select</option>
                {SPECIALITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Degree</label>
              <input type="text" name="degree" value={form.degree} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Experience (years)</label>
              <input type="number" name="experience" min={0} value={form.experience} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Consultation Fee (zł)</label>
              <input type="number" name="fees" min={0} step="0.01" value={form.fees} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">About</label>
            <textarea name="about" value={form.about} onChange={handleChange} rows={3} className="input-field resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-11 h-6 rounded-full transition-colors relative ${form.available ? 'bg-primary' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.available ? 'left-6' : 'left-1'}`} />
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="hidden" />
            </div>
            <span className="text-sm text-slate-600">Available for appointments</span>
          </label>
        </div>

        <div>
          <label className="label">Clinic Address</label>
          <input type="text" name="address.line1" value={form.address.line1} onChange={handleChange} placeholder="Street" className="input-field mb-2" />
          <input type="text" name="address.line2" value={form.address.line2} onChange={handleChange} placeholder="City, State" className="input-field" />
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3.5">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;
