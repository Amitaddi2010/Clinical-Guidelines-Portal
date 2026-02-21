"use client";
import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";

export function DocumentUpload({ onExtract }: { onExtract: (content: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'docx' || ext === 'pdf') {
        setFile(selectedFile);
      } else {
        alert('Only DOCX and PDF files are supported');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/guidelines/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      onExtract(data.content);
      setFile(null);
    } catch (error) {
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        {!file ? (
          <>
            <Upload className="w-12 h-12 text-slate-400" />
            <div className="text-center">
              <label className="cursor-pointer text-navy-600 font-medium hover:text-navy-700">
                Choose a file
                <input
                  type="file"
                  accept=".docx,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-slate-500 mt-1">DOCX or PDF (max 10MB)</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200 w-full">
              <FileText className="w-5 h-5 text-navy-600" />
              <span className="flex-1 text-sm font-medium text-slate-700">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700 disabled:opacity-50 font-medium"
            >
              {uploading ? 'Extracting...' : 'Extract Content'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
