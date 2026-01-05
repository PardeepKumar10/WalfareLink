
import React from 'react';

interface LandingPageProps {
  onDonateClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onDonateClick }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/charity/1920/1080" 
            className="w-full h-full object-cover brightness-50" 
            alt="Hero Background"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Compassion Beyond <span className="text-emerald-400 underline decoration-4 underline-offset-8">Boundaries</span>
            </h1>
            <p className="text-xl text-slate-200">
              Join us in our mission to eradicate hunger and provide social security to 
              vulnerable communities across the country.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onDonateClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transform transition-transform hover:scale-105"
              >
                Donate Now
              </button>
              <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg">
                View Impact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 -mt-24 relative z-20">
        {[
          { label: 'Families Supported', val: '250,000+' },
          { label: 'Meals Served Daily', val: '125,000' },
          { label: 'Cities Covered', val: '45+' },
          { label: 'Success Ratio', val: '99%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
            <p className="text-4xl font-black text-emerald-600 mb-2">{stat.val}</p>
            <p className="text-slate-500 font-medium uppercase text-xs tracking-widest">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Core Programs</h2>
          <div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Ration Distribution', 
              desc: 'Monthly provision of essential food items to families registered with our system.',
              img: 'https://picsum.photos/seed/food/400/250'
            },
            { 
              title: 'Disaster Emergency', 
              desc: 'Rapid response teams for floods, earthquakes, and other natural calamities.',
              img: 'https://picsum.photos/seed/disaster/400/250'
            },
            { 
              title: 'Medical Support', 
              desc: 'Subsidized health services and medicine distribution for underprivileged patients.',
              img: 'https://picsum.photos/seed/medical/400/250'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                <button 
                  onClick={onDonateClick}
                  className="text-emerald-600 font-bold text-sm hover:underline"
                >
                  Contribute →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-emerald-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <blockquote className="text-3xl italic font-serif leading-relaxed">
            "The best of people are those who are most useful to others."
          </blockquote>
          <div className="w-16 h-1 bg-emerald-400 mx-auto"></div>
          <p className="uppercase tracking-[0.2em] font-bold text-emerald-400">Humanitarian Ethos</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
