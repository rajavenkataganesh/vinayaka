import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { submitReport } from '../services/api';

const REPORT_TYPES = [
  'Wrong location',
  'Duplicate idol',
  'Incorrect information',
  'Idol no longer exists',
  'Inappropriate image',
  'Other'
];

export const ReportModal = ({ isOpen, onClose, idolId, idolName }) => {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await submitReport({
        idol_id: idolId,
        report_type: reportType,
        description
      });
      setIsSuccess(true);
    } catch (err) {
      setErrorMsg('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 relative">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-lg text-slate-900">Report Submitted</h4>
            <p className="text-xs text-slate-600">
              Thank you. Our admin team will review this report shortly.
            </p>
            <button
              onClick={resetAndClose}
              className="mt-2 px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-extrabold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Report Issue</span>
            </div>

            <p className="text-xs text-slate-600">
              Reporting for: <strong className="text-slate-900">{idolName}</strong>
            </p>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Report</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              >
                {REPORT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Additional Details</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is incorrect or needs review..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
