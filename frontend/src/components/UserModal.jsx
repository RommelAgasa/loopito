import { X, Gift } from 'lucide-react';
import { useState } from 'react';
import { API_BASE } from '../config';

export default function UserModal({ formData, onChange, onSubmit, onClose, formError, setFormError, setLoggedInUserId }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setFormError('');

    // 1️⃣ Local validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.passcode.trim()) {
      setFormError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Verify passcode
      const passcodeResponse = await fetch(`${API_BASE}api/passcodes/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: formData.passcode }),
      });

      const passcodeResult = await passcodeResponse.json();

      if (!passcodeResponse.ok) {
        setFormError(passcodeResult.message || 'Invalid or expired passcode');
        setIsLoading(false);
        return;
      }

      // Step 2: Verify if member exists
      const verifyResponse = await fetch(`${API_BASE}api/members/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
        }),
      });

      const verifyResult = await verifyResponse.json();

      console.log('Verify response:', verifyResult); // 👈 ADD THIS
      console.log('Member object:', verifyResult.member); // 👈 AND THIS

      if (!verifyResponse.ok) {
        setFormError(verifyResult.message || 'Member not found');
        setIsLoading(false);
        return;
      }

      const foundMember = verifyResult.member;

      // Check if member already picked
      if (foundMember.hasPick === 1) {
        setFormError(
          `${formData.firstName}, you have already made your pick! 🎁 Your secret recipient is waiting for you.`
        );
        setIsLoading(false);
        return;
      }

      //Save token & set user ID
      if (verifyResult.token) localStorage.setItem('userToken', verifyResult.token);
      setLoggedInUserId(foundMember._id);

      //Proceed to App
      onSubmit();
    } catch (err) {
      console.error('Validation error:', err);
      setFormError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-white to-emerald-50 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative border-4 border-red-600">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 animate-bounce" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">Join the Exchange</h2>
          <p className="text-emerald-700 text-xs sm:text-sm mt-1 font-semibold">
            Enter your details to get started
          </p>
        </div>

        <div className="space-y-4">
          {['firstName', 'lastName', 'passcode'].map((field) => (
            <div key={field}>
              <label className="block text-xs sm:text-sm font-semibold text-emerald-900 mb-2 capitalize">
                {field === 'firstName'
                  ? 'First Name'
                  : field === 'lastName'
                  ? 'Last Name'
                  : 'Passcode'}
              </label>
              <input
                type={field === 'passcode' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={onChange}
                disabled={isLoading}
                placeholder={field === 'passcode' ? '••••••' : field === 'firstName' ? 'First Name' : 'Last Name'}
                className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300 transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          ))}

          {formError && (
            <div className="bg-red-100 border-l-4 border-red-600 p-3 rounded">
              <p className="text-red-800 text-xs sm:text-sm font-semibold">{formError}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-emerald-700 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:from-red-700 hover:to-emerald-800 transition-all duration-200 mt-6 border-2 border-yellow-400 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Pick'}
          </button>
        </div>
      </div>
    </div>
  );
}
