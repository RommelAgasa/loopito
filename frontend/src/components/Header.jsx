import { Gift, User } from 'lucide-react';

export default function Header({ onNavigateHome, onAdminClick }) {
  return (
    <header className="bg-gradient-to-r from-emerald-800 to-red-800 text-white shadow-2xl border-b-4 border-yellow-400 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition cursor-pointer">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-bounce" />
            <h1 className="text-2xl sm:text-4xl font-bold text-yellow-300">Loopito</h1>
          </button>
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 bg-yellow-400 text-emerald-900 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-yellow-300 transition"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
        <p className="text-yellow-200 mt-2 text-xs sm:text-sm">✨ Secret Santa Gift Exchange Made Fun! ✨</p>
      </div>
    </header>
  );
}
