import React, { useState, useRef } from "react";
import { uploadLog } from "../api/client";

export default function UploadBox({ onUpload, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith(".log") && !name.endsWith(".txt")) {
      setError("Only .log and .txt files are supported.");
      setFile(null);
      return false;
    }
    setError("");
    setFile(selectedFile);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setError("");
    try {
      const response = await uploadLog(file);
      if (response.data && response.data.filename) {
        onUpload(response.data.filename);
      } else {
        setError("Log upload did not return a filename.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to upload log file.");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={file ? undefined : onButtonClick}
        className={`relative border border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
          file ? "cursor-default" : "cursor-pointer"
        } ${
          dragActive
            ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            : "border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".log,.txt"
          onChange={handleChange}
        />

        {!file ? (
          <div className="flex flex-col items-center text-center gap-2 select-none">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2 border border-blue-500/20">
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-200">
              Drag & drop your log file here, or <span className="text-blue-400 hover:underline">browse</span>
            </p>
            <p className="text-xs text-gray-500">Supports .log and .txt up to 10MB</p>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 font-mono">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="p-1 text-gray-500 hover:text-red-400 transition-colors cursor-pointer rounded-full hover:bg-slate-800/50"
              title="Remove file"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg text-xs flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-blue-500 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing Log...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Analyze Log
            </>
          )}
        </button>
      )}
    </div>
  );
}