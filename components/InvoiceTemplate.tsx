
import React from 'react';
import { Donation } from '../types';
import { RATION_ITEMS } from '../constants';

interface InvoiceTemplateProps {
  donation: Donation;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ donation }) => {
  const isRation = donation.type === 'ration';

  return (
    <div id="printable-invoice" className="bg-white p-8 max-w-2xl mx-auto border-2 border-slate-100 shadow-lg rounded-xl print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-xl">W</div>
            <h1 className="text-2xl font-black text-emerald-800 tracking-tight uppercase">WelfareLink</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium italic">Empowering Lives through Compassion</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Official Receipt</h2>
          <p className="text-sm font-mono text-slate-400">#{donation.id.toUpperCase()}</p>
        </div>
      </div>

      {/* Donor & Date Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em] mb-2">Donor Information</h3>
          <p className="font-bold text-slate-800 text-lg">{donation.userName}</p>
          <p className="text-sm text-slate-500">ID: {donation.userId}</p>
          <p className="text-sm text-slate-500">Date: {new Date(donation.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <h3 className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em] mb-2">Distribution Target</h3>
          <p className="font-bold text-slate-800">{donation.distribution.city}</p>
          <p className="text-sm text-slate-500">{donation.distribution.area}</p>
          <p className="text-sm text-emerald-600 font-medium">Est. {donation.distribution.date}</p>
        </div>
      </div>

      {/* Donation Details */}
      <div className="mb-8">
        <h3 className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em] mb-4">Contribution Summary</h3>
        <table className="w-full text-left">
          <thead className="border-b border-slate-200">
            <tr className="text-[10px] text-slate-400 font-bold uppercase">
              <th className="py-2">Description / Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Value (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isRation && donation.items ? (
              donation.items.map((di, idx) => {
                // Fixed: Use imported RATION_ITEMS directly
                const item = RATION_ITEMS.find((i) => i.id === di.itemId);
                return (
                  <tr key={idx} className="text-sm">
                    <td className="py-3 font-medium text-slate-700">{item?.name || 'Item'}</td>
                    <td className="py-3 text-center text-slate-500">{di.quantity}</td>
                    <td className="py-3 text-right font-mono">{( (item?.price || 0) * di.quantity).toLocaleString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-sm">
                <td className="py-3 font-medium text-slate-700">Financial Support for {donation.causeName}</td>
                <td className="py-3 text-center text-slate-500">1</td>
                <td className="py-3 text-right font-mono">{donation.totalAmount.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end border-t-2 border-slate-200 pt-4">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>PKR {donation.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-emerald-700 pt-2 border-t border-slate-100">
            <span>Total Value</span>
            <span>PKR {donation.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer / Watermark */}
      <div className="mt-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none transform -rotate-12">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <p className="text-xs text-slate-400 mb-2 italic">This is a computer-generated receipt for the purpose of a DBMS academic project.</p>
        <p className="text-[10px] text-slate-300">WelfareLink Foundation | Charity Reg: 123456 | Verified Contribution</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
