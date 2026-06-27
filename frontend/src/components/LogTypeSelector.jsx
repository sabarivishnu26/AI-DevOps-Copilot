import React from "react";

export default function LogTypeSelector({ value, onChange }) {
  const options = [
    { id: "general", label: "Auto-detect", icon: "🔍" },
    { id: "kubernetes", label: "Kubernetes", icon: "☸️" },
    { id: "docker", label: "Docker", icon: "🐳" },
    { id: "aws", label: "AWS Logs", icon: "☁️" },
    { id: "jenkins", label: "Jenkins CI", icon: "⚙️" },
    { id: "github_actions", label: "GitHub Actions", icon: "🚀" }
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Log Environment
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-left text-sm cursor-pointer ${
              value === opt.id
                ? "bg-blue-600/25 border-blue-500 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "bg-[#161f30]/40 border-slate-800/80 text-gray-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            <span className="text-base leading-none">{opt.icon}</span>
            <span className="truncate">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
