import React from "react";

export default function IncidentCard({ incident, isActive, onClick, onDelete }) {
  const getSeverityClass = (sev) => {
    switch (sev?.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "error":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    }
  };

  const getLogTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "kubernetes": return "☸️";
      case "docker": return "🐳";
      case "aws": return "☁️";
      case "jenkins": return "⚙️";
      case "github_actions": return "🚀";
      default: return "📄";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1.5 ${
        isActive
          ? "bg-blue-600/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm shrink-0" role="img" aria-label="log-type">
            {getLogTypeIcon(incident.log_type)}
          </span>
          <span className="text-xs font-semibold text-gray-200 truncate" title={incident.filename}>
            {incident.filename}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(incident.id);
          }}
          className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
          title="Delete Incident"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="text-xs text-gray-400 line-clamp-1 italic">
        {incident.root_cause || "No root cause described"}
      </div>

      <div className="flex justify-between items-center text-[10px] mt-1 pt-1 border-t border-slate-800/40">
        <span className={`px-1.5 py-0.5 rounded border font-medium ${getSeverityClass(incident.severity)}`}>
          {incident.severity || "Unknown"}
        </span>
        <span className="text-gray-500 font-mono">
          {incident.confidence_score ? `${incident.confidence_score}% Match` : "N/A"}
        </span>
      </div>
    </div>
  );
}
