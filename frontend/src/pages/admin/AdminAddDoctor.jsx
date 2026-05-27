import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const SPECIALITIES = [
  'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians',
  'Neurologist', 'Gastroenterologist', 'Cardiologist', 'Orthopedic',
  'Ophthalmologist', 'Psychiatrist', 'ENT Specialist', 'Dentist',
];

const AdminAddDoctor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', gender: '',
    speciality: '', degree: '', experience: '', about: '', fees: '',
    address: { line1: '', line2: '' },
  });
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState('');
  const [saving,  setSaving]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'address') fd.append('address', JSON.stringify(v));
        else fd.append(k, v);
      });
      if (image) fd.append('profileImage', image);

      await api.post('/admin/doctors', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Doctor added successfully!');
      navigate('/admin/doctors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Add New Doctor</h1>
        <p className="page-subtitle">Create a verified doctor account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="card">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Profile Photo</h3>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                : <span className="text-3xl text-slate-400">👨‍⚕️</span>}
            </div>
            <div>
              <label className="btn-secondary py-2 px-4 text-sm cursor-pointer">
                Upload Photo
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
              <p className="text-muted text-xs mt-2">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card space-y-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Dr. John Smith" className="input-field" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="doctor@example.com" className="input-field" />
            </div>
            <div>
              <label className="label">Password *</label>
              <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="input-field" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" className="input-field" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {}
        <div className="card space-y-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Professional Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Speciality *</label>
              <select name="speciality" required value={form.speciality} onChange={handleChange} className="input-field">
                <option value="">Select speciality</option>
                {SPECIALITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Degree *</label>
              <input type="text" name="degree" required value={form.degree} onChange={handleChange} placeholder="MBBS, MD, etc." className="input-field" />
            </div>
            <div>
              <label className="label">Experience (years) *</label>
              <input type="number" name="experience" required min={0} value={form.experience} onChange={handleChange} placeholder="5" className="input-field" />
            </div>
            <div>
              <label className="label">Consultation Fee (zł) *</label>
              <input type="number" name="fees" required min={0} step="0.01" value={form.fees} onChange={handleChange} placeholder="50.00" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">About</label>
            <textarea name="about" value={form.about} onChange={handleChange} rows={3}
              placeholder="Brief professional description…" className="input-field resize-none" />
          </div>
        </div>

        {}
        <div className="card space-y-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Clinic Address</h3>
          <div>
            <label className="label">Address Line 1</label>
            <input type="text" name="address.line1" value={form.address.line1} onChange={handleChange} placeholder="Street address" className="input-field" />
          </div>
          <div>
            <label className="label">Address Line 2</label>
            <input type="text" name="address.line2" value={form.address.line2} onChange={handleChange} placeholder="City, State, ZIP" className="input-field" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/admin/doctors')} className="btn-secondary flex-1 py-3">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
            {saving ? 'Adding…' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddDoctor;
