import { useState, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Snowfall from '../components/Snowfall';

export default function Admin() {
  const navigate = useNavigate();

  // States
  const [members, setMembers] = useState([]);
  const [passcodes, setPasscodes] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [expirationDays, setExpirationDays] = useState('');
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [passcodeLoading, setPasscodeLoading] = useState(false);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('adminToken');

  // Fetch members and passcodes on mount
  useEffect(() => {
    fetchMembers();
    fetchPasscodes();
  }, []);

  // Fetch all members
  const fetchMembers = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('/api/members', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/');
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        setMembers(result.members);
      }
    } catch (err) {
      console.error('Fetch members error:', err);
    }
  };

  // Fetch all passcodes
  const fetchPasscodes = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/passcodes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch passcodes');
        return;
      }

      const result = await response.json();
      if (result.success) {
        setPasscodes(result.passcodes);
      }
    } catch (err) {
      console.error('Fetch passcodes error:', err);
    }
  };

  // Add or update member
  const handleAddMember = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = getToken();
      const url = editingMemberId ? `/api/members/${editingMemberId}` : '/api/members';
      const method = editingMemberId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          firstname: firstName, 
          lastname: lastName 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to save member');
        setLoading(false);
        return;
      }

      // Update local state
      if (editingMemberId) {
        setMembers(
          members.map(m => m._id === editingMemberId ? result.member : m)
        );
      } else {
        setMembers([...members, result.member]);
      }

      // Reset form
      setFirstName('');
      setLastName('');
      setEditingMemberId(null);
    } catch (err) {
      console.error('Add/Update member error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete member
  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const token = getToken();
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMembers(members.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error('Delete member error:', err);
    }
  };

  // Edit member
  const handleEditMember = (member) => {
    setFirstName(member.firstname);
    setLastName(member.lastname);
    setEditingMemberId(member._id);
  };

  // Add passcode
  const handleAddPasscode = async () => {
    if (!passcode.trim() || !expirationDays.trim()) {
      setPasscodeError('Please fill in all fields');
      return;
    }

    setPasscodeLoading(true);
    setPasscodeError('');

    try {
      const token = getToken();
      const response = await fetch('/api/passcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: passcode,
          expirationDays: parseInt(expirationDays),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setPasscodeError(result.message || 'Failed to create passcode');
        setPasscodeLoading(false);
        return;
      }

      // Add to local state
      setPasscodes([...passcodes, result.passcode]);

      // Reset form
      setPasscode('');
      setExpirationDays('');
    } catch (err) {
      console.error('Add passcode error:', err);
      setPasscodeError('Network error. Please try again.');
    } finally {
      setPasscodeLoading(false);
    }
  };

  // Delete passcode
  const handleDeletePasscode = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const token = getToken();
      const response = await fetch(`/api/passcodes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPasscodes(passcodes.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Delete passcode error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">
      <Snowfall />

      <Header onNavigateHome={() => navigate('/')} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-4 border-emerald-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Members Section */}
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-4">Members</h3>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-600 p-3 rounded mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                  className="px-4 py-3 border-4 border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                  className="px-4 py-3 border-4 border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <button
                onClick={handleAddMember}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-emerald-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all border-2 border-yellow-400 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingMemberId ? 'Update Member' : 'Add Member'}
              </button>

              <div className="mt-6 overflow-x-auto border-4 border-emerald-700 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-emerald-700 text-white">
                      <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length > 0 ? members.map(member => (
                      <tr key={member._id} className="border-t-2 border-emerald-300 hover:bg-emerald-50">
                        <td className="px-4 py-3 text-emerald-900 font-semibold text-sm">{member.firstname} {member.lastname}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditMember(member)}
                              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member._id)}
                              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-6 text-center text-emerald-600 text-sm">No members added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Passcodes Section */}
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-4">Passcodes</h3>
              
              {passcodeError && (
                <div className="bg-red-100 border-l-4 border-red-600 p-3 rounded mb-4">
                  <p className="text-red-800 text-sm">{passcodeError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPasscode()}
                  className="px-4 py-3 border-4 border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Days before expiration"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPasscode()}
                  className="px-4 py-3 border-4 border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <button
                onClick={handleAddPasscode}
                disabled={passcodeLoading}
                className="w-full bg-gradient-to-r from-red-600 to-emerald-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all border-2 border-yellow-400 disabled:opacity-50 mb-6"
              >
                {passcodeLoading ? 'Creating...' : 'Add Passcode'}
              </button>

              <div className="overflow-x-auto border-4 border-emerald-700 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-emerald-700 text-white">
                      <th className="px-4 py-3 text-left text-sm font-bold">Passcode</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Expiration Date</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passcodes.length > 0 ? passcodes.map(p => (
                      <tr key={p._id} className="border-t-2 border-emerald-300 hover:bg-emerald-50">
                        <td className="px-4 py-3 text-emerald-900 font-semibold text-sm">{p.code}</td>
                        <td className="px-4 py-3 text-emerald-900 font-semibold text-sm">
                          {new Date(p.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeletePasscode(p._id)}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-6 text-center text-emerald-600 text-sm">No passcodes set</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}