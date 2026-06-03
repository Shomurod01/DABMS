import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Avatar, Spinner } from '../components/common/UI';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', gender: '', dob: '',
    address: { line1: '', line2: '' },
  });
  const [image,    setImage]    = useState(null);
  const [preview,  setPreview]  = useState('');
  const [pwdForm,  setPwdForm]  = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name:    user.name    || '',
        phone:   user.phone   || '',
        gender:  user.gender  || '',
        dob:     user.dob ? user.dob.split('T')[0] : '',
        address: user.address || { line1: '', line2: '' },
      });
      setPreview(user.profileImage || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, address: { ...p.address, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'address') fd.append('address', JSON.stringify(v));
      else fd.append(k, v);
    });
    if (image) fd.append('profileImage', image);
    await updateProfile(fd);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) {
      toast.error('Passwords do not match'); return;
    }
    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword:     pwdForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information</p>
      </div>

      {/* Profile Photo */}
      <div className="card mb-6">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Profile Photo</h3>
        <div className="flex items-center gap-5">
          <Avatar src={preview} name={user?.name} size="xl" />
          <div>
            <label className="btn-secondary py-2 px-4 text-sm cursor-pointer">
              Change Photo
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            <p className="text-muted text-xs mt-2">JPG, PNG. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="card mb-6 space-y-4">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={user?.email || ''} disabled className="input-field opacity-50 cursor-not-allowed bg-slate-50" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567" className="input-field" />
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
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div>
          <label className="label">Address Line 1</label>
          <input type="text" name="address.line1" value={form.address.line1} onChange={handleChange} placeholder="Street address" className="input-field" />
        </div>
        <div>
          <label className="label">Address Line 2</label>
          <input type="text" name="address.line2" value={form.address.line2} onChange={handleChange} placeholder="City, State, ZIP" className="input-field" />
        </div>
        <button type="submit" disabled={authLoading} className="btn-primary py-3 w-full">
          {authLoading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordSubmit} className="card space-y-4">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Change Password</h3>
        <div>
          <label className="label">Current Password</label>
          <input type="password" value={pwdForm.currentPassword}
            onChange={(e) => setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))}
            placeholder="••••••••" className="input-field" />
        </div>
        <div>
          <label className="label">New Password</label>
          <input type="password" value={pwdForm.newPassword}
            onChange={(e) => setPwdForm((p) => ({ ...p, newPassword: e.target.value }))}
            placeholder="Min. 6 characters" className="input-field" />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input type="password" value={pwdForm.confirm}
            onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))}
            placeholder="Repeat new password" className="input-field" />
        </div>
        <button type="submit" disabled={pwdLoading} className="btn-secondary py-3 w-full">
          {pwdLoading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
