import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  X, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Columns, 
  CheckCircle2,
  Loader2,
  Trash2,
  Info,
  Clock,
  Tag,
  ImageIcon,
  Plus
} from 'lucide-react';
import api, { secureFileUrl } from '@/lib/api';
import { toast } from 'sonner';
import { Card, Button, Badge, SectionHeader } from './ClinicalDesignSystem';

interface ImagesTabProps {
  caseId: string;
  data: any;
  onImageAdded?: (image: any) => void;
}

const IMAGES_TAGS = ['BEFORE', 'AFTER', 'FOLLOWUP', 'GENERAL'];

const ImagesTab: React.FC<ImagesTabProps> = ({ caseId, data, onImageAdded }) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [viewingImage, setViewingImage] = useState<any | null>(null);

  useEffect(() => {
    fetchImages();
  }, [caseId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/consultation/${caseId}/images`);
      setImages(res.data);
    } catch (error) {
      console.error('Failed to fetch images', error);
      toast.error('Failed to load clinical images');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setUploadError('Only PNG and JPEG images are allowed');
      toast.error('Only PNG and JPEG images are allowed');
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tag', 'GENERAL');
      formData.append('notes', '');

      const res = await api.post(
        `/consultation/${caseId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event) => {
            if (event.total) {
              setUploadProgress(Math.round((event.loaded * 100) / event.total));
            }
          },
        }
      );

      setImages([res.data, ...images]);
      toast.success('Clinical image uploaded successfully');
      if (onImageAdded) onImageAdded(res.data);
    } catch (error: any) {
      console.error('Upload failed', error);
      const message = error?.response?.data?.message || 'Failed to upload image';
      setUploadError(Array.isArray(message) ? message.join(', ') : message);
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== id));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare([...selectedForCompare, id]);
      } else {
        setSelectedForCompare([selectedForCompare[1], id]);
      }
    }
  };

  const getCompareImages = () => {
    return images.filter(img => selectedForCompare.includes(img.id));
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Visual History...</p>
      </div>
    );
  }

  return (
    <div className="pb-12 overflow-hidden flex flex-col space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <SectionHeader 
          title="Clinical Imaging" 
          subtitle="Visual progress, attachments, and comparative analysis."
        />

        <div className="flex items-center gap-4">
          <Button 
            variant={compareMode ? 'primary' : 'outline'}
            onClick={() => {
              setCompareMode(!compareMode);
              if (compareMode) setSelectedForCompare([]);
            }}
            icon={<Columns className="w-4 h-4" />}
            className="rounded-2xl"
          >
            {compareMode ? 'Exit Comparison' : 'Compare Images'}
          </Button>
          
          <label className={`
            flex items-center gap-2 px-6 h-12 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-blue-500 cursor-pointer shadow-lg shadow-blue-500/20 active:scale-[0.98]
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? `Uploading ${uploadProgress}%` : 'Upload Image'}
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/png,image/jpeg" />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-600">
          {uploadError}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col gap-8">
        {compareMode && selectedForCompare.length > 0 && (
          <div className="bg-slate-50 border border-blue-100 rounded-3xl p-8 animate-in zoom-in-95 duration-300 shadow-xl shadow-blue-50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-px bg-blue-200" />
                Live Comparison Engine
                <div className="w-8 h-px bg-blue-200" />
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {selectedForCompare.length} of 2 Images Selected
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 h-[400px]">
              {selectedForCompare.length === 1 ? (
                <>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-white shadow-lg">
                    <img src={secureFileUrl(images.find(img => img.id === selectedForCompare[0])?.imageUrl || '')} className="w-full h-full object-cover" alt="Comparison 1" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-black text-slate-800 uppercase tracking-widest shadow-sm">
                      {images.find(img => img.id === selectedForCompare[0])?.tag}
                    </div>
                  </div>
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-4 group hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <div className="p-4 rounded-full bg-white border border-slate-200 group-hover:text-blue-500 group-hover:border-blue-200 transition-all shadow-sm">
                      <Plus className="w-8 h-8" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Select second image</p>
                  </div>
                </>
              ) : (
                getCompareImages().map((img, idx) => (
                  <div key={img.id} className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-white shadow-xl">
                    <img src={secureFileUrl(img.imageUrl)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`Comparison ${idx}`} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-black text-slate-800 uppercase tracking-widest shadow-sm">
                      {img.tag}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-100 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                      <p className="text-xs font-bold text-slate-800 italic mb-1.5">"{img.notes || 'No notes added'}"</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3" />
                        {new Date(img.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Image Grid */}
        <div className="pr-1">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map(img => {
                const isSelected = selectedForCompare.includes(img.id);
                return (
                  <div 
                    key={img.id} 
                    className={`
                      relative rounded-[24px] overflow-hidden border bg-slate-50 group cursor-pointer transition-all aspect-square shadow-sm hover:shadow-xl
                      ${isSelected ? 'ring-4 ring-blue-500/20 border-blue-500' : 'border-slate-200 hover:border-blue-300'}
                    `}
                    onClick={() => compareMode ? toggleCompare(img.id) : setViewingImage(img)}
                  >
                    <img src={secureFileUrl(img.imageUrl)} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt="Clinical" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-black text-slate-800 border border-slate-100 uppercase tracking-widest shadow-sm">
                      {img.tag}
                    </div>

                    {compareMode && (
                      <div className={`
                        absolute top-4 right-4 p-1.5 rounded-full border transition-all shadow-md
                        ${isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/80 border-slate-200 text-slate-400'}
                      `}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-[11px] text-white font-bold line-clamp-1 mb-1 drop-shadow-md">{img.fileName}</p>
                      <div className="flex items-center gap-2 text-[9px] text-slate-200 font-bold uppercase tracking-widest drop-shadow-md">
                        <Clock className="w-3 h-3" />
                        {new Date(img.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-60">
              <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Images Captured</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-2 font-medium leading-relaxed">
                Document procedure progress, clinical findings, or comparison states by uploading medical photos.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Detail Overlay */}
      {viewingImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewingImage(null)} />
          
          <div className="relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden max-w-6xl w-full flex flex-col lg:flex-row h-full shadow-2xl">
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden">
              <img 
                src={secureFileUrl(viewingImage.imageUrl)} 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105" 
                alt="Detailed View" 
              />
              <div className="absolute bottom-8 left-8 flex items-center gap-2">
                <button className="w-10 h-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all shadow-sm">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all shadow-sm">
                  <ZoomOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col bg-white">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Metadata</h3>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{viewingImage.tag} Tag</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">File Information</span>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-xs text-slate-800 font-bold mb-1 break-all">{viewingImage.fileName || 'Untitled File'}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        Captured {new Date(viewingImage.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Doctor's Annotations</span>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm min-h-[100px] text-sm text-slate-600 italic">
                      {viewingImage.notes || 'No annotations added to this image.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 flex flex-col justify-end">
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500 shrink-0" />
                    <h5 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Privacy & Compliance</h5>
                  </div>
                  <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">
                    This image is stored securely and linked to the patient's MRD. Access is restricted to authorized medical personnel only.
                  </p>
                </div>
                
                <button 
                  className="w-full h-14 bg-white border border-rose-200 rounded-2xl text-rose-500 text-[11px] font-black uppercase tracking-widest transition-all hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center gap-2 group shadow-sm"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Remove from Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesTab;
