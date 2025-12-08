import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Snowfall from '../components/Snowfall';
import UserModal from '../components/UserModal';
import AdminModal from '../components/AdminModal';
import PickGrid from '../components/PickGrid';
import ThankYou from '../components/Thankyou';

export default function App() {
  const navigate = useNavigate();

  // States
  const [picks, setPicks] = useState({});
  const [selectedName, setSelectedName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', passcode: '' });
  const [adminFormData, setAdminFormData] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState('');
  const [adminFormError, setAdminFormError] = useState('');
  const [hasPickedOnce, setHasPickedOnce] = useState(false);
  const [showPickedName, setShowPickedName] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Form Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError('');
  };

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData({ ...adminFormData, [name]: value });
    setAdminFormError('');
  };

  const handleFormSubmit = () => {
    setUserInfo({ 
      fullName: `${formData.firstName} ${formData.lastName}`, 
      firstName: formData.firstName, 
      lastName: formData.lastName 
    });
    setIsModalOpen(false);
  };

  const handleAdminModalClose = () => {
    setIsAdminModalOpen(false);
    setAdminFormData({ username: '', password: '' });
    setAdminFormError('');
  };

  const handlePick = (item) => {
    if (!picks[item.id]) {
      setPicks({ ...picks, [item.id]: item.name });
      setSelectedName(item.name);
      setShowPickedName(true);
      setTimeout(() => {
        setSelectedName(null);
        setHasPickedOnce(true);
        setTimeout(() => setShowPickedName(false), 5000);
      }, 10000);
    }
  };

  const handleRestart = () => {
    setHasPickedOnce(false);
    setPicks({});
    setFormData({ firstName: '', lastName: '', passcode: '' });
    setUserInfo(null);
    setShowPickedName(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">
      <Snowfall />

      <Header
        onNavigateHome={() => navigate('/')}
        onAdminClick={() => setIsAdminModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
        {!hasPickedOnce ? (
          !userInfo ? (
            <div className="flex flex-col items-center justify-center min-h-96">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center border-4 border-emerald-700 max-w-sm">
                <div className="text-6xl mb-6">🎁</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-4">Welcome to Loopito!</h2>
                <p className="text-emerald-700 font-semibold mb-8">Click the button below to make your Secret Santa pick.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-red-600 to-emerald-700 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:from-red-700 hover:to-emerald-800 transition-all duration-200 border-2 border-yellow-400 text-base"
                >
                  Make a Pick
                </button>
              </div>
            </div>
          ) : (
            <PickGrid picks={picks} onPick={handlePick} selectedName={selectedName} userInfo={userInfo} loggedInUserId={loggedInUserId} />
          )
        ) : (
          <ThankYou picks={picks} showPickedName={showPickedName} onRestart={handleRestart} />
        )}

        {selectedName && !hasPickedOnce && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-20 p-4">
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-2xl shadow-2xl px-6 sm:px-8 py-6 text-center animate-bounce border-4 border-red-600 max-w-xs">
              <p className="text-red-900 text-xs sm:text-sm font-bold mb-2">🎄 YOU GOT: 🎄</p>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-900">{selectedName}</p>
              <p className="text-xs text-red-800 mt-3 font-semibold">🤐 Keep it secret! 🤐</p>
            </div>
          </div>
        )}
      </main>

      {isModalOpen && (
        <UserModal
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
          formError={formError}
          setFormError={setFormError}
          setLoggedInUserId={setLoggedInUserId}
        />
      )}

      {isAdminModalOpen && (
        <AdminModal
          data={adminFormData}
          onChange={handleAdminFormChange}
          onClose={handleAdminModalClose}
          error={adminFormError}
        />
      )}
    </div>
  );
}