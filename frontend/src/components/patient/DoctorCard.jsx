import { Link } from 'react-router-dom';
import { Avatar } from '../common/UI';
import { specialityIcons, formatCurrency } from '../../utils/helpers';

const DoctorCard = ({ doctor }) => {
  const { user, speciality, experience, fees, available } = doctor;

  return (
    <Link
      to={`/doctors/${doctor._id}`}
      className="card group flex flex-col gap-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar src={user?.profileImage} name={user?.name} size="lg" />
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${available ? 'bg-teal-500' : 'bg-slate-300'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-dark text-base truncate group-hover:text-primary transition-colors">
            {user?.name?.toLowerCase().startsWith('dr.') ? user.name : `Dr. ${user?.name}`}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-base">{specialityIcons[speciality] || ''}</span>
            <span className="text-muted text-sm truncate">{speciality}</span>
          </div>
          <p className="text-muted text-xs mt-1">{experience} yr{experience !== 1 ? 's' : ''} experience</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <p className="text-xs text-muted">Consultation fee</p>
          <p className="text-primary font-semibold">{formatCurrency(fees)}</p>
        </div>
        <span className={`badge ${available ? 'badge-completed' : 'bg-slate-100 text-slate-400'}`}>
          {available ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </Link>
  );
};

export default DoctorCard;
