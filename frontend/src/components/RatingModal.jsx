import React, { useState } from 'react';
import { X, Star, CheckCircle2, Loader2 } from 'lucide-react';
import { submitRating } from '../services/api';

export const RatingModal = ({ isOpen, onClose, idolId, idolName, onRatingSubmitted }) => {
  const [rating, setRating] = useState(5.0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await submitRating({
        idol_id: idolId,
        rating,
        review
      });
      setIsSuccess(true);
      if (onRatingSubmitted) onRatingSubmitted();
    } catch (err) {
      setErrorMsg('Failed to submit rating.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setReview('');
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
            <h4 className="font-heading font-bold text-lg text-slate-900">Rating Submitted!</h4>
            <p className="text-xs text-slate-600">Thank you for sharing your darshan experience.</p>
            <button
              onClick={resetAndClose}
              className="mt-2 px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">Rate & Review Pandal</h3>
              <p className="text-xs text-slate-500">{idolName}</p>
            </div>

            {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}

            {/* Star Picker */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Darshan Experience / Review</label>
              <textarea
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share queue times, prasadam, or pandal highlights..."
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
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Rating'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RatingModal;
