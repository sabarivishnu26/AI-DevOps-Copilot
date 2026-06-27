import React, { useState, useEffect } from "react";
import UploadBox from "../components/UploadBox";
import ResultPanel from "../components/ResultPanel";
import LogTypeSelector from "../components/LogTypeSelector";
import IncidentCard from "../components/IncidentCard";
import {
  getIncidents,
  getIncident,
  deleteIncident,
  analyzeLog,
  getKnowledgeBaseDoc
} from "../api/client";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [logType, setLogType] = useState("general");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");

  // KB Doc Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState(null);
  const [docContent, setDocContent] = useState("");
  const [isDocLoading, setIsDocLoading] = useState(false);

  // Fetch incident history on mount
  useEffect(() => {
    fetchHistory();
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch("http://localhost:8000/");
      if (response.ok) {
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }
    } catch {
      setBackendStatus("offline");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getIncidents();
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incident history:", err);
    }
  };

  const handleAnalyze = async (filename) => {
    setIsAnalyzing(true);
    setSelectedIncident(null);
    setSelectedIncidentId(null);
    try {
      const res = await analyzeLog(filename, logType);
      setSelectedIncident(res.data);
      // Wait for DB write to complete in backend, then reload history
      setTimeout(fetchHistory, 500);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert(err.response?.data?.detail || "Log analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectIncident = async (id) => {
    try {
      const res = await getIncident(id);
      setSelectedIncidentId(id);
      setSelectedIncident(res.data.details);
    } catch (err) {
      console.error("Failed to fetch incident details:", err);
      alert("Failed to load incident details.");
    }
  };

  const handleDeleteIncident = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident from history?")) return;
    try {
      await deleteIncident(id);
      if (selectedIncidentId === id) {
        setSelectedIncident(null);
        setSelectedIncidentId(null);
      }
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete incident:", err);
    }
  };

  const handleViewDoc = async (docFilename) => {
    setViewingDoc(docFilename);
    setIsDocLoading(true);
    setDocContent("");
    try {
      const res = await getKnowledgeBaseDoc(docFilename);
      setDocContent(res.data.content);
    } catch (err) {
      console.error("Failed to fetch document content:", err);
      setDocContent("Error: Failed to load document contents.");
    } finally {
      setIsDocLoading(false);
    }
  };

  // Filter incidents based on search query
  const filteredIncidents = incidents.filter((inc) => {
    const query = searchQuery.toLowerCase();
    return (
      inc.filename.toLowerCase().includes(query) ||
      inc.root_cause.toLowerCase().includes(query) ||
      inc.severity.toLowerCase().includes(query) ||
      inc.log_type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f3f4f6]">
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-slate-900 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            🤖
          </div>
          <div className="text-left">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              AI DevOps Copilot
              <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider leading-none">v1.0</span>
            </h1>
            <p className="text-[10px] text-gray-500 leading-none mt-0.5">Autonomous RAG Log Analysis & Diagnosis</p>
          </div>
        </div>

        {/* Backend Status indicator */}
        <div className="flex items-center gap-2 bg-[#121826]/80 px-3 py-1.5 rounded-full border border-slate-800/80">
          <span className={`w-1.5 h-1.5 rounded-full ${
            backendStatus === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
            backendStatus === "offline" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
            "bg-yellow-500 animate-pulse"
          }`} />
          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">
            {backendStatus === "online" ? "API Live" : backendStatus === "offline" ? "API Offline" : "Checking API..."}
          </span>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex flex-1 flex-col lg:flex-row min-h-0">
        
        {/* Sidebar History Panel */}
        <aside className="w-full lg:w-80 border-r border-slate-900 bg-[#0b0f19] flex flex-col shrink-0 min-h-[300px] lg:min-h-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-900/60 flex flex-col gap-3 select-none">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Incident History
              </h2>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-gray-400 border border-slate-800">
                {filteredIncidents.length}
              </span>
            </div>
            
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents, causes..."
                className="w-full bg-[#121826]/50 border border-slate-800/80 rounded-lg py-1.5 pl-8 pr-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
              />
              <svg className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1.5 text-gray-500 hover:text-white font-bold text-sm cursor-pointer"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((inc) => (
                <IncidentCard
                  key={inc.id}
                  incident={inc}
                  isActive={selectedIncidentId === inc.id}
                  onClick={() => handleSelectIncident(inc.id)}
                  onDelete={handleDeleteIncident}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600 select-none">
                <svg className="w-8 h-8 text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2h12a2 2 0 012 2z" />
                </svg>
                <p className="text-xs italic">
                  {searchQuery ? "No matching records found" : "No incidents in database"}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Workspace Panel */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#090d16]/30">
          
          {/* Uploader Section */}
          <section className="p-5 rounded-xl border border-slate-900 bg-[#0b0f19]/70 flex flex-col gap-4">
            <LogTypeSelector value={logType} onChange={setLogType} />
            <UploadBox onUpload={handleAnalyze} isLoading={isAnalyzing} />
          </section>

          {/* Diagnosis Report Section */}
          <section className="flex-1">
            {isAnalyzing ? (
              <div className="relative border border-slate-800 bg-[#0b0f19]/40 rounded-xl p-8 flex flex-col items-center justify-center py-20 text-center overflow-hidden min-h-[300px]">
                {/* Scan animation */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent scan-radar-line shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20 animate-pulse">
                  <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-200">Retrieving Knowledge Base Articles...</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-sm">
                  Consulting vector DB embedding index for similarity matches, generating root cause, suggested fixes, and CLI verification steps via Gemini.
                </p>
              </div>
            ) : (
              <ResultPanel data={selectedIncident} onViewDoc={handleViewDoc} />
            )}
          </section>

        </main>
      </div>

      {/* RAG Knowledge Base Document Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-[#090d16]/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-3xl rounded-xl border border-slate-800 bg-[#0b0f19] flex flex-col max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#121826] px-5 py-3 border-b border-slate-800/80 flex justify-between items-center select-none">
              <div className="flex items-center gap-2">
                <span className="text-base">📄</span>
                <span className="text-xs font-semibold text-gray-300 font-mono">{viewingDoc}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="text-gray-500 hover:text-white cursor-pointer p-1 rounded hover:bg-slate-850/65"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 font-sans text-sm text-gray-300 leading-relaxed max-w-none text-left bg-slate-950/20">
              {isDocLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                  <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs">Loading document content...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300 bg-slate-950/60 p-4 rounded-lg border border-slate-900/60 overflow-x-auto">
                  {docContent}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#121826]/40 px-5 py-3 border-t border-slate-800/80 flex justify-end select-none">
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-1.5 text-xs font-semibold text-gray-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700/60 transition-all cursor-pointer"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}