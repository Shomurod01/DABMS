import { Avatar, StatusBadge } from '../common/UI';
import { formatDate, formatCurrency } from '../../utils/helpers';

const AppointmentCard = ({ appointment, onCancel, onComplete, onConfirm, role = 'patient' }) => {
  const { doctorData, patientData, slotDate, slotTime, status, amount, payment, _id } = appointment;

  const canCancel   = ['pending', 'confirmed'].includes(status);
     const canComplete = role === 'doctor' && status === 'confirmed';
        const canConfirm  = role === 'doctor' && status === 'pending';

  const displayName  = role === 'patient' ? doctorData?.name  : patientData?.name;
        const displayImage = role === 'patient' ? doctorData?.image : patientData?.image;
            const displaySub   = role === 'patient' ? doctorData?.speciality : patientData?.gender;

  return (
    <div className="card flex flex-col sm:flex-row gap-4">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Avatar src={displayImage} name={displayName} size="md" />
        <div className="min-w-0">
          <p className="font-semibold text-dark truncate">
            {role === 'patient' ? (displayName?.toLowerCase().startsWith('dr.') ? displayName : `Dr. ${displayName}`) : displayName}
          </p>
          <p className="text-muted text-sm truncate">{displaySub}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-xs text-muted">{formatDate(slotDate)}</span>
            <span className="text-xs text-muted">{slotTime}</span>
          </div>
        </div>
      </div>

      {/* Status + Amount + Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <StatusBadge status={status} />
          <StatusBadge status={payment?.status} />
        </div>
        <p className="text-primary font-semibold text-sm">{formatCurrency(amount)}</p>
        <div className="flex items-center gap-2">
          {canConfirm && (
            <button onClick={() => onConfirm?.(_id)} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors font-medium">
              Confirm
            </button>
          )}
          {canComplete && (
            <button onClick={() => onComplete?.(_id)} className="text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors font-medium">
              Complete
            </button>
          )}
          {canCancel && (
            <button onClick={() => onCancel?.(_id)} className="text-xs bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors font-medium">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
