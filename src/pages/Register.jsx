import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      setLoading(true);
      await signup(email, password, name);
      navigate('/');
    } catch (error) {
      toast.error('Failed to create an account. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Left Side: Gradient Banner */}
        <div className="hidden md:flex md:w-[45%] relative p-10 flex-col justify-between overflow-hidden m-2 rounded-2xl">
          {/* Complex CSS Mesh Gradient Background matching the new brand color */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#58112E] via-[#86305a] to-[#d6abc2] opacity-90 z-0"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-[#bd7b9e] rounded-full mix-blend-screen filter blur-[80px] opacity-60 z-0"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[80%] bg-[#4c1129] rounded-full mix-blend-screen filter blur-[100px] opacity-40 z-0"></div>
          <div className="absolute inset-0 bg-white/10 z-0"></div>

          <div className="relative z-10 text-white mt-auto">
            <h2 className="text-3xl font-bold leading-tight">
              Start managing your NEET leads efficiently and securely today.
            </h2>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
          
          <h2 className="text-[32px] font-bold text-gray-900 mb-3 tracking-tight">Create an account</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-sm">
            Create a Zuna workspace to start tracking and converting your leads.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Your email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors text-sm"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex justify-center items-center h-[52px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Get Started"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
