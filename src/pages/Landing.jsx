import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, Zap, Shield, ChevronRight, Hexagon, Triangle, Circle, Square } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      title: 'Smart Pipeline',
      description: 'Track every NEET lead from first contact to admission with our visual, intuitive pipeline stages.',
      icon: BarChart3,
    },
    {
      title: 'Lead Management',
      description: 'Easily import bulk Excel files, filter by NEET score, and manage hostel requirements in one place.',
      icon: Users,
    },
    {
      title: 'Lightning Fast',
      description: 'Built on modern web technologies ensuring your dashboard loads instantly, even with thousands of records.',
      icon: Zap,
    },
    {
      title: 'Enterprise Security',
      description: 'Your lead data is secured by industry-leading cloud infrastructure with robust access controls.',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 selection:bg-indigo-500/30 font-sans selection:text-white">
      {/* Animated Background Objects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none bg-slate-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAwLCAwLCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-50"></div>
        
        {/* Floating Geometric Objects */}
        <div className="absolute top-[10%] left-[10%] text-indigo-300/40 animate-[spin_20s_linear_infinite] animate-blob">
          <Hexagon className="w-32 h-32" strokeWidth={1} />
        </div>
        <div className="absolute top-[30%] right-[15%] text-purple-300/40 animate-[spin_15s_linear_infinite_reverse] animate-blob animation-delay-2000">
          <Triangle className="w-24 h-24" strokeWidth={1} />
        </div>
        <div className="absolute bottom-[20%] left-[20%] text-blue-300/40 animate-[spin_25s_linear_infinite] animate-blob animation-delay-4000">
          <Circle className="w-40 h-40" strokeWidth={1} />
        </div>
        <div className="absolute bottom-[30%] right-[25%] text-pink-300/40 animate-[spin_18s_linear_infinite_reverse] animate-blob">
          <Square className="w-20 h-20" strokeWidth={1} />
        </div>
        
        {/* Subtle glow behind objects */}
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[15%] w-[30%] h-[30%] bg-purple-200/30 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20" />
              <img src="/logo.png" alt="Zuna Logo" className="w-10 h-10 object-contain relative z-10" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">Zuna<span className="text-indigo-600"></span></span>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-all text-sm border border-gray-200 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all text-sm shadow-md hover:shadow-lg border border-transparent"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-32 sm:pb-40 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Zuna CRM 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-gray-900 animate-fade-in-up delay-100">
            Manage NEET Leads <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
              Like a Professional.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium animate-fade-in-up delay-200">
            The ultimate CRM built specifically for NEET coaching institutes. Track scores, hostel requirements, and boost your admission conversion rates effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link 
              to={currentUser ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg hover:-translate-y-0.5"
            >
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 font-bold transition-all border border-gray-200 shadow-sm flex items-center justify-center gap-2 text-lg hover:-translate-y-0.5"
            >
              Explore Features
            </a>
          </div>

          {/* Abstract Dashboard Preview (3D Floating) */}
          <div className="mt-20 md:mt-32 relative mx-auto max-w-5xl mb-10 md:mb-20 animate-fade-in-up delay-400">
            {/* The Floating Container */}
            <div className="relative w-full max-w-4xl mx-auto animate-floating-3d group">
              
              {/* Decorative Glow behind the dashboard */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
              
              {/* Main Dashboard UI Mockup */}
              <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl p-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-80" />
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
                  alt="Dashboard Preview" 
                  className="rounded-xl w-full object-cover shadow-inner opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 pointer-events-none rounded-2xl" />
              </div>

              {/* Floating Element 1 - Stats Card */}
              <div className="absolute -left-12 top-1/4 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/50 floating-layer-1 w-56 hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conversion</p>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">+42%</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">From last month</p>
              </div>

              {/* Floating Element 2 - Notification Pill */}
              <div className="absolute -right-8 bottom-1/4 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 floating-layer-2 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner border-2 border-white">
                    SK
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">New Admission!</p>
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-0.5">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900">Everything you need to scale</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Stop managing leads in spreadsheets. Zuna gives you the tools to manage thousands of inquiries without breaking a sweat.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 hover:shadow-md transition-all group cursor-default">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl animate-gradient-x bg-[length:200%_200%]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] animate-blob" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px] animate-blob animation-delay-2000" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10 text-white">Ready to boost your admissions?</h2>
            <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
              Join the top institutes using Zuna to streamline their NEET admission workflow.
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-900 hover:bg-gray-50 font-bold transition-all shadow-xl text-lg relative z-10 hover:-translate-y-0.5"
            >
              Create free account <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Zuna" className="w-6 h-6 object-contain grayscale opacity-70" />
            <span className="text-gray-500 font-bold">© {new Date().getFullYear()} Zuna CRM. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
