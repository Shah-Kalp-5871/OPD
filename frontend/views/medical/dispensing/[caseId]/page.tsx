'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import api from '@/lib/api';
import { 
  User, 
  Hash, 
  Activity, 
  Phone, 
  ShieldAlert, 
  Printer, 
  Droplet,
  Pill,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Receipt,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const MedicalHubView = () => {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  
  const [patientData, setPatientData] = useState<any>(null);
  const [prescriptionItems, setPrescriptionItems] = useState<any[]>([]);
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
  
  // State for POS Cart
  const [cart, setCart] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptionData();
  }, [caseId]);

  const fetchPrescriptionData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/pharmacy/prescriptions/${caseId}`);
      const caseData = response.data;
      setPatientData(caseData);

      if (caseData.prescriptions && caseData.prescriptions.length > 0) {
        // Assume dispensing the first active prescription for now
        const activePrescription = caseData.prescriptions[0];
        setPrescriptionId(activePrescription.id);
        
        const mappedItems = activePrescription.items
          .filter((item: any) => !item.isDispensed) // Only show items not yet dispensed
          .map((item: any) => {
            const inventory = item.drug?.inventory?.[0]; // Assuming first inventory record matches branch
            return {
              id: item.id, // prescriptionItemId
              drugId: item.drugId,
              name: item.drug?.drugName || 'Unknown Drug',
              frequency: item.frequency || 'N/A',
              duration: `${item.durationDays} Days`,
              prescribedQty: item.quantity,
              availableStock: inventory ? inventory.totalStock : 0,
              // Assuming price comes from somewhere or defaulting to a dummy value if not in drug model
              price: item.drug?.price || 15.0, 
            };
          });
          
        setPrescriptionItems(mappedItems);
        
        // Auto-populate cart
        const initialCart = mappedItems
          .filter((item: any) => item.availableStock > 0)
          .map((item: any) => ({
            ...item,
            dispenseQty: Math.min(item.prescribedQty, item.availableStock), // Can't dispense more than available
            total: Math.min(item.prescribedQty, item.availableStock) * item.price
          }));
        setCart(initialCart);
      }
    } catch (error) {
      toast.error('Failed to load prescription data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(currentCart => currentCart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.availableStock, item.dispenseQty + delta));
        return { ...item, dispenseQty: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!prescriptionId) return;
    
    setIsProcessing(true);
    try {
      const payload = {
        caseId,
        prescriptionId,
        items: cart.map(item => ({
          prescriptionItemId: item.id,
          drugId: item.drugId,
          quantityDispensed: item.dispenseQty
        }))
      };

      await api.post('/pharmacy/dispense', payload);
      
      toast.success('Payment collected & Drugs dispensed successfully!');
      toast.info('Invoice Generated Automatically');
      router.push('/medical/dispensing');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to dispense medication');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <MedicalLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Prescription Data...</p>
        </div>
      </MedicalLayout>
    );
  }

  if (!patientData) {
    return (
      <MedicalLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Case not found</p>
          <button onClick={() => router.push('/medical/dispensing')} className="mt-4 px-6 py-2 bg-slate-100 rounded-xl text-xs font-black uppercase text-slate-600">Back to Queue</button>
        </div>
      </MedicalLayout>
    );
  }

  return (
    <MedicalLayout>
      <div className="min-h-screen bg-slate-50/50 -m-8">
        <div className="max-w-[1600px] mx-auto bg-white border-x border-slate-200 shadow-sm min-h-screen pb-24">
          
          {/* 1. Header (Replicated from Reception PatientHeader) */}
          <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                  <User className="w-10 h-10" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {patientData.patient?.firstName} {patientData.patient?.lastName}
                    </h1>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider">
                      Pharmacy File
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-900 font-bold uppercase tracking-tight">MRD-{patientData.patient?.mrdNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <span>{patientData.patient?.age || '--'} Yrs / {patientData.patient?.gender}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{patientData.patient?.contactNumber || '--'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{patientData.patient?.allergies || 'No Known Allergies'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-xl transition-all shadow-sm">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Secondary Meta Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-100 bg-slate-50/30">
              <div className="px-6 py-3 border-r border-slate-100 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Case ID</p>
                <p className="text-sm font-bold text-slate-700">{caseId}</p>
              </div>
              <div className="px-6 py-3 border-r border-slate-100 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prescribing Doctor</p>
                <p className="text-sm font-bold text-slate-700">Dr. {patientData.doctor?.firstName || ''} {patientData.doctor?.lastName || ''}</p>
              </div>
              <div className="px-6 py-3 border-r border-slate-100 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Case Started</p>
                <p className="text-sm font-bold text-slate-700">{new Date(patientData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="px-6 py-3 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-sm font-bold">Active Case</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Main Workspace: Prescription vs POS Cart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
             
             {/* Left Side: Prescription Details */}
             <div className="lg:col-span-7 border-r border-slate-200 p-8 min-h-[calc(100vh-250px)] bg-slate-50/30 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Doctor's Prescription</h2>
                </div>

                {prescriptionItems.length === 0 ? (
                   <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
                     <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                     <h3 className="text-[14px] font-black text-slate-800 tracking-tight">All Caught Up</h3>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">No pending items to dispense for this case</p>
                   </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptionItems.map((item) => (
                      <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-[14px] font-black text-slate-800 tracking-tight">{item.name}</h3>
                            {item.availableStock === 0 && (
                               <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                 <AlertCircle className="w-3 h-3" /> Out of Stock
                               </span>
                            )}
                          </div>
                          <div className="flex items-center gap-6 mt-3">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Frequency</span>
                              <span className="text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded">{item.frequency}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Duration</span>
                              <span className="text-[11px] font-black text-slate-600">{item.duration}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Qty Needed</span>
                              <span className="text-[11px] font-black text-slate-600">{item.prescribedQty}</span>
                            </div>
                          </div>
                        </div>
                        
                        {item.availableStock > 0 ? (
                          <div className="text-right pl-6 border-l border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Available</span>
                            <span className="text-lg font-black text-emerald-600">{item.availableStock}</span>
                          </div>
                        ) : (
                          <div className="pl-6 border-l border-slate-100 flex flex-col gap-2">
                             <button className="px-4 py-2 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors">
                               Substitute
                             </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {/* Right Side: POS Billing Cart */}
             <div className="lg:col-span-5 p-8 bg-white relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Billing Cart</h2>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Cart Items */}
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                      {cart.map((item) => (
                        <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3">
                           <div className="flex items-start justify-between">
                             <span className="text-[12px] font-black text-slate-800 tracking-tight">{item.name}</span>
                             <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                           
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                <button 
                                  onClick={() => updateCartQty(item.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-[11px] font-black text-slate-700 w-4 text-center">{item.dispenseQty}</span>
                                <button 
                                  onClick={() => updateCartQty(item.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-[13px] font-black text-slate-800 tracking-tight">
                                ₹{item.total.toFixed(2)}
                              </span>
                           </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/10">
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
                          <span className="text-[12px] font-black tracking-tight">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tax (5%)</span>
                          <span className="text-[12px] font-black tracking-tight">₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-[1px] bg-slate-800 my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-black text-emerald-400 uppercase tracking-widest">Total Pay</span>
                          <span className="text-2xl font-black tracking-tight">₹{total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                         <div className="grid grid-cols-2 gap-3">
                           <button className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                              Cash
                           </button>
                           <button className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                              <CreditCard className="w-3 h-3" /> Card/UPI
                           </button>
                         </div>
                         <button 
                           onClick={handleCheckout}
                           disabled={isProcessing || cart.length === 0}
                           className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[12px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/50"
                         >
                           {isProcessing ? 'Processing...' : 'Complete & Dispense'}
                           <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                    </div>

                  </div>
                )}
             </div>

          </div>
        </div>
      </div>
    </MedicalLayout>
  );
};

export default MedicalHubView;
