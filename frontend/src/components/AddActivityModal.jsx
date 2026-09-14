import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Plus, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { createActivity } from '../services/api';

export const AddActivityModal = ({ isOpen, onClose, idolId, idolName, onSuccess }) => {
  const [activityType, setActivityType] = useState('prasadam'); // 'prasadam', 'annadanam', 'uregimpu'
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: 'Today',
    start_time: '12:30 PM',
    end_time: '02:00 PM',
    location: '',
    organizer_name: '',
    contact_number: '',
    status: 'Upcoming',
    
    // Procession Specific
    start_location: '',
    end_location: '',
    route_coordinates: '',
    crowd_status: 'Medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type) => {
    setActivityType(type);
    if (type === 'prasadam' && !formData.title) {
      setFormData((prev) => ({ ...prev, title: 'Special Laddu Prasadam Distribution' }));
    } else if (type === 'annadanam' && !formData.title) {
      setFormData((prev) => ({ ...prev, title: 'Maha Annadanam Meal Seva' }));
    } else if (type === 'uregimpu' && !formData.title) {
      setFormData((prev) => ({ ...prev, title: 'Grand Vinayaka Uregimpu Procession' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const title = formData.title || (
        activityType === 'prasadam' ? 'Prasadam Distribution' :
        activityType === 'annadanam' ? 'Annadanam Lunch Seva' : 'Ganesh Uregimpu Procession'
      );

      await createActivity(idolId, {
        ...formData,
        title,
        activity_type: activityType
      });
      
      setSubmitSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to add festival activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-100 relative my-auto">
        
        <button
          onClick={resetForm}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {submitSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-extrabold text-xl text-slate-900">
              Activity Submitted!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your festival activity for <strong>{idolName}</strong> has been submitted.
            </p>
            <button
              onClick={resetForm}
              className="mt-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Add Seva Information
              </span>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                Festival Activity for {idolName}
              </h3>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Conditional Activity Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Activity Type *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeSelect('prasadam')}
                  className={`p-3 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                    activityType === 'prasadam'
                      ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xl">🙏</span>
                  <span>Prasadam</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeSelect('annadanam')}
                  className={`p-3 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                    activityType === 'annadanam'
                      ? 'bg-orange-100 border-orange-400 text-orange-900 ring-2 ring-orange-400/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xl">🍚</span>
                  <span>Annadanam</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeSelect('uregimpu')}
                  className={`p-3 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                    activityType === 'uregimpu'
                      ? 'bg-purple-100 border-purple-400 text-purple-900 ring-2 ring-purple-400/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xl">🥁</span>
                  <span>Uregimpu</span>
                </button>
              </div>
            </div>

            {/* Title & Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Activity Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={
                  activityType === 'prasadam' ? "e.g. Laddu Prasadam Distribution" :
                  activityType === 'annadanam' ? "e.g. Maha Annadanam Meal Seva" : "e.g. Grand Vinayaka Procession"
                }
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              />
            </div>

            {/* Date & Times */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. Today / Sep 17"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Time *</label>
                <input
                  type="text"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  placeholder="12:30 PM"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                <input
                  type="text"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  placeholder="02:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Distribution / Seva Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Near Main Pandal Entrance"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            {/* CONDITIONAL FIELDS FOR UREGIMPU */}
            {activityType === 'uregimpu' && (
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                <span className="text-xs font-extrabold text-purple-900 flex items-center gap-1">
                  🥁 Uregimpu Procession Specifics
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Starting Location</label>
                    <input
                      type="text"
                      name="start_location"
                      value={formData.start_location}
                      onChange={handleChange}
                      placeholder="e.g. Main Pandal"
                      className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Ending Location</label>
                    <input
                      type="text"
                      name="end_location"
                      value={formData.end_location}
                      onChange={handleChange}
                      placeholder="e.g. Visarjan Lake"
                      className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Route Coordinates JSON (Optional, e.g. [[16.50, 80.64], [16.51, 80.65]])
                  </label>
                  <input
                    type="text"
                    name="route_coordinates"
                    value={formData.route_coordinates}
                    onChange={handleChange}
                    placeholder="[[lat1, lng1], [lat2, lng2]]"
                    className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-mono bg-white outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention meal details, laddu quantity, or procession highlights..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Activity'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default AddActivityModal;
