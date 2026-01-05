
import React, { useState, useEffect, useMemo } from 'react';
import { User, Cause, Donation, RationItem, CauseCategory } from '../types';
import { CAUSES, RATION_ITEMS, CITIES, AREAS } from '../constants';
import { dbService } from '../services/dbService';
import { getKitSuggestions } from '../services/geminiService';
import InvoiceTemplate from './InvoiceTemplate';

interface DonateProps {
  user: User;
  onSuccess: () => void;
}

const Donate: React.FC<DonateProps> = ({ user, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCauseId, setSelectedCauseId] = useState<string>('');
  const [donationType, setDonationType] = useState<'money' | 'ration'>('money');
  const [moneyAmount, setMoneyAmount] = useState<number>(1000);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [aiSuggestion, setAiSuggestion] = useState<{ kitName: string, suggestedItems: string[] } | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [recentDonation, setRecentDonation] = useState<Donation | null>(null);

  const selectedCause = CAUSES.find(c => c.id === selectedCauseId);

  useEffect(() => {
    if (selectedCause) {
      setIsLoadingSuggestion(true);
      getKitSuggestions(selectedCause.name).then(suggestion => {
        setAiSuggestion(suggestion);
        setIsLoadingSuggestion(false);
      });
    }
  }, [selectedCauseId]);

  const rationTotal = useMemo(() => {
    return Object.entries(quantities).reduce((total, [id, qty]) => {
      const item = RATION_ITEMS.find(i => i.id === id);
      const quantityValue = qty as number;
      return total + (item ? item.price * quantityValue : 0);
    }, 0); // Corrected initial value from [quantities] to 0
  }, [quantities]);

  const handleQuantityChange = (id: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, qty) }));
  };

  const distributionDetails = useMemo(() => {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const area = AREAS[Math.floor(Math.random() * AREAS.length)];
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return { city, area, date: date.toLocaleDateString() };
  }, [selectedCauseId]);

  const handleSubmit = () => {
    const donation: Donation = {
      id: `don-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      causeId: selectedCauseId,
      causeName: selectedCause?.name || '',
      type: donationType,
      totalAmount: donationType === 'money' ? Number(moneyAmount) : Number(rationTotal),
      items: donationType === 'ration' ? Object.entries(quantities).map(([itemId, quantity]) => ({ itemId, quantity: quantity as number })) : [],
      distribution: distributionDetails,
      createdAt: new Date().toISOString(),
    };

    dbService.addDonation(donation);
    setRecentDonation(donation);
    setStep(4);
  };

  const handlePrint = () => {
    window.print();
  };

  if (step === 4 && recentDonation) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
           <div className="bg-emerald-600 p-12 text-center text-white relative overflow-hidden print:hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L19.15 19H4.85L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
              </div>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-4xl font-black mb-2 tracking-tight">Donation Successful!</h2>
              <p className="text-emerald-100 text-lg opacity-90 max-w-md mx-auto">Your generous contribution is now being processed for distribution to {recentDonation.distribution.city}.</p>
           </div>
           
           <div className="p-8 print:p-0">
             <div className="mb-8 flex justify-between items-center print:hidden">
                <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Official Receipt Preview</h3>
                <button 
                  onClick={handlePrint}
                  className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-900 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  Print Invoice
                </button>
             </div>

             <InvoiceTemplate donation={recentDonation} />

             <div className="mt-8 flex justify-center gap-4 print:hidden">
                <button 
                  onClick={onSuccess}
                  className="text-emerald-600 font-bold border-2 border-emerald-600 px-8 py-3 rounded-xl hover:bg-emerald-50 transition-all"
                >
                  Back to Home
                </button>
                <button 
                  onClick={() => {
                    setStep(1);
                    setSelectedCauseId('');
                    setQuantities({});
                  }}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Make Another Donation
                </button>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-emerald-700 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Contribution Center</h2>
          <p className="text-emerald-100 mt-1 italic">"Your charity will not go unrewarded."</p>
        </div>

        <div className="p-8">
          <div className="flex items-center mb-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>1</div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>2</div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>3</div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800">Select a Cause</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(CauseCategory).map((cat) => (
                  <div key={cat} className="space-y-3">
                    <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">{cat}</h4>
                    {CAUSES.filter(c => c.category === cat).map(cause => (
                      <button
                        key={cause.id}
                        onClick={() => setSelectedCauseId(cause.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCauseId === cause.id ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500' : 'border-slate-200 hover:border-emerald-300'}`}
                      >
                        <p className="font-semibold text-slate-700">{cause.name}</p>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-6">
                <button 
                  disabled={!selectedCauseId}
                  onClick={() => setStep(2)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800">Donation Details</h3>
              <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                <button 
                  onClick={() => setDonationType('money')}
                  className={`flex-1 py-3 rounded-md font-bold transition-all ${donationType === 'money' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Money Donation
                </button>
                <button 
                  onClick={() => setDonationType('ration')}
                  className={`flex-1 py-3 rounded-md font-bold transition-all ${donationType === 'ration' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Ration Donation
                </button>
              </div>

              {donationType === 'money' ? (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                   <label className="block text-sm font-medium text-slate-600 mb-2">Enter Amount (PKR)</label>
                   <input 
                    type="number" 
                    value={moneyAmount}
                    onChange={(e) => setMoneyAmount(parseInt(e.target.value) || 0)}
                    className="w-full text-3xl font-bold bg-transparent border-b-2 border-emerald-300 focus:border-emerald-600 outline-none py-2"
                   />
                </div>
              ) : (
                <div className="space-y-6">
                   {isLoadingSuggestion ? (
                     <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-pulse flex items-center gap-3">
                        <div className="w-4 h-4 bg-emerald-300 rounded-full animate-bounce"></div>
                        <span className="text-emerald-700 text-sm font-bold">Gemini is suggesting a kit...</span>
                     </div>
                   ) : aiSuggestion && (
                     <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl group relative">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                          <span className="bg-emerald-600 text-white p-1 rounded-full text-[10px] uppercase">AI Suggested</span>
                          {aiSuggestion.kitName}
                        </div>
                        <ul className="text-sm text-emerald-700 space-y-1">
                          {aiSuggestion.suggestedItems.map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                     </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2">
                     {RATION_ITEMS.map(item => (
                       <div key={item.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-700">{item.name}</p>
                            <p className="text-xs text-slate-500">PKR {item.price} / {item.unit}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}
                              className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >-</button>
                            <span className="w-8 text-center font-bold">{quantities[item.id] || 0}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                              className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >+</button>
                          </div>
                       </div>
                     ))}
                   </div>

                   <div className="p-4 bg-slate-800 text-white rounded-xl flex justify-between items-center">
                      <span className="font-medium">Total Ration Value</span>
                      <span className="text-2xl font-bold">PKR {rationTotal.toLocaleString()}</span>
                   </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button onClick={() => setStep(1)} className="text-slate-500 font-medium px-4">Back</button>
                <button 
                  disabled={donationType === 'money' ? moneyAmount <= 0 : rationTotal <= 0}
                  onClick={() => setStep(3)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50"
                >
                  Next: Transparency
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800">Transparency & Confirmation</h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                  <span className="text-amber-800 font-medium">Cause</span>
                  <span className="font-bold">{selectedCause?.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                  <span className="text-amber-800 font-medium">Donation Type</span>
                  <span className="font-bold uppercase text-xs tracking-widest">{donationType}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-amber-900 font-bold">Total Contribution</span>
                  <span className="text-emerald-700 font-black">PKR {(donationType === 'money' ? Number(moneyAmount) : Number(rationTotal)).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
                <h4 className="font-bold text-slate-700 mb-4 border-b pb-2">Distribution Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 uppercase text-[10px] font-bold">Target City</p>
                    <p className="font-semibold text-slate-800 text-lg">{distributionDetails.city}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase text-[10px] font-bold">Target Area</p>
                    <p className="font-semibold text-slate-800 text-lg">{distributionDetails.area}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 uppercase text-[10px] font-bold">Estimated Distribution Date</p>
                    <p className="font-semibold text-slate-800 text-lg">{distributionDetails.date}</p>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 italic">Note: Distribution locations may change slightly based on immediate need and safety protocols.</p>
              </div>

              <div className="flex justify-between pt-6">
                <button onClick={() => setStep(2)} className="text-slate-500 font-medium px-4">Back</button>
                <button 
                  onClick={handleSubmit}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700"
                >
                  Confirm & Complete Donation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
