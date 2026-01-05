
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
             <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-xs">W</div>
             WelfareLink
          </h3>
          <p className="text-sm leading-relaxed">
            Inspired by the legacy of humanitarian service, we aim to provide 
            transparent and efficient donation management to those in need.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-400">About Us</a></li>
            <li><a href="#" className="hover:text-emerald-400">Annual Reports</a></li>
            <li><a href="#" className="hover:text-emerald-400">Distribution Tracking</a></li>
            <li><a href="#" className="hover:text-emerald-400">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Info</h4>
          <p className="text-sm">Main Welfare Complex, Block 4</p>
          <p className="text-sm">Karachi, Pakistan</p>
          <p className="text-sm mt-2">Email: info@welfarelink.org</p>
          <p className="text-sm">Helpline: 111-222-333</p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        <p>© 2024 WelfareLink Foundation. All rights reserved. Registered Charity No. 123456</p>
      </div>
    </footer>
  );
};

export default Footer;
