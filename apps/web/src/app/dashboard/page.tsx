"use client";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Plus, MoreVertical, FileText, Search, Eye, Users, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";


export default function AdminDashboard() {
  const { user, token, isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMethod, setCreateMethod] = useState<'manual' | 'upload'>('manual');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Epidemiology');

  useEffect(() => {
    if (hasHydrated && (!isAuthenticated || !user)) {
      router.push('/login');
    } else if (hasHydrated && isAuthenticated) {
      fetchGuidelines();
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  const fetchGuidelines = async () => {
    try {
      const response = await fetch('http://localhost:3000/guidelines');
      if (response.ok) {
        const data = await response.json();
        setGuidelines(data);
      }
    } catch (error) {
      console.error('Error fetching guidelines:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      const response = await fetch(`http://localhost:3000/guidelines/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setGuidelines(prev => prev.filter(g => g.id !== id));
      } else {
        alert('Failed to delete guideline');
      }
    } catch (error) {
      console.error('Error deleting guideline:', error);
      alert('Failed to delete guideline');
    }
  };

  if (!hasHydrated || (isAuthenticated && !user)) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading session...</div>;
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-300';
      case 'In Review': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Draft': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Living': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Archived': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Top action bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-navy-900">Author Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back, {user.name} ({user.role})</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find a guideline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Guideline
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 font-serif">My Guidelines</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {guidelines.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No Guidelines Yet</h3>
              <p className="text-slate-500 mb-6">Create your first guideline by uploading a document or starting from scratch.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-600 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors"
              >
                <Plus className="w-5 h-5" /> Create First Guideline
              </button>
            </div>
          ) : (
            guidelines.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase())).map((guideline) => (
              <div key={guideline.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow relative group flex flex-col h-full">
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getStatusColor(guideline.status)}`}>
                      {guideline.status}
                    </span>
                    <button className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                    {guideline.title}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mb-4">
                    <span className="text-navy-600">v{guideline.version}</span> • {guideline.dept}
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 rounded-b-lg">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5" title="Updated Date">
                      <FileText className="w-3.5 h-3.5" /> {guideline.updated_at}
                    </span>
                    <span className="flex items-center gap-1.5" title="Team members">
                      <Users className="w-3.5 h-3.5" /> {guideline.authors} Authors
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/guidelines/${guideline.id}`} className="flex items-center gap-1 font-medium text-navy-600 hover:text-navy-800 hover:underline">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(guideline.id, guideline.title)}
                      className="flex items-center gap-1 font-medium text-red-500 hover:text-red-700 hover:underline ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* New Guideline Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-navy-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-serif">Create New Guideline</h3>
                <p className="text-navy-200 text-sm">Initiate a living clinical practice guideline</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-white/70 hover:text-white text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-8 space-y-6">
              {/* Creation Method Selection */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setCreateMethod('manual')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${createMethod === 'manual'
                    ? 'bg-white text-navy-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                  Manual Creation
                </button>
                <button
                  onClick={() => setCreateMethod('upload')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${createMethod === 'upload'
                    ? 'bg-white text-navy-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                  Upload Document
                </button>
              </div>

              {createMethod === 'manual' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Guideline Title</label>
                    <input
                      type="text"
                      placeholder="e.g. National Guidelines for Hypertension Management"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-navy-500 transition-all"
                    >
                      <option>Epidemiology</option>
                      <option>Non-Communicable Diseases</option>
                      <option>Communicable Diseases</option>
                      <option>Reproductive Health</option>
                      <option>Bioethics</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Document</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-navy-400 transition-colors">
                      <input
                        type="file"
                        accept=".docx,.pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 mb-1">
                          {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-slate-500">DOCX or PDF files only</p>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Guideline Title (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave blank to use filename"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-dashed">
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  {createMethod === 'manual'
                    ? 'Note: Creating a new guideline will initialize a collaborative workspace. You will be assigned as the Guideline Admin and can invite other authors and reviewers.'
                    : 'Note: Uploading a document will extract its content and create a new guideline in draft status. You can edit and collaborate on it afterwards.'
                  }
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (createMethod === 'upload' && selectedFile) {
                      setIsUploading(true);

                      try {
                        const formData = new FormData();
                        formData.append('file', selectedFile);
                        formData.append('title', title);

                        const response = await fetch('http://localhost:3000/guidelines/create-from-document', {
                          method: 'POST',
                          body: formData,
                        });

                        if (!response.ok) throw new Error('Failed to upload document');

                        const result = await response.json();

                        // Fetch guidelines again to update list
                        await fetchGuidelines();

                        setIsCreateModalOpen(false);
                        setSelectedFile(null);
                        setTitle('');
                        router.push(`/guidelines/${result.id}`);
                      } catch (error) {
                        console.error('Upload error:', error);
                        alert('Failed to process document');
                      } finally {
                        setIsUploading(false);
                      }
                    } else {
                      // Manual creation
                      if (!title.trim()) {
                        alert('Please enter a guideline title');
                        return;
                      }

                      try {
                        const response = await fetch('http://localhost:3000/guidelines', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            title: title.trim(),
                            department: department,
                          }),
                        });

                        if (!response.ok) throw new Error('Failed to create guideline');

                        const result = await response.json();

                        await fetchGuidelines();
                        setIsCreateModalOpen(false);
                        setTitle('');
                        router.push(`/guidelines/${result.id}`);
                      } catch (error) {
                        console.error('Creation error:', error);
                        alert('Failed to create guideline');
                      }
                    }
                  }}
                  disabled={createMethod === 'upload' && (!selectedFile || isUploading)}
                  className="flex-1 py-3 bg-navy-600 text-white rounded-lg font-bold hover:bg-navy-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : createMethod === 'upload' ? 'Upload & Create' : 'Create & Launch Editor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}