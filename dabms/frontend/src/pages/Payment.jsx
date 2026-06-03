import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../utils/api';
import { Spinner } from '../components/common/UI';
import { formatCurrency, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const Payment = () => {
  const { appointmentId }             = useParams();
  const navigate                      = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [paypalClientId, setClientId] = useState('');
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [apptRes, clientRes] = await Promise.all([
          api.get(`/appointments/${appointmentId}`),
          api.get('/payment/paypal-client-id'),
        ]);
        setAppointment(apptRes.data.appointment);
        setClientId(clientRes.data.clientId);
      } catch {
        toast.error('Failed to load appointment');
        navigate('/patient/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [appointmentId, navigate]);

  const createOrder = async () => {
    const { data } = await api.post(`/payment/create-order/${appointmentId}`);
    return data.orderId;
  };

  const onApprove = async (data) => {
    try {
      await api.post(`/payment/capture-order/${appointmentId}`, { paypalOrderId: data.orderID });
      toast.success('Payment successful! Appointment confirmed.');
      navigate('/patient/appointments');
    } catch {
      toast.error('Payment capture failed. Please contact support.');
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    toast.error('Payment failed. Please try again.');
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!appointment) return null;

  const { doctorData, slotDate, slotTime, amount } = appointment;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-primary"></span>
          </div>
          <h1 className="font-display text-3xl text-dark mb-1">Complete Payment</h1>
          <p className="text-muted text-sm">Secure checkout via PayPal</p>
        </div>

        {/* Order Summary */}
        <div className="card shadow-xl border-slate-200 mb-6">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">Doctor</span>
              <span className="text-dark font-medium text-sm">
                {doctorData?.name?.toLowerCase().startsWith('dr.') ? doctorData?.name : `Dr. ${doctorData?.name}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">Speciality</span>
              <span className="text-slate-600 text-sm">{doctorData?.speciality}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">Date</span>
              <span className="text-slate-600 text-sm">{formatDate(slotDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">Time</span>
              <span className="text-slate-600 text-sm">{slotTime}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="text-dark font-semibold">Total</span>
              <span className="text-primary text-xl font-bold">{formatCurrency(amount)}</span>
            </div>
          </div>
        </div>

        {/* PayPal Button */}
        <div className="card shadow-xl border-slate-200">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Select Payment Method</h3>
          {paypalClientId ? (
            <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'PLN' }}>
              <PayPalButtons
                style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            </PayPalScriptProvider>
          ) : (
            <div className="flex justify-center py-8"><Spinner /></div>
          )}
        </div>

        <button onClick={() => navigate('/patient/dashboard')} className="btn-secondary w-full mt-6 py-3 text-sm">
          ← Cancel & Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Payment;
