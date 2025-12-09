import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

export default function PickGrid({ picks, onPick, selectedName, userInfo, loggedInUserId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [christmasImages, setChristmasImages] = useState({});

  const christmasEmojis = [
    '🎅', '🦌', '⛄', '🎄', '🎁', '🔔', '⛸️', 
    '❄️', '☃️', '🧝', '🕯️', '🍷', '🍪', '🎀', 
    '⛪', '🔥', '👼', '💚', '❤️', '🌟', '✨', '🎊', 
    '🎉', '🛷', '🏂', '⛷️'
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const shuffleMembers = (list) => {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const imageMap = {};
    shuffled.forEach(member => {
      imageMap[member._id] = christmasEmojis[Math.floor(Math.random() * christmasEmojis.length)];
    });
    setChristmasImages(imageMap);
    return shuffled;
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE}api/members`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setMembers(shuffleMembers(result.members));
      }
    } catch (err) {
      console.error('Fetch members error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickMember = async (member) => {
    if (picks[member._id] || member.isPick === 1) return;

    // Prevent self-pick
    if (
      member.firstname.toLowerCase() === userInfo.firstName.toLowerCase() &&
      member.lastname.toLowerCase() === userInfo.lastName.toLowerCase()
    ) {
      alert("Oops! You can't pick yourself. Cards are reshuffling...");
      setMembers(shuffleMembers(members));
      return;
    }

    // Optimistic UI update
    setMembers(prev =>
      prev.map(m => m._id === member._id ? { ...m, isPick: 1 } : m)
    );
    onPick({ id: member._id, name: member.firstname });

    try {
      const token = localStorage.getItem('userToken');

      // Update picked member
      await fetch(`${API_BASE}api/members/pick/${member._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          isPick: 1,
          pickMember: loggedInUserId
        }),
      });

      // Update the picker (current user)
      await fetch(`${API_BASE}api/members/pick/${loggedInUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          hasPick: 1, // mark that they have picked someone
        }),
      });

      // Update current user
      if (loggedInUserId) {
        await fetch(`${API_BASE}api/members/${loggedInUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            hasPick: 1,
            isPick: 0,
            pickMember: member._id // <-- save which member they picked
          }),
        });
      }

    } catch (err) {
      console.error('Error updating pick:', err);
      // Rollback if needed
      setMembers(prev =>
        prev.map(m => m._id === member._id ? { ...m, isPick: 0 } : m)
      );
    }
  };

  // Filter out members that have already been picked
  const availableMembers = members.filter(m => m.isPick !== 1);

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-emerald-700 max-w-4xl mx-auto text-center">
      <p className="text-emerald-900 font-semibold">Loading members...</p>
    </div>
  );

  if (availableMembers.length === 0) return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-emerald-700 max-w-4xl mx-auto text-center">
      <p className="text-emerald-900 font-semibold">No members available</p>
    </div>
  );

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl p-4 sm:p-6 mb-8 border-4 border-emerald-700 max-w-4xl mx-auto ${selectedName ? 'opacity-50 pointer-events-none bg-gray-100' : ''}`}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-6 text-center">
        🎁 Pick Your Secret Santa Recipient 🎁
      </h2>

      {userInfo && (
        <p className="text-center text-emerald-700 text-sm font-semibold mb-4">
          Welcome, <span className="text-red-600">{userInfo.firstName}</span>! Choose wisely 🎄
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {availableMembers.map(member => {
          const isPicked = picks[member._id];
          return (
            <button
              key={member._id}
              onClick={() => !isPicked && handlePickMember(member)}
              disabled={isPicked}
              className={`aspect-square rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 p-3 ${
                isPicked
                  ? 'bg-gray-300 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-br from-red-100 to-emerald-100 hover:shadow-lg hover:scale-105 cursor-pointer active:scale-95 border-2 border-red-300 hover:border-red-500'
              }`}
            >
              <span className="text-5xl sm:text-6xl">{christmasImages[member._id] || '🎅'}</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 text-center line-clamp-2">
                {isPicked ? member.firstname : '?'}
              </span>
              <span className={`text-xs font-semibold ${isPicked ? 'opacity-100 text-gray-700' : ''}`}>
                {isPicked ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}