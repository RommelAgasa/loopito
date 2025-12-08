import { X, User, Loader } from 'lucide-react';
import { useState } from 'react';
import { API_BASE, FRONTEND_BASE } from '../config';

export default function AdminModal({ data, onChange, onClose, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(error || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    try {
      // Validate inputs
      if (!data.username.trim() || !data.password.trim()) {
        setLocalError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      // Call login API
      const response = await fetch(`${API_BASE}api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setLocalError(result.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      if (result.success && result.token) {
        // Store token in localStorage
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.admin));

        // Close modal and redirect to admin dashboard
        onClose();
        window.location.href = `${FRONTEND_BASE}/admin`;
      } else {
        setLocalError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-white to-red-50 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative border-4 border-emerald-700">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-700" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">Admin Login</h2>
          <p className="text-emerald-700 text-xs sm:text-sm mt-1 font-semibold">
            Enter your credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['username', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-xs sm:text-sm font-semibold text-emerald-900 mb-2 capitalize">
                {field}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={data[field]}
                onChange={onChange}
                disabled={isLoading}
                placeholder={field === 'password' ? '••••••' : 'username'}
                className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-300 transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          ))}

          {localError && (
            <div className="bg-red-100 border-l-4 border-red-600 p-3 rounded">
              <p className="text-red-800 text-xs sm:text-sm font-semibold">{localError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-700 to-red-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all mt-6 border-2 border-yellow-400 text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}