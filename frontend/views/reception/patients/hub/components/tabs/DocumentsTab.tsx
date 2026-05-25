import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Eye, 
  Loader2, 
  Upload, 
  X, 
  Calendar, 
  AlertCircle, 
  CheckCircle2,
  FileDigit
} from 'lucide-react';
import { Patient } from '../../types';
import api, { secureFileUrl } from '@/lib/api';
import { toast } from 'sonner';

interface DocumentsTabProps {
  patient: Patient;
  onRefresh?: () => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ patient, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState('Prescription');
  const [documentNumber, setDocumentNumber] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [confirmDeleteDocId, setConfirmDeleteDocId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const DOC_TYPES = [
    'Prescription',
    'Lab Report',
    'Scan/X-Ray',
    'Discharge Summary',
    'Consent Form',
    'Other'
  ];

  const getDocIconColor = (type: string) => {
    switch (type) {
      case 'Prescription': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'Lab Report': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Scan/X-Ray': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'Discharge Summary': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Consent Form': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only PDF, JPG, and PNG files are allowed.');
      toast.error('Only PDF, JPG, and PNG files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      toast.error('File size exceeds 10MB limit.');
      return;
    }
    setUploadedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setSaving(true);
      setUploadProgress(0);
      setUploadError(null);

      // Step 1: Upload file to folder consent
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const uploadRes = await api.post('/files/consent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setUploadProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      // Response might be wrapped in { success: true, url: ... } or just return the data directly
      const fileUrl = uploadRes.data?.url || (uploadRes.data as any)?.data?.url;
      if (!fileUrl) {
        throw new Error('Failed to retrieve file URL from storage server.');
      }

      // Step 2: Save metadata in patient record
      await api.post(`/patients/${patient.id}/documents`, {
        documentType,
        documentNumber: documentNumber.trim() || undefined,
        fileUrl,
      });

      toast.success('Document uploaded and saved successfully');
      setIsModalOpen(false);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error('Error uploading patient document:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to upload document';
      setUploadError(Array.isArray(msg) ? msg.join(', ') : msg);
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (docId: string) => {
    setConfirmDeleteDocId(docId);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteDocId) return;
    const docId = confirmDeleteDocId;
    setConfirmDeleteDocId(null);

    try {
      setDeletingDocId(docId);
      await api.delete(`/patients/${patient.id}/documents/${docId}`);
      toast.success('Document deleted successfully');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error('Error deleting document:', err);
      toast.error(err.response?.data?.message || 'Failed to delete document');
    } finally {
      setDeletingDocId(null);
    }
  };

  const resetForm = () => {
    setDocumentType('Prescription');
    setDocumentNumber('');
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadError(null);
  };

  const documents = patient.documents || [];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      
      {/* Tab Header */}
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Medical Documents & Reports</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1">Total: {documents.length} Document{documents.length !== 1 ? 's' : ''} stored</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Upload New
        </button>
      </div>

      {/* Document History Table or Empty State */}
      {documents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Type</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Number</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Date</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getDocIconColor(doc.documentType)}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{doc.documentType}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {doc.fileUrl?.endsWith('.pdf') ? 'PDF Document' : 'Image File'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {doc.documentNumber ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <FileDigit className="w-3.5 h-3.5 text-slate-400" />
                        {doc.documentNumber}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <a 
                      href={secureFileUrl(doc.fileUrl || '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-100"
                      title="View / Open Document"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => setConfirmDeleteDocId(doc.id)}
                      disabled={deletingDocId === doc.id}
                      className="inline-flex items-center justify-center p-2.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 text-rose-500 rounded-xl transition-all border border-rose-100/50 disabled:opacity-50"
                      title="Delete Document"
                    >
                      {deletingDocId === doc.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-slate-100">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">No Documents Found</p>
            <p className="text-[11px] font-bold text-slate-400">Upload prescriptions, lab reports, and imaging scans for this patient.</p>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Upload Document</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Add reports, prescriptions & records</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }} 
                className="p-3 hover:bg-slate-200 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400 animate-in spin-in-90 duration-300" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Document Type Dropdown */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Category</label>
                    <select 
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-slate-950 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      {DOC_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Document Number / Reference */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference / ID Number (Optional)</label>
                    <input 
                      type="text" 
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-slate-950 focus:bg-white transition-all placeholder:text-slate-300"
                      placeholder="e.g. LAB-90812"
                    />
                  </div>

                </div>

                {/* Drag & Drop Upload Area */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document File</label>
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center gap-4 group cursor-pointer ${isDragging ? 'border-slate-950 bg-slate-50 scale-[1.01]' : uploadedFile ? 'border-teal-500 bg-teal-50/10' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
                  >
                    {uploadedFile ? (
                      <div className="text-center space-y-4">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto border border-teal-100 shadow-sm animate-bounce">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-widest max-w-md truncate mx-auto">{uploadedFile.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type.split('/')[1].toUpperCase()}
                          </p>
                        </div>
                        {saving && (
                          <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full bg-teal-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        )}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                          }} 
                          className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                        >
                          Remove & Replace
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-all border border-slate-100 shadow-sm">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-black text-slate-800 uppercase tracking-widest">[ Click to Select or Drag & Drop File ]</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Accepted: PDF, JPG, PNG | Max: 10MB</p>
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="application/pdf,image/jpeg,image/png"
                      disabled={saving}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) validateAndSetFile(file);
                      }}
                    />
                  </div>
                </div>

                {uploadError && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">{uploadError}</p>
                  </div>
                )}

              </div>

              {/* Form Actions */}
              <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={saving}
                  className="flex-1 py-5 bg-white text-slate-600 border border-slate-200 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving || !uploadedFile}
                  className="flex-1 py-5 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      Save Document
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteDocId && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 p-10 text-center space-y-8">
            <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-rose-100/50 text-rose-500 shadow-sm">
              <Trash2 className="w-10 h-10 animate-bounce" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Delete Document?</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete this document? This action is irreversible and the document will be removed from the EMR repository.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDeleteDocId(null)}
                className="flex-1 py-4 bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/25 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentsTab;
