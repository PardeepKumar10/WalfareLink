
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { Donation } from '../types';
import InvoiceTemplate from './InvoiceTemplate';

const AdminPanel: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>(dbService.getDonations());
  const [selectedInvoice, setSelectedInvoice] = useState<Donation | null>(null);

  const totalFunds = donations.reduce((sum, d) => sum + d.totalAmount, 0);

  const handlePrint = (donation: Donation) => {
    setSelectedInvoice(donation);
    setTimeout(() => {
      window.print();
      // Reset after print dialog
      setSelectedInvoice(null);
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Hidden container for printing single invoices from list */}
      <div className="hidden print:block">
        {selectedInvoice && <InvoiceTemplate donation={selectedInvoice} />}
      </div>

      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Admin Oversight Panel</h2>
          <p className="text-slate-500">Monitoring welfare distribution and contributions.</p>
        </div>
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg text-right">
          <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Total Impact Value</p>
          <p className="text-3xl font-black">PKR {totalFunds.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 print:hidden">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Donations</p>
          <p className="text-2xl font-bold text-slate-800">{donations.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Money Entries</p>
          <p className="text-2xl font-bold text-slate-800">{donations.filter(d => d.type === 'money').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Ration Packs</p>
          <p className="text-2xl font-bold text-slate-800">{donations.filter(d => d.type === 'ration').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Active Cities</p>
          <p className="text-2xl font-bold text-slate-800">{new Set(donations.map(d => d.distribution.city)).size}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">Recent Contribution Records</h3>
          <span className="text-xs text-slate-400">Showing {donations.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Donor</th>
                <th className="px-6 py-3">Cause</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Distribution Target</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">No donation records found.</td>
                </tr>
              ) : (
                donations.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{d.userName}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{d.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold uppercase">{d.causeName}</span>
                    </td>
                    <td className="px-6 py-4 capitalize text-sm font-medium text-slate-600">{d.type}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">PKR {d.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{d.distribution.city}</p>
                      <p className="text-xs text-slate-400">{d.distribution.area}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handlePrint(d)}
                        className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                        title="Print Invoice"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
