import React, { useState } from "react";

export default function ResultPanel({ data, onViewDoc }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/10 p-6 select-none">
        <div className="w-16 h-16 rounded-full bg-slate-800/30 flex items-center justify-center mb-4 text-slate-500 border border-slate-800/40">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-400">Ready for Analysis</h3>
        <p className="text-xs text-gray-600 mt-1 max-w-sm">
          Upload a log file or select a historical incident from the sidebar to view automated root cause analysis.
        </p>
      </div>
    );
  }

  const getSeverityStyles = (sev) => {
    switch (sev?.toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-500/10 border-red-500/30 text-red-400",
          glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)] border-red-500/40 bg-red-950/5"
        };
      case "error":
        return {
          bg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
          glow: "shadow-[0_0_20px_rgba(249,115,22,0.12)] border-orange-500/40 bg-orange-950/5"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
          glow: "shadow-[0_0_20px_rgba(234,179,8,0.1)] border-yellow-500/40 bg-yellow-950/5"
        };
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
          glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)] border-blue-500/40 bg-blue-950/5"
        };
    }
  };

  const sevStyles = getSeverityStyles(data.severity);
  const confidence = data.confidence_score || 0;

  const handleCopyCommand = (cmd, index) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Summary Card */}
      <div className={`p-5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${sevStyles.glow}`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${sevStyles.bg}`}>
              {data.severity || "Unknown"}
            </span>
            <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]" title={data.filename}>
              {data.filename}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-150 leading-snug">
            {data.root_cause}
          </h2>
        </div>

        {/* Confidence Circle Gauge */}
        <div className="flex items-center gap-3 shrink-0 bg-[#161f30]/80 p-2 rounded-lg border border-slate-800/80">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-slate-800"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - confidence / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-gray-200">
              {Math.round(confidence)}%
            </span>
          </div>
          <div className="text-left select-none">
            <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Confidence</p>
            <p className="text-xs text-gray-300 font-medium">Similarity</p>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Possible Reasons */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#121826]/40 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/40">
            <span className="text-base">🧐</span>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Possible Reasons</h3>
          </div>
          <ul className="flex flex-col gap-2.5">
            {data.possible_reasons && data.possible_reasons.length > 0 ? (
              data.possible_reasons.map((reason, idx) => (
                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-500 shrink-0 font-bold select-none">•</span>
                  <span>{reason}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-gray-500 italic select-none">No specific reasons listed.</li>
            )}
          </ul>
        </div>

        {/* Suggested Fixes */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#121826]/40 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/40">
            <span className="text-base">🛠️</span>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Suggested Fixes</h3>
          </div>
          <ul className="flex flex-col gap-2.5">
            {data.suggested_fixes && data.suggested_fixes.length > 0 ? (
              data.suggested_fixes.map((fix, idx) => (
                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 font-bold shrink-0 select-none">{idx + 1}.</span>
                  <span>{fix}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-gray-500 italic select-none">No suggested fixes provided.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Verification Terminal */}
      {data.verification_commands && data.verification_commands.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0b0f19] overflow-hidden shadow-lg">
          <div className="bg-[#121826] px-4 py-2 border-b border-slate-800/80 flex justify-between items-center select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="text-xs font-mono font-medium text-gray-400 ml-2">Verification Shell</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">cli</span>
          </div>
          
          <div className="p-4 flex flex-col gap-2.5 font-mono text-xs overflow-x-auto">
            {data.verification_commands.map((cmd, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4 p-2 rounded bg-slate-950/40 border border-slate-900 hover:border-slate-800 group">
                <div className="flex gap-2 min-w-0">
                  <span className="text-slate-650 shrink-0 select-none">$</span>
                  <span className="text-cyan-400 whitespace-pre-wrap break-all text-left">{cmd}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCommand(cmd, idx)}
                  className="text-gray-500 hover:text-white shrink-0 p-1 rounded hover:bg-slate-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Copy command"
                >
                  {copiedIndex === idx ? (
                    <span className="text-[10px] text-emerald-400 font-sans font-bold">Copied!</span>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAG Retrieved Documents */}
      {data.retrieved_documents && data.retrieved_documents.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 select-none">
            Retrieved Knowledge Base Docs
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.retrieved_documents.map((doc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onViewDoc(doc)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-[#121826]/40 text-xs text-blue-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-950/10 transition-all cursor-pointer font-medium"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="truncate max-w-[250px]">{doc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}