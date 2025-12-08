import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

export default function PickGrid({ picks, onPick, selectedName, userInfo, loggedInUserId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [christmasImages, setChristmasImages] = useState({});

  // Christmas image URLs - you can replace with API if needed
  const christmasEmojis = [
    '🎅', '🤶', '🦌', '⛄', '🎄', '🎁', '🔔', '⛸️', '❄️', '☃️'
  ];

  // Fetch members on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}api/members'`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Shuffle members for randomness
        const shuffled = [...result.members].sort(() => Math.random() - 0.5);
        setMembers(shuffled);
        
        // Assign random Christmas emoji to each member
        const imageMap = {};
        shuffled.forEach((member) => {
          imageMap[member._id] = christmasEmojis[Math.floor(Math.random() * christmasEmojis.length)];
        });
        setChristmasImages(imageMap);
      }
    } catch (err) {
      console.error('Fetch members error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickMember = async (member) => {
    // Prevent multiple clicks
    if (picks[member._id]) return;

    try {
      const token = localStorage.getItem('adminToken');

      // Update the picked member's isPick to 1
      const pickResponse = await fetch(`${API_BASE}api/members/${member._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: member.firstname,
          lastname: member.lastname,
          isPick: 1,
          hasPick: member.hasPick,
        }),
      });

      if (!pickResponse.ok) {
        console.error('Failed to update picked member');
        return;
      }

      // Update the logged-in user's hasPick to 1
      if (loggedInUserId) {
        const currentUserResponse = await fetch(`${API_BASE}api/members/${loggedInUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            hasPick: 1,
            isPick: 0,
          }),
        });

        if (!currentUserResponse.ok) {
          console.error('Failed to update current user hasPick');
        }
      }

      // Update local member state
      setMembers(members.map(m => 
        m._id === member._id ? { ...m, isPick: 1 } : m
      ));
      
      // Call parent onPick function
      onPick({ id: member._id, name: member.firstname });
      
      console.log(`✅ ${userInfo.firstName} picked ${member.firstname}`);
    } catch (err) {
      console.error('Error updating member pick status:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-emerald-700 max-w-4xl mx-auto text-center">
        <p className="text-emerald-900 font-semibold">Loading members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-emerald-700 max-w-4xl mx-auto text-center">
        <p className="text-emerald-900 font-semibold">No members available</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl p-4 sm:p-6 mb-8 border-4 border-emerald-700 max-w-4xl mx-auto ${
        selectedName ? 'opacity-50 pointer-events-none bg-gray-100' : ''
      }`}
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
        {members.map((member) => {
          const isPicked = picks[member._id];
          const isAlreadyPicked = member.isPick === 1;
          
          return (
            <button
              key={member._id}
              onClick={() => !isPicked && !isAlreadyPicked && handlePickMember(member)}
              disabled={isPicked || isAlreadyPicked}
              className={`aspect-square rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 p-3
                ${
                  isPicked || isAlreadyPicked
                    ? 'bg-gray-300 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-br from-red-100 to-emerald-100 hover:shadow-lg hover:scale-105 cursor-pointer active:scale-95 border-2 border-red-300 hover:border-red-500'
                }
              `}
            >
              <span className="text-5xl sm:text-6xl">{christmasImages[member._id] || '🎅'}</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 text-center line-clamp-2">
                {isPicked ? member.firstname : isAlreadyPicked ? 'Picked' : '?'}
              </span>
              <span className={`text-xs font-semibold ${(isPicked || isAlreadyPicked) ? 'opacity-100 text-gray-700' : ''}`}>
                {(isPicked || isAlreadyPicked) ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-emerald-700 text-xs sm:text-sm font-semibold mt-6">
        📝 {Object.keys(picks).length + members.filter(m => m.isPick === 1).length} of {members.length} picked
      </p>
    </div>
  );
}