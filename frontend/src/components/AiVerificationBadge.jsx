import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

export const AiVerificationBadge = ({ aiResult, isAnalyzing = false }) => {
  if (isAnalyzing) {
    return (
      <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 animate-pulse flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-orange-500 animate-spin" />
        <div>
          <p className="text-sm font-semibold text-orange-800">AI Computer Vision Analysis in Progress...</p>
          <p className="text-xs text-orange-600">Analyzing saffron spectrums & idol contour features</p>
        </div>
      </div>
    );
  }

  if (!aiResult) return null;

  const isDetected = aiResult.is_ganesh_idol;
  const confidencePct = Math.round((aiResult.confidence || 0) * 100);

  return (
    <div className={`p-4 rounded-xl border ${isDetected ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-200'} shadow-sm space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className={`w-5 h-5 ${isDetected ? 'text-amber-600' : 'text-rose-600'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Analysis</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isDetected ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
          {confidencePct}% Confidence
        </span>
      </div>

      <div className="flex items-start gap-3">
        {isDetected ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
        )}
        <div>
          <h4 className={`font-bold text-base ${isDetected ? 'text-emerald-900' : 'text-rose-900'} flex items-center gap-1`}>
            {isDetected ? (
              <>
                <span>🕉️</span> <span>Lord Ganesh Idol Detected</span>
              </>
            ) : (
              '❌ Ganesh Idol Not Clearly Detected'
            )}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {aiResult.message || (isDetected ? 'Likely Ganesh Idol' : 'Please upload a clearer image.')}
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${isDetected ? 'bg-gradient-to-r from-amber-400 to-emerald-500' : 'bg-rose-400'}`}
          style={{ width: `${confidencePct}%` }}
        ></div>
      </div>

      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>AI analysis assists verification. <strong>Admin review</strong> remains final authority.</span>
      </div>
    </div>
  );
};

export default AiVerificationBadge;
